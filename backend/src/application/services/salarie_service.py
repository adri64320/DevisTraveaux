from typing import List
from src.domain.entities.salarie import Salarie
from src.domain.repositories.salarie_repository import SalarieRepository


class SalarieService:
    def __init__(self, salarie_repo: SalarieRepository):
        self.salarie_repo = salarie_repo

    async def get_salaries(self, user_id: str) -> List[Salarie]:
        return await self.salarie_repo.find_by_user(user_id)

    async def create_salarie(self, salarie: Salarie) -> Salarie:
        return await self.salarie_repo.create(salarie)

    async def update_salarie(self, salarie: Salarie) -> Salarie:
        return await self.salarie_repo.update(salarie)

    async def delete_salarie(self, salarie_id: str) -> None:
        await self.salarie_repo.delete(salarie_id)
