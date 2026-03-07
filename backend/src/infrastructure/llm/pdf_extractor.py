import io
import re
from typing import List, Optional
import pdfplumber


class PDFExtractor:
    def extract_text(self, pdf_bytes: bytes) -> str:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            if not pdf.pages:
                raise ValueError("Le PDF est vide.")

            pages_text = []
            for page in pdf.pages:
                text = page.extract_text() or ""
                table_text = self._extract_tables(page)
                pages_text.append(text + "\n" + table_text)

            full_text = "\n".join(pages_text)

            if not full_text.strip():
                raise ValueError(
                    "Impossible d'extraire du texte. Ce PDF semble être scanné (image). "
                    "Veuillez fournir un PDF avec du texte sélectionnable."
                )

            return self._clean_text(full_text)

    def _extract_tables(self, page) -> str:
        tables = page.extract_tables()
        if not tables:
            return ""
        result = []
        for table in tables:
            for row in table:
                cleaned_row = [cell.strip() if cell else "" for cell in row]
                result.append(" | ".join(cleaned_row))
        return "\n".join(result)

    def _clean_text(self, text: str) -> str:
        # Remove excessive whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)
        # Remove common footer/header patterns (page numbers)
        text = re.sub(r'Page \d+ sur \d+', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)
        return text.strip()
