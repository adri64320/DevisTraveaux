from pydantic import BaseModel
from typing import Optional, List
from src.domain.value_objects.type_ligne import TypeLigne
from src.domain.value_objects.niveau_confiance import NiveauConfiance


class LigneDevisDTO(BaseModel):
    id: str
    designation: str
    quantite: float
    unite: str
    prix_unitaire_facture: float
    total_facture: float
    type: TypeLigne
    prix_unitaire_estime: Optional[float] = None
    prix_median: Optional[float] = None
    prix_p25: Optional[float] = None
    prix_p75: Optional[float] = None
    niveau_confiance: Optional[NiveauConfiance] = None
    sources: List[str] = []
    mixte_valide: bool = False


class UpdateLigneTypeDTO(BaseModel):
    type: TypeLigne


class ValidateMixteDTO(BaseModel):
    prix_unitaire: float


class DevisResultDTO(BaseModel):
    lignes: List[LigneDevisDTO]
