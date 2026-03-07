from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.domain.entities.chantier import Chantier, MetierEnum
from src.domain.repositories.chantier_repository import ChantierRepository
from ..models.chantier_model import ChantierModel


class ChantierRepositoryImpl(ChantierRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, chantier: Chantier) -> Chantier:
        model = ChantierModel(
            id=chantier.id,
            user_id=chantier.user_id,
            nom=chantier.nom,
            metier=chantier.metier.value,
            ca=chantier.ca,
            cout_mo=chantier.cout_mo,
            cout_materiaux=chantier.cout_materiaux,
            gain=chantier.gain,
            donnees_json=chantier.donnees_json,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    async def find_by_id(self, chantier_id: str) -> Optional[Chantier]:
        result = await self.session.execute(
            select(ChantierModel).where(ChantierModel.id == chantier_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def find_by_user(self, user_id: str) -> List[Chantier]:
        result = await self.session.execute(
            select(ChantierModel)
            .where(ChantierModel.user_id == user_id)
            .order_by(ChantierModel.created_at.desc())
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def update(self, chantier: Chantier) -> Chantier:
        result = await self.session.execute(
            select(ChantierModel).where(ChantierModel.id == chantier.id)
        )
        model = result.scalar_one()
        model.nom = chantier.nom
        model.metier = chantier.metier.value
        model.ca = chantier.ca
        model.cout_mo = chantier.cout_mo
        model.cout_materiaux = chantier.cout_materiaux
        model.gain = chantier.gain
        model.donnees_json = chantier.donnees_json
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    def _to_entity(self, model: ChantierModel) -> Chantier:
        return Chantier(
            id=model.id,
            user_id=model.user_id,
            nom=model.nom,
            metier=MetierEnum(model.metier),
            date=model.date,
            ca=model.ca,
            cout_mo=model.cout_mo,
            cout_materiaux=model.cout_materiaux,
            gain=model.gain,
            donnees_json=model.donnees_json,
            created_at=model.created_at,
        )
