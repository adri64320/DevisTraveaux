from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict
from src.domain.entities.chantier import MetierEnum, UniteTemps
from src.domain.entities.salarie import RoleSalarie


@dataclass
class SalarieInput:
    nom: str
    role: RoleSalarie
    taux_horaire: float
    temps_prevu: float


@dataclass
class DirigentInput:
    taux_horaire: float
    temps_prevu: float
    unite: UniteTemps


@dataclass
class SaveChantierCommand:
    nom: str
    metier: MetierEnum
    ca: float
    cout_mo: float
    cout_materiaux: float
    gain: float
    donnees_json: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None


@dataclass
class CalculMainOeuvreCommand:
    salaries: List[SalarieInput]
    dirigeant: DirigentInput
    coefficient_charges: float = 1.45
