from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext

from src.config import settings
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository
from src.application.commands.auth_commands import RegisterCommand, LoginCommand


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, command: RegisterCommand) -> User:
        existing = await self.user_repo.find_by_email(command.email)
        if existing:
            raise ValueError("Un compte avec cet email existe déjà.")

        password_hash = pwd_context.hash(command.password)
        user = User(email=command.email, password_hash=password_hash)
        return await self.user_repo.create(user)

    async def login(self, command: LoginCommand) -> str:
        user = await self.user_repo.find_by_email(command.email)
        if not user:
            raise ValueError("Email ou mot de passe incorrect.")
        if not pwd_context.verify(command.password, user.password_hash):
            raise ValueError("Email ou mot de passe incorrect.")
        return self._create_token(user.id)

    def _create_token(self, user_id: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
        payload = {"sub": user_id, "exp": expire}
        return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

    def decode_token(self, token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            return payload.get("sub")
        except JWTError:
            return None
