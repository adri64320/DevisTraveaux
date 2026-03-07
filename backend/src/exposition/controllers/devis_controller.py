import logging
from typing import List
from fastapi import UploadFile, HTTPException, status

from src.application.services.devis_service import DevisService
from src.application.services.prix_service import PrixService
from src.application.commands.devis_commands import UploadDevisCommand
from src.domain.entities.ligne_devis import LigneDevis
from src.exposition.dtos.devis_dto import LigneDevisDTO, DevisResultDTO
from src.exposition.mappers.devis_mapper import DevisMapper

logger = logging.getLogger(__name__)

MAX_PDF_SIZE = 10 * 1024 * 1024  # 10MB


class DevisController:
    def __init__(self, devis_service: DevisService, prix_service: PrixService):
        self.devis_service = devis_service
        self.prix_service = prix_service

    async def upload_devis(self, file: UploadFile) -> DevisResultDTO:
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Seuls les fichiers PDF sont acceptés.",
            )

        content = await file.read()
        if len(content) > MAX_PDF_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="La taille du PDF ne doit pas dépasser 10MB.",
            )

        try:
            command = UploadDevisCommand(pdf_bytes=content, filename=file.filename or "")
            lignes = await self.devis_service.process_pdf(command)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors du traitement du PDF: {str(e)}",
            )

        return DevisMapper.lignes_to_result(lignes)

    async def estimer_prix(self, lignes_dto: List[LigneDevisDTO]) -> DevisResultDTO:
        logger.info(f"[CONTROLLER] estimer_prix appelé avec {len(lignes_dto)} lignes")

        lignes = [
            LigneDevis(
                id=dto.id,
                designation=dto.designation,
                quantite=dto.quantite,
                unite=dto.unite,
                prix_unitaire_facture=dto.prix_unitaire_facture,
                total_facture=dto.total_facture,
                type=dto.type,
            )
            for dto in lignes_dto
        ]
        logger.info(f"[CONTROLLER] Types: {[l.type for l in lignes]}")

        result = []
        for ligne in lignes:
            try:
                estimated = await self.prix_service.estimer_prix_ligne(ligne)
                result.append(estimated)
            except Exception as e:
                logger.error(f"[CONTROLLER] ERREUR estimer '{ligne.designation}': {e}", exc_info=True)
                result.append(ligne)

        logger.info(f"[CONTROLLER] Estimation terminée pour {len(result)} lignes")
        return DevisMapper.lignes_to_result(result)
