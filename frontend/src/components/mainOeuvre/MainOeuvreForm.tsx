import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setMetier, setDirigeant, setCoefficientCharges,
  addSalarie, updateSalarie, removeSalarie,
} from '../../features/chantier/chantierSlice'
import { calculerMO } from '../../features/chantier/chantierSlice'

const METIERS = ['Électricien', 'Plombier', 'Maçon', 'Menuisier', 'Peintre', 'Couvreur', 'Carreleur', 'Multi-corps d\'état', 'Autre']
const ROLES = ['Chef de chantier', 'Ouvrier', 'Apprenti'] as const

export default function MainOeuvreForm() {
  const dispatch = useAppDispatch()
  const { metier, salariesInput, dirigeant, coefficientCharges, calculMO } = useAppSelector(s => s.chantier)

  const addNewSalarie = () => {
    dispatch(addSalarie({
      id: crypto.randomUUID(),
      nom: '', role: 'Ouvrier', taux_horaire: 0, temps_prevu: 0,
    }))
  }

  const handleCalcul = () => {
    dispatch(calculerMO({
      salaries: salariesInput.map(s => ({ nom: s.nom, role: s.role, taux_horaire: s.taux_horaire, temps_prevu: s.temps_prevu })),
      dirigeant: { taux_horaire: dirigeant.taux_horaire, temps_prevu: dirigeant.temps_prevu, unite: dirigeant.unite },
      coefficient_charges: coefficientCharges,
    }))
  }

  const card: React.CSSProperties = { background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 24, marginBottom: 24 }
  const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid var(--gray-300)', borderRadius: 8, fontSize: 14 }
  const selectStyle: React.CSSProperties = { ...input, background: 'white', cursor: 'pointer' }

  return (
    <div style={card}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 24 }}>Main d'œuvre & Informations chantier</h2>

      {/* Métier */}
      <div style={{ marginBottom: 20 }}>
        <label style={label}>Métier</label>
        <select value={metier} onChange={e => dispatch(setMetier(e.target.value))} style={selectStyle}>
          {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Dirigeant */}
      <div style={{ ...card, background: 'var(--gray-50)', padding: 20, marginBottom: 20 }}>
        <p style={sectionTitle}>Dirigeant / Artisan</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={label}>Unité de temps</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['heures', 'jours'] as const).map(u => (
                <button key={u} onClick={() => dispatch(setDirigeant({ unite: u }))}
                  style={{
                    flex: 1, padding: '8px', border: '1px solid var(--gray-300)', borderRadius: 8,
                    background: dirigeant.unite === u ? 'var(--primary)' : 'white',
                    color: dirigeant.unite === u ? 'white' : 'var(--gray-700)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Temps estimé ({dirigeant.unite})</label>
            <input type="number" step="0.5" value={dirigeant.temps_prevu || ''} style={input}
              onChange={e => dispatch(setDirigeant({ temps_prevu: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label style={label}>Taux horaire (€/h)</label>
            <input type="number" step="0.5" value={dirigeant.taux_horaire || ''} style={input}
              onChange={e => dispatch(setDirigeant({ taux_horaire: parseFloat(e.target.value) || 0 }))} />
          </div>
        </div>
        {dirigeant.taux_horaire > 0 && dirigeant.temps_prevu > 0 && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>
            Coût brut dirigeant : <strong>{(dirigeant.taux_horaire * dirigeant.temps_prevu).toFixed(2)} €</strong>
          </p>
        )}
      </div>

      {/* Salariés */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ ...sectionTitle, marginBottom: 0, paddingBottom: 0, border: 'none' }}>Salariés</p>
          <button onClick={addNewSalarie}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            + Ajouter
          </button>
        </div>
        {salariesInput.length === 0 && (
          <p style={{ color: 'var(--gray-400)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>Aucun salarié ajouté</p>
        )}
        {salariesInput.map(s => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', gap: 12, alignItems: 'end', marginBottom: 12, padding: 16, background: 'var(--gray-50)', borderRadius: 8 }}>
            <div>
              <label style={label}>Nom / Prénom</label>
              <input value={s.nom} onChange={e => dispatch(updateSalarie({ id: s.id, nom: e.target.value }))} style={input} placeholder="Dupont Jean" />
            </div>
            <div>
              <label style={label}>Rôle</label>
              <select value={s.role} onChange={e => dispatch(updateSalarie({ id: s.id, role: e.target.value as typeof s.role }))} style={selectStyle}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>€/h</label>
              <input type="number" step="0.5" value={s.taux_horaire || ''} onChange={e => dispatch(updateSalarie({ id: s.id, taux_horaire: parseFloat(e.target.value) || 0 }))} style={input} />
            </div>
            <div>
              <label style={label}>Temps</label>
              <input type="number" step="0.5" value={s.temps_prevu || ''} onChange={e => dispatch(updateSalarie({ id: s.id, temps_prevu: parseFloat(e.target.value) || 0 }))} style={input} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              {s.taux_horaire > 0 && s.temps_prevu > 0 && (
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                  {(s.taux_horaire * s.temps_prevu).toFixed(0)} €
                </span>
              )}
              <button onClick={() => dispatch(removeSalarie(s.id))}
                style={{ padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coefficient */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={label}>Coefficient charges patronales (BTP : 1.45)</label>
          <input type="number" step="0.01" value={coefficientCharges} onChange={e => dispatch(setCoefficientCharges(parseFloat(e.target.value) || 1.45))} style={{ ...input, maxWidth: 120 }} />
        </div>
      </div>

      <button onClick={handleCalcul}
        style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
        Calculer le coût total MO
      </button>

      {calculMO && (
        <div style={{ marginTop: 20, padding: 20, background: '#eef4fb', borderRadius: 10, border: '1px solid #bcd4f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Coût brut</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)' }}>{calculMO.cout_brut.toFixed(2)} €</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Charges ({calculMO.coefficient}×)</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{calculMO.charges.toFixed(2)} €</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Total MO</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{calculMO.cout_total.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
