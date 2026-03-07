from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
import uuid


class RoleSalarie(str, Enum):
    CHEF_CHANTIER = "Chef de chantier"
    OUVRIER = "Ouvrier"
    APPRENTI = "Apprenti"


@dataclass
class Salarie:
    nom: str
    role: RoleSalarie
    taux_horaire: float
    temps_prevu: float
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None

    @property
    def cout_brut(self) -> float:
        return self.taux_horaire * self.temps_prevu
