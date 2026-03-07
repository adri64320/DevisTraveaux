from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional, List
import uuid
from ..value_objects.niveau_confiance import NiveauConfiance


@dataclass
class PrixCache:
    produit_normalise: str
    prix_median: float
    p25: float
    p75: float
    confiance: NiveauConfiance
    sources_json: List[str]
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)

    def is_valid(self, ttl_hours: int = 48) -> bool:
        return datetime.utcnow() - self.created_at < timedelta(hours=ttl_hours)
