import json
import re
from typing import Any
from groq import AsyncGroq, RateLimitError
from src.config import settings


# 70b : 100k TPD — réservé à l'extraction PDF (tâche complexe)
MODEL_LARGE = "llama-3.3-70b-versatile"
# 8b : 500k TPD — suffisant pour normalisation et extraction de prix
MODEL_FAST = "llama-3.1-8b-instant"


class GroqClient:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.groq_api_key)

    async def chat(self, system_prompt: str, user_message: str, temperature: float = 0.0) -> str:
        """Appel rapide avec le petit modèle (8b, 500k TPD)."""
        response = await self.client.chat.completions.create(
            model=MODEL_FAST,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=temperature,
        )
        return response.choices[0].message.content

    async def extract_json(self, system_prompt: str, user_message: str, max_retries: int = 3) -> Any:
        """Extraction JSON avec le grand modèle (70b) — uniquement pour le parsing PDF."""
        for attempt in range(max_retries):
            try:
                response = await self.client.chat.completions.create(
                    model=MODEL_LARGE,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    temperature=0.0,
                )
                raw = response.choices[0].message.content
                json_match = re.search(r'```json\s*(.*?)\s*```', raw, re.DOTALL)
                if json_match:
                    raw = json_match.group(1)
                else:
                    start = next((i for i, c in enumerate(raw) if c in '[{'), None)
                    if start is not None:
                        raw = raw[start:]
                        for i in range(len(raw) - 1, -1, -1):
                            if raw[i] in ']}':
                                raw = raw[:i + 1]
                                break
                return json.loads(raw)
            except RateLimitError as e:
                raise ValueError(f"Limite Groq atteinte (70b). Réessayez dans 1h ou changez de modèle. Détail : {e}")
            except (json.JSONDecodeError, Exception) as e:
                if attempt == max_retries - 1:
                    raise ValueError(f"Failed to extract JSON after {max_retries} attempts: {e}")
        return None
