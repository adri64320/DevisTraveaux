from dataclasses import dataclass


@dataclass
class RegisterCommand:
    email: str
    password: str


@dataclass
class LoginCommand:
    email: str
    password: str
