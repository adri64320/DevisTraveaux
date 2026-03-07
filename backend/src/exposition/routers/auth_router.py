from fastapi import APIRouter, Depends, Response
from src.exposition.controllers.auth_controller import AuthController
from src.exposition.dependencies import get_auth_service
from src.exposition.dtos.auth_dto import RegisterDTO, LoginDTO, TokenDTO, UserDTO
from src.application.services.auth_service import AuthService

router = APIRouter()


def get_controller(auth_service: AuthService = Depends(get_auth_service)) -> AuthController:
    return AuthController(auth_service)


@router.post("/register", response_model=UserDTO)
async def register(
    dto: RegisterDTO,
    response: Response,
    controller: AuthController = Depends(get_controller),
):
    return await controller.register(dto, response)


@router.post("/login", response_model=TokenDTO)
async def login(
    dto: LoginDTO,
    response: Response,
    controller: AuthController = Depends(get_controller),
):
    return await controller.login(dto, response)


@router.post("/logout")
async def logout(
    response: Response,
    controller: AuthController = Depends(get_controller),
):
    return await controller.logout(response)
