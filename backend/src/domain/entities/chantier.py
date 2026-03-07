from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Any, Dict
import uuid
from enum import Enum


class MetierEnum(str, Enum):
    ELECTRICIEN = "Électricien"
    PLOMBIER = "Plombier"
    MACON = "Maçon"
    MENUISIER = "Menuisier"
    PEINTRE = "Peintre"
    COUVREUR = "Couvreur"
    CARRELEUR = "Carreleur"
    MULTI = "Multi-corps d'état"
    AUTRE = "Autre"


class UniteTemps(str, Enum):
    HEURES = "heures"
    JOURS = "jours"


@dataclass
class Chantier:
    nom: str
    metier: MetierEnum
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    date: datetime = field(default_factory=datetime.utcnow)
    ca: float = 0.0
    cout_mo: float = 0.0
    cout_materiaux: float = 0.0
    gain: float = 0.0
    donnees_json: Optional[Dict[str, Any]] = None
    created_at: datetime = field(default_factory=datetime.utcnow)

    @property
    def cout_total(self) -> float:
        return self.cout_mo + self.cout_materiaux

    @property
    def marge(self) -> float:
        if self.ca == 0:
            return 0.0
        return (self.gain / self.ca) * 100
