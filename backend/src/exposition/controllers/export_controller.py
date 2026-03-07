from fastapi import HTTPException, status
from fastapi.responses import Response

from src.application.services.export_service import ExportService
from src.exposition.dtos.export_dto import ExportRequestDTO


class ExportController:
    def __init__(self, export_service: ExportService):
        self.export_service = export_service

    async def export_excel(self, dto: ExportRequestDTO) -> Response:
        try:
            excel_bytes = self.export_service.generate_excel(dto.model_dump())
            return Response(
                content=excel_bytes,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f'attachment; filename="chantier_{dto.nom}.xlsx"'},
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la génération Excel: {str(e)}",
            )
