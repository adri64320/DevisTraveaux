from pydantic import BaseModel
from typing import List, Optional, Any, Dict


class ExportRequestDTO(BaseModel):
    nom: str
    metier: str
    date: str
    ca: float
    cout_mo: float
    cout_materiaux: float
    cout_total: float
    gain: float
    gain_par_jour: Optional[float] = None
    badge_rentabilite: str
    coefficient_charges: float = 1.45
    salaries: List[Dict[str, Any]] = []
    dirigeant: Optional[Dict[str, Any]] = None
    lignes: List[Dict[str, Any]] = []
