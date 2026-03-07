from typing import List, Optional, Dict, Any
from src.domain.entities.chantier import Chantier
from src.domain.repositories.chantier_repository import ChantierRepository
from src.application.commands.chantier_commands import (
    SaveChantierCommand,
    CalculMainOeuvreCommand,
)


class ChantierService:
    def __init__(self, chantier_repo: ChantierRepository):
        self.chantier_repo = chantier_repo

    async def save_chantier(self, command: SaveChantierCommand) -> Chantier:
        chantier = Chantier(
            nom=command.nom,
            metier=command.metier,
            user_id=command.user_id,
            ca=command.ca,
            cout_mo=command.cout_mo,
            cout_materiaux=command.cout_materiaux,
            gain=command.gain,
            donnees_json=command.donnees_json,
        )
        return await self.chantier_repo.create(chantier)

    async def get_historique(self, user_id: str) -> List[Chantier]:
        return await self.chantier_repo.find_by_user(user_id)

    def calculer_main_oeuvre(self, command: CalculMainOeuvreCommand) -> Dict[str, float]:
        cout_salaries = sum(s.taux_horaire * s.temps_prevu for s in command.salaries)
        cout_dirigeant = command.dirigeant.taux_horaire * command.dirigeant.temps_prevu
        cout_brut = cout_salaries + cout_dirigeant
        cout_total = cout_brut * command.coefficient_charges
        charges = cout_total - cout_brut

        return {
            "cout_brut": round(cout_brut, 2),
            "charges": round(charges, 2),
            "cout_total": round(cout_total, 2),
            "coefficient": command.coefficient_charges,
        }
