from typing import List, Optional
from fastapi import HTTPException, status

from src.application.services.chantier_service import ChantierService
from src.application.services.salarie_service import SalarieService
from src.application.commands.chantier_commands import (
    SaveChantierCommand, CalculMainOeuvreCommand, SalarieInput, DirigentInput,
)
from src.domain.entities.salarie import Salarie
from src.exposition.dtos.chantier_dto import (
    SaveChantierDTO, ChantierResponseDTO,
    CalculMORequestDTO, CalculMOResponseDTO,
    SalarieDTO, CreateSalarieDTO, UpdateSalarieDTO,
)
from src.exposition.mappers.chantier_mapper import ChantierMapper


class ChantierController:
    def __init__(self, chantier_service: ChantierService, salarie_service: SalarieService):
        self.chantier_service = chantier_service
        self.salarie_service = salarie_service

    async def save_chantier(self, dto: SaveChantierDTO, user_id: Optional[str]) -> ChantierResponseDTO:
        command = SaveChantierCommand(
            nom=dto.nom,
            metier=dto.metier,
            ca=dto.ca,
            cout_mo=dto.cout_mo,
            cout_materiaux=dto.cout_materiaux,
            gain=dto.gain,
            donnees_json=dto.donnees_json,
            user_id=user_id,
        )
        chantier = await self.chantier_service.save_chantier(command)
        return ChantierMapper.to_dto(chantier)

    async def get_historique(self, user_id: str) -> List[ChantierResponseDTO]:
        chantiers = await self.chantier_service.get_historique(user_id)
        return [ChantierMapper.to_dto(c) for c in chantiers]

    def calculer_mo(self, dto: CalculMORequestDTO) -> CalculMOResponseDTO:
        command = CalculMainOeuvreCommand(
            salaries=[
                SalarieInput(
                    nom=s.nom,
                    role=s.role,
                    taux_horaire=s.taux_horaire,
                    temps_prevu=s.temps_prevu,
                )
                for s in dto.salaries
            ],
            dirigeant=DirigentInput(
                taux_horaire=dto.dirigeant.taux_horaire,
                temps_prevu=dto.dirigeant.temps_prevu,
                unite=dto.dirigeant.unite,
            ),
            coefficient_charges=dto.coefficient_charges,
        )
        result = self.chantier_service.calculer_main_oeuvre(command)
        return CalculMOResponseDTO(**result)

    async def get_salaries(self, user_id: str) -> List[SalarieDTO]:
        salaries = await self.salarie_service.get_salaries(user_id)
        return [ChantierMapper.salarie_to_dto(s) for s in salaries]

    async def create_salarie(self, dto: CreateSalarieDTO, user_id: str) -> SalarieDTO:
        import uuid
        salarie = Salarie(
            id=str(uuid.uuid4()),
            user_id=user_id,
            nom=dto.nom,
            role=dto.role,
            taux_horaire=dto.taux_horaire,
            temps_prevu=0.0,
        )
        created = await self.salarie_service.create_salarie(salarie)
        return ChantierMapper.salarie_to_dto(created)

    async def update_salarie(self, salarie_id: str, dto: UpdateSalarieDTO, user_id: str) -> SalarieDTO:
        salarie = Salarie(
            id=salarie_id,
            user_id=user_id,
            nom=dto.nom,
            role=dto.role,
            taux_horaire=dto.taux_horaire,
            temps_prevu=0.0,
        )
        updated = await self.salarie_service.update_salarie(salarie)
        return ChantierMapper.salarie_to_dto(updated)

    async def delete_salarie(self, salarie_id: str) -> dict:
        await self.salarie_service.delete_salarie(salarie_id)
        return {"message": "Salarié supprimé"}
