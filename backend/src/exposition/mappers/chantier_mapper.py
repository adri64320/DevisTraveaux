from src.domain.entities.chantier import Chantier
from src.domain.entities.salarie import Salarie
from src.exposition.dtos.chantier_dto import ChantierResponseDTO, SalarieDTO


class ChantierMapper:
    @staticmethod
    def to_dto(chantier: Chantier) -> ChantierResponseDTO:
        return ChantierResponseDTO(
            id=chantier.id,
            nom=chantier.nom,
            metier=chantier.metier.value,
            date=chantier.date.isoformat() if chantier.date else "",
            ca=chantier.ca,
            cout_mo=chantier.cout_mo,
            cout_materiaux=chantier.cout_materiaux,
            cout_total=chantier.cout_total,
            gain=chantier.gain,
            marge=chantier.marge,
        )

    @staticmethod
    def salarie_to_dto(salarie: Salarie) -> SalarieDTO:
        return SalarieDTO(
            id=salarie.id,
            nom=salarie.nom,
            role=salarie.role.value,
            taux_horaire=salarie.taux_horaire,
        )
