from abc import ABC, abstractmethod
from typing import Optional
from ..entities.user import User


class UserRepository(ABC):
    @abstractmethod
    async def create(self, user: User) -> User:
        pass

    @abstractmethod
    async def find_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def find_by_id(self, user_id: str) -> Optional[User]:
        pass
