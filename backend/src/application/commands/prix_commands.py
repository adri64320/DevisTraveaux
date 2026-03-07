from dataclasses import dataclass
from typing import List, Optional


@dataclass
class EstimerPrixCommand:
    designation: str
    produit_normalise: Optional[str] = None


@dataclass
class EstimerPrixBatchCommand:
    designations: List[str]
