import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { estimerPrix } from '../../features/devis/devisSlice'
import LigneRow from './LigneRow'

export default function LignesDevis() {
  const dispatch = useAppDispatch()
  const { lignes, loadingPrix, error } = useAppSelector(s => s.devis)

  const materiels = lignes.filter(l => l.type === 'MATERIEL' || l.type === 'MIXTE')
  const hasUnestimated = materiels.some(l => l.prix_unitaire_estime == null)

  const card: React.CSSProperties = {
    background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-md)',
    overflow: 'hidden', marginBottom: 24,
  }
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
  const th: React.CSSProperties = {
    padding: '12px 16px', background: 'var(--gray-50)', textAlign: 'left',
    fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '2px solid var(--gray-200)',
  }

  return (
    <div style={card}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-800)' }}>Lignes du devis</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{lignes.length} ligne(s) extraites</p>
        </div>
        {hasUnestimated && (
          <button
            onClick={() => dispatch(estimerPrix(lignes))}
            disabled={loadingPrix}
            style={{
              padding: '10px 20px', background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14,
              opacity: loadingPrix ? 0.6 : 1,
            }}
          >
            {loadingPrix ? '⏳ Estimation...' : '🔍 Estimer les prix marché'}
          </button>
        )}
      </div>
      {error && loadingPrix === false && (
        <div style={{ margin: '12px 24px', padding: 12, background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14 }}>
          ⚠️ Erreur estimation : {error}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Désignation</th>
              <th style={{ ...th, textAlign: 'center' }}>Qté / Unité</th>
              <th style={{ ...th, textAlign: 'right' }}>Prix facturé</th>
              <th style={{ ...th, textAlign: 'right' }}>Total facturé</th>
              <th style={th}>Type</th>
              <th style={th}>Prix marché estimé</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map(ligne => <LigneRow key={ligne.id} ligne={ligne} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
