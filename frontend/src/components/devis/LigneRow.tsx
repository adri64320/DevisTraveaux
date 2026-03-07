import { useState } from 'react'
import { LigneDevis } from '../../services/api'
import { useAppDispatch } from '../../store/hooks'
import { updateLigneType, updateLignePrix, validateMixte } from '../../features/devis/devisSlice'

interface Props { ligne: LigneDevis }

const CONFIANCE_COLORS = {
  FORT: { bg: '#dcfce7', color: '#16a34a', label: 'Fort' },
  MOYEN: { bg: '#fef3c7', color: '#d97706', label: 'Moyen' },
  FAIBLE: { bg: '#fee2e2', color: '#dc2626', label: 'Faible' },
}

const TYPE_COLORS = {
  MATERIEL: { bg: '#dbeafe', color: '#1d4ed8' },
  MAIN_OEUVRE: { bg: '#f3e8ff', color: '#7c3aed' },
  MIXTE: { bg: '#fef3c7', color: '#b45309' },
}

export default function LigneRow({ ligne }: Props) {
  const dispatch = useAppDispatch()
  const [editPrix, setEditPrix] = useState(false)
  const [prixEdit, setPrixEdit] = useState(ligne.prix_unitaire_estime?.toString() || '')
  const [mixteValue, setMixteValue] = useState(ligne.prix_unitaire_estime?.toString() || '')

  const typeColors = TYPE_COLORS[ligne.type]
  const confiance = ligne.niveau_confiance ? CONFIANCE_COLORS[ligne.niveau_confiance] : null

  const td: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', verticalAlign: 'middle' }

  return (
    <tr style={{ background: 'white', transition: 'background 0.15s' }}>
      <td style={td}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{ligne.designation}</div>
      </td>
      <td style={{ ...td, textAlign: 'center' }}>{ligne.quantite} {ligne.unite}</td>
      <td style={{ ...td, textAlign: 'right' }}>{ligne.prix_unitaire_facture.toFixed(2)} €</td>
      <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>{ligne.total_facture.toFixed(2)} €</td>
      <td style={td}>
        <select
          value={ligne.type}
          onChange={e => dispatch(updateLigneType({ id: ligne.id, type: e.target.value as LigneDevis['type'] }))}
          style={{
            padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-300)',
            background: typeColors.bg, color: typeColors.color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <option value="MATERIEL">MATÉRIEL</option>
          <option value="MAIN_OEUVRE">MAIN D'ŒUVRE</option>
          <option value="MIXTE">MIXTE</option>
        </select>
      </td>
      <td style={td}>
        {ligne.type === 'MAIN_OEUVRE' ? (
          <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>—</span>
        ) : ligne.type === 'MIXTE' && !ligne.mixte_valide ? (
          <div>
            <input
              type="number" step="0.01" value={mixteValue}
              onChange={e => setMixteValue(e.target.value)}
              placeholder="Prix unitaire"
              style={{ width: 100, padding: '4px 8px', border: '1px solid var(--gray-300)', borderRadius: 6, fontSize: 13, marginRight: 8 }}
            />
            <button
              onClick={() => dispatch(validateMixte({ id: ligne.id, prix: parseFloat(mixteValue) || 0 }))}
              style={{ padding: '4px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
            >
              Valider
            </button>
          </div>
        ) : editPrix ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number" step="0.01" value={prixEdit}
              onChange={e => setPrixEdit(e.target.value)}
              style={{ width: 90, padding: '4px 8px', border: '1px solid var(--gray-300)', borderRadius: 6, fontSize: 13 }}
            />
            <button
              onClick={() => { dispatch(updateLignePrix({ id: ligne.id, prix: parseFloat(prixEdit) })); setEditPrix(false) }}
              style={{ padding: '4px 10px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
            >✓</button>
          </div>
        ) : ligne.prix_unitaire_estime != null ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{ligne.prix_unitaire_estime.toFixed(2)} €</span>
              {confiance && (
                <span style={{ padding: '2px 8px', borderRadius: 12, background: confiance.bg, color: confiance.color, fontSize: 11, fontWeight: 600 }}>
                  {confiance.label}
                </span>
              )}
              <button onClick={() => setEditPrix(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 12 }}>✏️</button>
            </div>
            {ligne.prix_p25 != null && ligne.prix_p75 != null && (
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                Fourchette: {ligne.prix_p25.toFixed(2)} — {ligne.prix_p75.toFixed(2)} €
              </div>
            )}
            {ligne.sources.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ligne.sources.slice(0, 3).map((src, i) => {
                  let domain = src
                  try { domain = new URL(src).hostname.replace(/^www\./, '') } catch {}
                  return (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 11, color: 'var(--primary)', textDecoration: 'none',
                        background: '#eef4fb', border: '1px solid #c7dff7',
                        padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                      🛒 {domain}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Non estimé</span>
        )}
      </td>
    </tr>
  )
}
