from typing import Optional
import httpx


JINA_BASE_URL = "https://r.jina.ai/"


class JinaFetcher:
    async def fetch_markdown(self, url: str) -> Optional[str]:
        try:
            jina_url = f"{JINA_BASE_URL}{url}"
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(jina_url)
                if response.status_code == 200:
                    return response.text[:8000]  # Limit to avoid token overflow
        except Exception:
            pass
        return None
