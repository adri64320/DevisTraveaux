from typing import List, Optional
from fastapi import APIRouter, Depends

from src.exposition.controllers.chantier_controller import ChantierController
from src.exposition.dependencies import (
    get_chantier_service, get_salarie_service,
    get_current_user, get_current_user_optional,
)
from src.exposition.dtos.chantier_dto import (
    SaveChantierDTO, ChantierResponseDTO,
    CalculMORequestDTO, CalculMOResponseDTO,
    SalarieDTO, CreateSalarieDTO, UpdateSalarieDTO,
)
from src.application.services.chantier_service import ChantierService
from src.application.services.salarie_service import SalarieService

router = APIRouter()


def get_controller(
    chantier_service: ChantierService = Depends(get_chantier_service),
    salarie_service: SalarieService = Depends(get_salarie_service),
) -> ChantierController:
    return ChantierController(chantier_service, salarie_service)


@router.post("/calcul-mo", response_model=CalculMOResponseDTO)
def calculer_mo(
    dto: CalculMORequestDTO,
    controller: ChantierController = Depends(get_controller),
):
    return controller.calculer_mo(dto)


@router.post("/save", response_model=ChantierResponseDTO)
async def save_chantier(
    dto: SaveChantierDTO,
    controller: ChantierController = Depends(get_controller),
    user_id: Optional[str] = Depends(get_current_user_optional),
):
    return await controller.save_chantier(dto, user_id)


@router.get("/historique", response_model=List[ChantierResponseDTO])
async def get_historique(
    controller: ChantierController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.get_historique(user_id)


@router.get("/salaries", response_model=List[SalarieDTO])
async def get_salaries(
    controller: ChantierController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.get_salaries(user_id)


@router.post("/salaries", response_model=SalarieDTO)
async def create_salarie(
    dto: CreateSalarieDTO,
    controller: ChantierController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.create_salarie(dto, user_id)


@router.put("/salaries/{salarie_id}", response_model=SalarieDTO)
async def update_salarie(
    salarie_id: str,
    dto: UpdateSalarieDTO,
    controller: ChantierController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.update_salarie(salarie_id, dto, user_id)


@router.delete("/salaries/{salarie_id}")
async def delete_salarie(
    salarie_id: str,
    controller: ChantierController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.delete_salarie(salarie_id)
