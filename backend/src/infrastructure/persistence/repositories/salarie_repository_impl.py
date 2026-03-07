from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from src.domain.entities.salarie import Salarie, RoleSalarie
from src.domain.repositories.salarie_repository import SalarieRepository
from ..models.salarie_model import SalarieModel


class SalarieRepositoryImpl(SalarieRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, salarie: Salarie) -> Salarie:
        model = SalarieModel(
            id=salarie.id,
            user_id=salarie.user_id,
            nom=salarie.nom,
            role=salarie.role.value,
            taux_horaire=salarie.taux_horaire,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    async def find_by_user(self, user_id: str) -> List[Salarie]:
        result = await self.session.execute(
            select(SalarieModel).where(SalarieModel.user_id == user_id)
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def update(self, salarie: Salarie) -> Salarie:
        result = await self.session.execute(
            select(SalarieModel).where(SalarieModel.id == salarie.id)
        )
        model = result.scalar_one()
        model.nom = salarie.nom
        model.role = salarie.role.value
        model.taux_horaire = salarie.taux_horaire
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    async def delete(self, salarie_id: str) -> None:
        await self.session.execute(
            delete(SalarieModel).where(SalarieModel.id == salarie_id)
        )
        await self.session.commit()

    def _to_entity(self, model: SalarieModel) -> Salarie:
        return Salarie(
            id=model.id,
            user_id=model.user_id,
            nom=model.nom,
            role=RoleSalarie(model.role),
            taux_horaire=model.taux_horaire,
            temps_prevu=0.0,
        )
