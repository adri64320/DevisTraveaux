from pydantic import BaseModel, EmailStr, field_validator


class RegisterDTO(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v:
            raise ValueError("Le mot de passe ne peut pas être vide.")
        return v


class LoginDTO(BaseModel):
    email: EmailStr
    password: str


class TokenDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserDTO(BaseModel):
    id: str
    email: str
