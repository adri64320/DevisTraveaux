from abc import ABC, abstractmethod
from typing import Optional, List
from ..entities.chantier import Chantier


class ChantierRepository(ABC):
    @abstractmethod
    async def create(self, chantier: Chantier) -> Chantier:
        pass

    @abstractmethod
    async def find_by_id(self, chantier_id: str) -> Optional[Chantier]:
        pass

    @abstractmethod
    async def find_by_user(self, user_id: str) -> List[Chantier]:
        pass

    @abstractmethod
    async def update(self, chantier: Chantier) -> Chantier:
        pass
