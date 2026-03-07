import logging
import re
import statistics
from typing import List, Optional

from src.domain.entities.ligne_devis import LigneDevis
from src.domain.entities.prix_cache import PrixCache
from src.domain.value_objects.niveau_confiance import NiveauConfiance
from src.domain.value_objects.type_ligne import TypeLigne
from src.domain.repositories.prix_cache_repository import PrixCacheRepository
from src.infrastructure.llm.groq_client import GroqClient
from src.infrastructure.search.searxng_search import SearXNGSearch

logger = logging.getLogger(__name__)


class PrixService:
    def __init__(
        self,
        prix_cache_repo: PrixCacheRepository,
        groq_client: GroqClient,
        searxng: SearXNGSearch,
    ):
        self.prix_cache_repo = prix_cache_repo
        self.groq = groq_client
        self.searxng = searxng

    async def estimer_prix_ligne(self, ligne: LigneDevis) -> LigneDevis:
        logger.info(f"[PRIX] Début estimation: '{ligne.designation}' (type={ligne.type})")

        if ligne.type == TypeLigne.MAIN_OEUVRE:
            return ligne

        # 1. Normalise
        produit_normalise = await self._normaliser_produit(ligne.designation)
        logger.info(f"[PRIX] Produit normalisé: '{produit_normalise}'")

        # 2. Cache
        try:
            cached = await self.prix_cache_repo.find_by_produit(produit_normalise)
            if cached:
                logger.info(f"[PRIX] Cache hit: {cached.prix_median}€")
                return self._apply_prix_to_ligne(ligne, cached)
        except Exception as e:
            logger.error(f"[PRIX] ERREUR cache: {e}")

        # 3. SearXNG → snippets + URLs sources
        snippets, sources = await self.searxng.search_snippets(f"{produit_normalise} prix achat")
        if not snippets:
            logger.warning(f"[PRIX] Aucun snippet pour '{produit_normalise}'")
            return ligne

        # 4. Groq extrait tous les prix trouvés dans les snippets
        try:
            prix_list = await self._extraire_prix_liste(snippets, ligne.designation)
        except Exception as e:
            logger.error(f"[PRIX] ERREUR extraction prix Groq: {e}")
            return ligne
        logger.info(f"[PRIX] Prix extraits: {prix_list}")

        if not prix_list:
            logger.warning(f"[PRIX] Aucun prix valide pour '{produit_normalise}'")
            return ligne

        # 5. Stats + cache
        prix_cache = self._calculer_stats(produit_normalise, prix_list, sources)
        logger.info(f"[PRIX] Médiane={prix_cache.prix_median}€ confiance={prix_cache.confiance}")

        try:
            await self.prix_cache_repo.create(prix_cache)
        except Exception as e:
            logger.error(f"[PRIX] ERREUR sauvegarde cache: {e}")

        return self._apply_prix_to_ligne(ligne, prix_cache)

    async def _normaliser_produit(self, designation: str) -> str:
        prompt = (
            "Normalise ce nom de produit pour une recherche shopping française, "
            "en 3-6 mots clés pertinents. Réponds uniquement avec les mots clés, sans ponctuation."
        )
        result = await self.groq.chat(prompt, designation, temperature=0.0)
        return result.strip().lower()

    async def _extraire_prix_liste(self, snippets: str, produit: str) -> List[float]:
        prompt = (
            f"Dans ces résultats de recherche pour '{produit}', trouve tous les prix unitaires en euros. "
            "Réponds UNIQUEMENT avec les nombres séparés par des virgules (ex: 12.50,45.00,8.99). "
            "Si aucun prix trouvé, réponds 'null'."
        )
        result = await self.groq.chat(prompt, snippets[:2000], temperature=0.0)
        result = result.strip().lower()
        if result == "null" or not result:
            return []
        prix_list = []
        for token in result.replace(";", ",").split(","):
            token = token.strip().replace(" ", "").replace("€", "")
            match = re.search(r'\d+(?:[.,]\d+)?', token)
            if match:
                try:
                    val = float(match.group().replace(",", "."))
                    if 0.01 < val < 100_000:
                        prix_list.append(val)
                except ValueError:
                    pass
        return prix_list

    def _calculer_stats(self, produit_normalise: str, prix_list: List[float], sources: List[str] = []) -> PrixCache:
        sorted_prix = sorted(prix_list)
        n = len(sorted_prix)
        mediane = statistics.median(sorted_prix)
        p25 = sorted_prix[max(0, int(n * 0.25))]
        p75 = sorted_prix[min(n - 1, int(n * 0.75))]

        if n >= 2:
            ratio = statistics.stdev(sorted_prix) / mediane if mediane > 0 else 1.0
        else:
            ratio = 0.0

        if n >= 3 and ratio < 0.20:
            confiance = NiveauConfiance.FORT
        elif n >= 2 or ratio <= 0.40:
            confiance = NiveauConfiance.MOYEN
        else:
            confiance = NiveauConfiance.FAIBLE

        return PrixCache(
            produit_normalise=produit_normalise,
            prix_median=mediane,
            p25=p25,
            p75=p75,
            confiance=confiance,
            sources_json=sources,
        )

    def _apply_prix_to_ligne(self, ligne: LigneDevis, cache: PrixCache) -> LigneDevis:
        ligne.prix_unitaire_estime = cache.prix_median
        ligne.prix_median = cache.prix_median
        ligne.prix_p25 = cache.p25
        ligne.prix_p75 = cache.p75
        ligne.niveau_confiance = cache.confiance
        ligne.sources = cache.sources_json
        return ligne
