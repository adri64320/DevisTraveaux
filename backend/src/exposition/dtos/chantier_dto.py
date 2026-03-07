from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from src.domain.entities.chantier import MetierEnum, UniteTemps
from src.domain.entities.salarie import RoleSalarie


class SalarieInputDTO(BaseModel):
    nom: str
    role: RoleSalarie
    taux_horaire: float
    temps_prevu: float


class DirigentInputDTO(BaseModel):
    taux_horaire: float
    temps_prevu: float
    unite: UniteTemps


class CalculMORequestDTO(BaseModel):
    salaries: List[SalarieInputDTO]
    dirigeant: DirigentInputDTO
    coefficient_charges: float = 1.45


class CalculMOResponseDTO(BaseModel):
    cout_brut: float
    charges: float
    cout_total: float
    coefficient: float


class SaveChantierDTO(BaseModel):
    nom: str
    metier: MetierEnum
    ca: float
    cout_mo: float
    cout_materiaux: float
    gain: float
    donnees_json: Optional[Dict[str, Any]] = None


class ChantierResponseDTO(BaseModel):
    id: str
    nom: str
    metier: str
    date: str
    ca: float
    cout_mo: float
    cout_materiaux: float
    cout_total: float
    gain: float
    marge: float


class SalarieDTO(BaseModel):
    id: str
    nom: str
    role: str
    taux_horaire: float


class CreateSalarieDTO(BaseModel):
    nom: str
    role: RoleSalarie
    taux_horaire: float


class UpdateSalarieDTO(BaseModel):
    nom: str
    role: RoleSalarie
    taux_horaire: float
