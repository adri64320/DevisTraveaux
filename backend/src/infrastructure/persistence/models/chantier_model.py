from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class ChantierModel(Base):
    __tablename__ = "chantiers"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    nom = Column(String, nullable=False)
    metier = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    ca = Column(Float, default=0.0)
    cout_mo = Column(Float, default=0.0)
    cout_materiaux = Column(Float, default=0.0)
    gain = Column(Float, default=0.0)
    donnees_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
