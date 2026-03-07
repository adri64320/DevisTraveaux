from typing import List
from src.domain.entities.ligne_devis import LigneDevis
from src.infrastructure.llm.pdf_extractor import PDFExtractor
from src.infrastructure.llm.devis_extractor import DevisExtractor
from src.application.commands.devis_commands import UploadDevisCommand


class DevisService:
    def __init__(self, pdf_extractor: PDFExtractor, devis_extractor: DevisExtractor):
        self.pdf_extractor = pdf_extractor
        self.devis_extractor = devis_extractor

    async def process_pdf(self, command: UploadDevisCommand) -> List[LigneDevis]:
        # F1.2 - Extract text from PDF
        text = self.pdf_extractor.extract_text(command.pdf_bytes)

        # F1.3 + F1.4 - Extract structured data and classify via Groq
        lignes = await self.devis_extractor.extract_lignes(text)

        if not lignes:
            raise ValueError("Aucune ligne n'a pu être extraite du devis.")

        return lignes
