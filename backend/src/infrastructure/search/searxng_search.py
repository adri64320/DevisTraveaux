import logging
from typing import Optional, Tuple, List

import httpx

logger = logging.getLogger(__name__)

BLOCKED_DOMAINS = ["wikipedia.org", "reddit.com", "forum", ".pdf", "youtube.com", "facebook.com"]

SEARXNG_URL = "http://searxng:8080/search"


class SearXNGSearch:
    async def search_snippets(self, query: str, max_results: int = 5) -> Tuple[Optional[str], List[str]]:
        """Returns (concatenated snippets text, list of source URLs)."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    SEARXNG_URL,
                    params={"q": query, "format": "json", "language": "fr-FR"},
                )
                response.raise_for_status()
                data = response.json()

            parts = []
            urls = []
            for result in data.get("results", []):
                url = result.get("url", "")
                if not url or any(b in url.lower() for b in BLOCKED_DOMAINS):
                    continue
                title = result.get("title", "").strip()
                content = result.get("content", "").strip()
                if title or content:
                    parts.append(f"{title}\n{content}")
                    urls.append(url)
                if len(parts) >= max_results:
                    break

            if not parts:
                logger.warning(f"[SEARXNG] Aucun résultat pour '{query}'")
                return None, []

            logger.info(f"[SEARXNG] '{query}' → {len(parts)} snippets, {len(urls)} URLs")
            return "\n\n".join(parts), urls

        except Exception as e:
            logger.error(f"[SEARXNG] Erreur recherche '{query}': {e}")
            return None, []
