from typing import Optional
from fastapi import Depends, HTTPException, Cookie, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.persistence.database import get_db
from src.infrastructure.persistence.repositories import (
    UserRepositoryImpl,
    SalarieRepositoryImpl,
    ChantierRepositoryImpl,
    PrixCacheRepositoryImpl,
)
from src.infrastructure.llm.groq_client import GroqClient
from src.infrastructure.llm.pdf_extractor import PDFExtractor
from src.infrastructure.llm.devis_extractor import DevisExtractor
from src.infrastructure.search.searxng_search import SearXNGSearch
from src.application.services.auth_service import AuthService
from src.application.services.devis_service import DevisService
from src.application.services.prix_service import PrixService
from src.application.services.chantier_service import ChantierService
from src.application.services.salarie_service import SalarieService
from src.application.services.export_service import ExportService


# Infrastructure singletons
_groq_client = GroqClient()
_pdf_extractor = PDFExtractor()
_searxng = SearXNGSearch()


def get_groq_client() -> GroqClient:
    return _groq_client


def get_devis_extractor(groq: GroqClient = Depends(get_groq_client)) -> DevisExtractor:
    return DevisExtractor(groq)


async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(UserRepositoryImpl(db))


async def get_devis_service(
    pdf_extractor: PDFExtractor = Depends(lambda: _pdf_extractor),
    devis_extractor: DevisExtractor = Depends(get_devis_extractor),
) -> DevisService:
    return DevisService(pdf_extractor, devis_extractor)


async def get_prix_service(
    db: AsyncSession = Depends(get_db),
    groq: GroqClient = Depends(get_groq_client),
) -> PrixService:
    return PrixService(
        PrixCacheRepositoryImpl(db),
        groq,
        _searxng,
    )


async def get_chantier_service(db: AsyncSession = Depends(get_db)) -> ChantierService:
    return ChantierService(ChantierRepositoryImpl(db))


async def get_salarie_service(db: AsyncSession = Depends(get_db)) -> SalarieService:
    return SalarieService(SalarieRepositoryImpl(db))


def get_export_service() -> ExportService:
    return ExportService()


async def get_current_user_optional(
    access_token: Optional[str] = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> Optional[str]:
    if not access_token:
        return None
    return auth_service.decode_token(access_token)


async def get_current_user(
    user_id: Optional[str] = Depends(get_current_user_optional),
) -> str:
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
        )
    return user_id
