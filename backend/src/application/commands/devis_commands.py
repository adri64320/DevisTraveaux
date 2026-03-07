from dataclasses import dataclass
from typing import List
from src.domain.value_objects.type_ligne import TypeLigne


@dataclass
class UploadDevisCommand:
    pdf_bytes: bytes
    filename: str


@dataclass
class UpdateLigneTypeCommand:
    ligne_id: str
    new_type: TypeLigne


@dataclass
class ValidateMixteCommand:
    ligne_id: str
    prix_unitaire: float
