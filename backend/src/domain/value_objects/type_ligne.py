from enum import Enum


class TypeLigne(str, Enum):
    MATERIEL = "MATERIEL"
    MAIN_OEUVRE = "MAIN_OEUVRE"
    MIXTE = "MIXTE"
