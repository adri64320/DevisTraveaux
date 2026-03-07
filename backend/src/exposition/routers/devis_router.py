from typing import List
from fastapi import APIRouter, Depends, UploadFile, File

from src.exposition.controllers.devis_controller import DevisController
from src.exposition.dependencies import get_devis_service, get_prix_service
from src.exposition.dtos.devis_dto import LigneDevisDTO, DevisResultDTO
from src.application.services.devis_service import DevisService
from src.application.services.prix_service import PrixService

router = APIRouter()


def get_controller(
    devis_service: DevisService = Depends(get_devis_service),
    prix_service: PrixService = Depends(get_prix_service),
) -> DevisController:
    return DevisController(devis_service, prix_service)


@router.post("/upload", response_model=DevisResultDTO)
async def upload_devis(
    file: UploadFile = File(...),
    controller: DevisController = Depends(get_controller),
):
    return await controller.upload_devis(file)


@router.post("/estimer-prix", response_model=DevisResultDTO)
async def estimer_prix(
    lignes: List[LigneDevisDTO],
    controller: DevisController = Depends(get_controller),
):
    return await controller.estimer_prix(lignes)
