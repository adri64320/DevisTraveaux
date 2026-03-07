from typing import List
from pydantic import BaseModel, field_validator
from .groq_client import GroqClient
from src.domain.entities.ligne_devis import LigneDevis
from src.domain.value_objects.type_ligne import TypeLigne


SYSTEM_PROMPT = """Tu es un assistant spécialisé dans l'extraction de données de devis de travaux de construction (plâtrerie, isolation, menuiserie, électricité, plomberie…).

Extrais UNIQUEMENT les lignes facturables du devis (celles avec une quantité, une unité, un prix unitaire et un total).
Retourne un JSON valide avec cette structure exacte :
[
  {
    "designation": "description complète de la prestation",
    "quantite": 10.0,
    "unite": "M2",
    "prix_unitaire_facture": 28.00,
    "total_facture": 280.00,
    "type": "MIXTE"
  }
]

Règles de classification du champ "type" pour des devis de TRAVAUX :
- "MAIN_OEUVRE" : prestation de main-d'œuvre pure, SANS fourniture de matériau.
  Exemples : "Pose bloc portes", "Pose et assemblage châssis", "Nettoyage chantier", "Évacuation déchets", "Main d'œuvre", "MOD", "Montage", "Démontage".
- "MATERIEL" : fourniture de matériau brut SANS pose.
  Exemples : "Plaque BA13", "Câble 2.5mm²", "Tube PVC", "Visserie".
- "MIXTE" : tout le reste — prestations qui incluent à la fois la fourniture ET la pose, ou dont on ne peut pas séparer les deux.
  Exemples : "Plafond placostil BA13 pose horizontale", "Cloison de distribution BA13", "Fourniture et pose isolation", "Habillage velux", "Gaines d'habillage", "Doublage sur ossatures", "Bandes armées angles saillants".
- En cas de doute → "MIXTE"

À IGNORER absolument (ne pas inclure dans le JSON) :
- Les titres de sections : PLAFOND, DOUBLAGES, CLOISONS, DIVERS, Etage, Rez de chaussée, etc.
- Les lignes "Sous-total", "Total H.T.", "Total T.V.A.", "Total T.T.C.", "Net à payer"
- Les lignes sans quantité ni prix (descriptions seules)
- Les en-têtes et pieds de page
- La section "Variantes du devis" et ses lignes

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire, sans markdown, sans explication.
Assure-toi que tous les nombres sont des valeurs numériques (pas des chaînes de caractères).
Les nombres peuvent utiliser la virgule comme séparateur décimal (ex: "28,00" → 28.0).
"""


class LigneDevisRaw(BaseModel):
    designation: str
    quantite: float
    unite: str
    prix_unitaire_facture: float
    total_facture: float
    type: TypeLigne = TypeLigne.MIXTE

    @field_validator("quantite", "prix_unitaire_facture", "total_facture", mode="before")
    @classmethod
    def coerce_float(cls, v):
        if isinstance(v, str):
            v = v.replace(",", ".").replace(" ", "")
            return float(v)
        return float(v)


class DevisExtractor:
    def __init__(self, groq_client: GroqClient):
        self.groq = groq_client

    async def extract_lignes(self, pdf_text: str) -> List[LigneDevis]:
        raw_data = await self.groq.extract_json(
            system_prompt=SYSTEM_PROMPT,
            user_message=f"Voici le contenu du devis à analyser :\n\n{pdf_text}",
        )

        if not isinstance(raw_data, list):
            raise ValueError("L'IA n'a pas retourné une liste de lignes.")

        lignes = []
        for item in raw_data:
            try:
                raw = LigneDevisRaw(**item)
                ligne = LigneDevis(
                    designation=raw.designation,
                    quantite=raw.quantite,
                    unite=raw.unite,
                    prix_unitaire_facture=raw.prix_unitaire_facture,
                    total_facture=raw.total_facture,
                    type=raw.type,
                )
                lignes.append(ligne)
            except Exception:
                continue

        return lignes
