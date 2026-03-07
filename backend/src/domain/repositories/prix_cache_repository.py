from abc import ABC, abstractmethod
from typing import Optional
from ..entities.prix_cache import PrixCache


class PrixCacheRepository(ABC):
    @abstractmethod
    async def find_by_produit(self, produit_normalise: str) -> Optional[PrixCache]:
        pass

    @abstractmethod
    async def create(self, prix_cache: PrixCache) -> PrixCache:
        pass

    @abstractmethod
    async def update(self, prix_cache: PrixCache) -> PrixCache:
        pass
