from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.salarie import Salarie


class SalarieRepository(ABC):
    @abstractmethod
    async def create(self, salarie: Salarie) -> Salarie:
        pass

    @abstractmethod
    async def find_by_user(self, user_id: str) -> List[Salarie]:
        pass

    @abstractmethod
    async def update(self, salarie: Salarie) -> Salarie:
        pass

    @abstractmethod
    async def delete(self, salarie_id: str) -> None:
        pass
