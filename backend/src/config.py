from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://chantier:chantier_pass@localhost:5432/chantier_rentable"
    groq_api_key: str = ""
    jwt_secret: str = "supersecret_change_in_prod"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    # Stored as comma-separated string to avoid pydantic-settings JSON parsing
    cors_origins_str: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.cors_origins_str.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
