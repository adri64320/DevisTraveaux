from fastapi import Response, HTTPException, status
from src.application.services.auth_service import AuthService
from src.application.commands.auth_commands import RegisterCommand, LoginCommand
from src.exposition.dtos.auth_dto import RegisterDTO, LoginDTO, TokenDTO, UserDTO


class AuthController:
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    async def register(self, dto: RegisterDTO, response: Response) -> UserDTO:
        try:
            user = await self.auth_service.register(
                RegisterCommand(email=dto.email, password=dto.password)
            )
            token = self.auth_service._create_token(user.id)
            response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,
                samesite="lax",
                max_age=86400,
            )
            return UserDTO(id=user.id, email=user.email)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def login(self, dto: LoginDTO, response: Response) -> TokenDTO:
        try:
            token = await self.auth_service.login(
                LoginCommand(email=dto.email, password=dto.password)
            )
            response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,
                samesite="lax",
                max_age=86400,
            )
            return TokenDTO(access_token=token)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    async def logout(self, response: Response) -> dict:
        response.delete_cookie("access_token")
        return {"message": "Déconnexion réussie"}
