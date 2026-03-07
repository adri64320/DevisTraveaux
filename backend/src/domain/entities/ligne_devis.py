from dataclasses import dataclass, field
from typing import Optional, List
from ..value_objects.type_ligne import TypeLigne
from ..value_objects.niveau_confiance import NiveauConfiance
import uuid


@dataclass
class LigneDevis:
    designation: str
    quantite: float
    unite: str
    prix_unitaire_facture: float
    total_facture: float
    type: TypeLigne = TypeLigne.MIXTE
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    prix_unitaire_estime: Optional[float] = None
    prix_median: Optional[float] = None
    prix_p25: Optional[float] = None
    prix_p75: Optional[float] = None
    niveau_confiance: Optional[NiveauConfiance] = None
    sources: List[str] = field(default_factory=list)
    mixte_valide: bool = False
