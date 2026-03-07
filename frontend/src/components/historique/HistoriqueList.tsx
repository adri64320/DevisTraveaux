import { Chantier } from '../../services/api'
import BadgeRentabilite from '../resultats/BadgeRentabilite'

interface Props { chantiers: Chantier[] }

export default function HistoriqueList({ chantiers }: Props) {
  const card: React.CSSProperties = { background: 'white', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)', marginBottom: 24 }

  return (
    <div style={card}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Historique des chantiers</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Chantier', 'Métier', 'Date', 'CA', 'Coût total', 'Gain', 'Marge', 'Rentabilité'].map(h => (
                <th key={h} style={{ padding: '10px 16px', background: 'var(--gray-50)', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', borderBottom: '2px solid var(--gray-200)', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chantiers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{c.nom}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>{c.metier}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-500)' }}>
                  {new Date(c.date).toLocaleDateString('fr-FR')}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.ca.toFixed(0)} €</td>
                <td style={{ padding: '12px 16px' }}>{c.cout_total.toFixed(0)} €</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: c.gain >= 0 ? '#16a34a' : '#dc2626' }}>
                  {c.gain.toFixed(0)} €
                </td>
                <td style={{ padding: '12px 16px' }}>{c.marge.toFixed(1)} %</td>
                <td style={{ padding: '12px 16px' }}>
                  <BadgeRentabilite gain={c.gain} ca={c.ca} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
