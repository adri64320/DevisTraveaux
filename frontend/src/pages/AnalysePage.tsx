import { useAppSelector } from '../store/hooks'
import PDFUpload from '../components/upload/PDFUpload'
import LignesDevis from '../components/devis/LignesDevis'
import MainOeuvreForm from '../components/mainOeuvre/MainOeuvreForm'
import Indicateurs from '../components/resultats/Indicateurs'

export default function AnalysePage() {
  const { lignes } = useAppSelector(s => s.devis)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 8 }}>
          Analyser un devis
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>
          Importez votre devis PDF, renseignez votre main d'œuvre et découvrez la rentabilité réelle de votre chantier.
        </p>
      </div>

      {/* Step 1: Upload */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>1</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>Importer le devis PDF</h2>
        </div>
        <PDFUpload />
      </div>

      {/* Step 2: Lines */}
      {lignes.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>2</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>Vérifier et estimer les lignes</h2>
          </div>
          <LignesDevis />
        </div>
      )}

      {/* Step 3: Main d'oeuvre */}
      {lignes.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>3</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>Main d'œuvre</h2>
          </div>
          <MainOeuvreForm />
        </div>
      )}

      {/* Step 4: Results */}
      {lignes.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>4</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>Résultats</h2>
          </div>
          <Indicateurs />
        </div>
      )}
    </div>
  )
}
