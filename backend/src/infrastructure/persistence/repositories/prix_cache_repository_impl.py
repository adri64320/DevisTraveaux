from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from src.domain.entities.prix_cache import PrixCache
from src.domain.repositories.prix_cache_repository import PrixCacheRepository
from src.domain.value_objects.niveau_confiance import NiveauConfiance
from ..models.prix_cache_model import PrixCacheModel


class PrixCacheRepositoryImpl(PrixCacheRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_produit(self, produit_normalise: str) -> Optional[PrixCache]:
        result = await self.session.execute(
            select(PrixCacheModel).where(PrixCacheModel.produit_normalise == produit_normalise)
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        entity = self._to_entity(model)
        return entity if entity.is_valid() else None

    async def create(self, prix_cache: PrixCache) -> PrixCache:
        stmt = pg_insert(PrixCacheModel).values(
            id=prix_cache.id,
            produit_normalise=prix_cache.produit_normalise,
            prix_median=prix_cache.prix_median,
            p25=prix_cache.p25,
            p75=prix_cache.p75,
            confiance=prix_cache.confiance.value,
            sources_json=prix_cache.sources_json,
        ).on_conflict_do_update(
            index_elements=["produit_normalise"],
            set_=dict(
                prix_median=prix_cache.prix_median,
                p25=prix_cache.p25,
                p75=prix_cache.p75,
                confiance=prix_cache.confiance.value,
                sources_json=prix_cache.sources_json,
            ),
        )
        await self.session.execute(stmt)
        await self.session.commit()
        result = await self.session.execute(
            select(PrixCacheModel).where(PrixCacheModel.produit_normalise == prix_cache.produit_normalise)
        )
        return self._to_entity(result.scalar_one())

    async def update(self, prix_cache: PrixCache) -> PrixCache:
        result = await self.session.execute(
            select(PrixCacheModel).where(PrixCacheModel.produit_normalise == prix_cache.produit_normalise)
        )
        model = result.scalar_one()
        model.prix_median = prix_cache.prix_median
        model.p25 = prix_cache.p25
        model.p75 = prix_cache.p75
        model.confiance = prix_cache.confiance.value
        model.sources_json = prix_cache.sources_json
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    def _to_entity(self, model: PrixCacheModel) -> PrixCache:
        return PrixCache(
            id=model.id,
            produit_normalise=model.produit_normalise,
            prix_median=model.prix_median,
            p25=model.p25,
            p75=model.p75,
            confiance=NiveauConfiance(model.confiance),
            sources_json=model.sources_json or [],
            created_at=model.created_at,
        )
