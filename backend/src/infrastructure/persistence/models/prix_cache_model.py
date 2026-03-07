from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from ..database import Base


class PrixCacheModel(Base):
    __tablename__ = "prix_cache"

    id = Column(String, primary_key=True)
    produit_normalise = Column(String, nullable=False, index=True, unique=True)
    prix_median = Column(Float, nullable=False)
    p25 = Column(Float, nullable=False)
    p75 = Column(Float, nullable=False)
    confiance = Column(String, nullable=False)
    sources_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
