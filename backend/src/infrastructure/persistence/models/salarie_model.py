from sqlalchemy import Column, String, Float, ForeignKey
from ..database import Base


class SalarieModel(Base):
    __tablename__ = "salaries"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    nom = Column(String, nullable=False)
    role = Column(String, nullable=False)
    taux_horaire = Column(Float, nullable=False)
