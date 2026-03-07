import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchHistorique } from '../features/chantier/chantierSlice'
import HistoriqueList from '../components/historique/HistoriqueList'
import SynthesesChart from '../components/historique/SynthesesChart'

export default function HistoriquePage() {
  const dispatch = useAppDispatch()
  const { historique, loading } = useAppSelector(s => s.chantier)
  const { isAuthenticated } = useAppSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchHistorique())
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Connexion requise</h2>
        <p style={{ color: 'var(--gray-500)' }}>Connectez-vous pour accéder à votre historique de chantiers.</p>
      </div>
    )
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-500)' }}>Chargement...</div>

  if (historique.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Aucun chantier enregistré</h2>
        <p style={{ color: 'var(--gray-500)' }}>Analysez votre premier devis et sauvegardez les résultats.</p>
      </div>
    )
  }

  // Aggregated stats
  const caTotal = historique.reduce((s, c) => s + c.ca, 0)
  const gainTotal = historique.reduce((s, c) => s + c.gain, 0)
  const margeAvg = historique.length > 0
    ? historique.reduce((s, c) => s + c.marge, 0) / historique.length
    : 0

  const kpiStyle: React.CSSProperties = {
    background: 'white', borderRadius: 10, padding: 20, textAlign: 'center',
    boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)',
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 24 }}>Historique & Synthèses</h1>

      {/* KPI summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={kpiStyle}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Chantiers</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{historique.length}</p>
        </div>
        <div style={kpiStyle}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>CA total</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-800)' }}>{caTotal.toFixed(0)} €</p>
        </div>
        <div style={kpiStyle}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Gain total</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: gainTotal >= 0 ? '#16a34a' : '#dc2626' }}>{gainTotal.toFixed(0)} €</p>
        </div>
        <div style={kpiStyle}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Marge moyenne</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-800)' }}>{margeAvg.toFixed(1)} %</p>
        </div>
      </div>

      <SynthesesChart chantiers={historique} />

      <div style={{ marginTop: 32 }}>
        <HistoriqueList chantiers={historique} />
      </div>
    </div>
  )
}
