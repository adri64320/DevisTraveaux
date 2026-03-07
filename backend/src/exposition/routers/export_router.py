from fastapi import APIRouter, Depends
from fastapi.responses import Response

from src.exposition.controllers.export_controller import ExportController
from src.exposition.dependencies import get_export_service, get_current_user
from src.exposition.dtos.export_dto import ExportRequestDTO
from src.application.services.export_service import ExportService

router = APIRouter()


def get_controller(
    export_service: ExportService = Depends(get_export_service),
) -> ExportController:
    return ExportController(export_service)


@router.post("/excel")
async def export_excel(
    dto: ExportRequestDTO,
    controller: ExportController = Depends(get_controller),
    user_id: str = Depends(get_current_user),
):
    return await controller.export_excel(dto)
