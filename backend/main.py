from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.config import settings
from src.exposition.routers.devis_router import router as devis_router
from src.exposition.routers.auth_router import router as auth_router
from src.exposition.routers.chantier_router import router as chantier_router
from src.exposition.routers.export_router import router as export_router
from src.infrastructure.persistence.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Chantier Rentable API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devis_router, prefix="/api/devis", tags=["devis"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(chantier_router, prefix="/api/chantiers", tags=["chantiers"])
app.include_router(export_router, prefix="/api/export", tags=["export"])


@app.get("/health")
async def health():
    return {"status": "ok"}
