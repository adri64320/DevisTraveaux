from typing import List
from src.domain.entities.ligne_devis import LigneDevis
from src.exposition.dtos.devis_dto import LigneDevisDTO, DevisResultDTO


class DevisMapper:
    @staticmethod
    def ligne_to_dto(ligne: LigneDevis) -> LigneDevisDTO:
        return LigneDevisDTO(
            id=ligne.id,
            designation=ligne.designation,
            quantite=ligne.quantite,
            unite=ligne.unite,
            prix_unitaire_facture=ligne.prix_unitaire_facture,
            total_facture=ligne.total_facture,
            type=ligne.type,
            prix_unitaire_estime=ligne.prix_unitaire_estime,
            prix_median=ligne.prix_median,
            prix_p25=ligne.prix_p25,
            prix_p75=ligne.prix_p75,
            niveau_confiance=ligne.niveau_confiance,
            sources=ligne.sources,
            mixte_valide=ligne.mixte_valide,
        )

    @staticmethod
    def lignes_to_result(lignes: List[LigneDevis]) -> DevisResultDTO:
        return DevisResultDTO(lignes=[DevisMapper.ligne_to_dto(l) for l in lignes])
