import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import BadgeRentabilite from './BadgeRentabilite'
import SliderSimulation from './SliderSimulation'
import { exportApi } from '../../services/api'
import { saveChantier } from '../../features/chantier/chantierSlice'
import AuthModal from '../auth/AuthModal'

export default function Indicateurs() {
  const dispatch = useAppDispatch()
  const { lignes } = useAppSelector(s => s.devis)
  const { calculMO, metier, dirigeant, salariesInput, coefficientCharges } = useAppSelector(s => s.chantier)
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  const ca = lignes.reduce((sum, l) => sum + l.total_facture, 0)
  const coutMateriaux = lignes.reduce((sum, l) => {
    if (l.type === 'MAIN_OEUVRE') return sum
    if (l.type === 'MIXTE' && !l.mixte_valide) return sum
    return sum + (l.prix_unitaire_estime ?? 0) * l.quantite
  }, 0)
  const coutMO = calculMO?.cout_total ?? 0
  const coutTotal = coutMateriaux + coutMO
  const gain = ca - coutTotal
  const tempsTotalDirigeant = dirigeant.temps_prevu + salariesInput.reduce((s, sal) => s + sal.temps_prevu, 0)
  const gainParUnite = tempsTotalDirigeant > 0 ? gain / tempsTotalDirigeant : 0

  const handleExport = async () => {
    if (!isAuthenticated) { setShowAuth(true); return }
    try {
      const response = await exportApi.excel({
        nom: `Chantier ${metier}`,
        metier,
        date: new Date().toLocaleDateString('fr-FR'),
        ca, cout_mo: coutMO, cout_materiaux: coutMateriaux,
        cout_total: coutTotal, gain,
        gain_par_jour: gainParUnite,
        badge_rentabilite: gain < 0 ? 'À risque' : gain / ca < 0.15 ? 'Attention' : 'Rentable',
        coefficient_charges: coefficientCharges,
        salaries: salariesInput.map(s => ({ nom: s.nom, role: s.role, taux_horaire: s.taux_horaire, temps_prevu: s.temps_prevu })),
        dirigeant: { taux_horaire: dirigeant.taux_horaire, temps_prevu: dirigeant.temps_prevu },
        lignes: lignes.map(l => ({
          designation: l.designation, quantite: l.quantite, unite: l.unite,
          prix_unitaire_facture: l.prix_unitaire_facture,
          prix_unitaire_estime: l.prix_unitaire_estime,
          type: l.type, niveau_confiance: l.niveau_confiance,
        })),
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `chantier_${metier}.xlsx`
      a.click()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = () => {
    dispatch(saveChantier({
      nom: `Chantier ${metier} ${new Date().toLocaleDateString('fr-FR')}`,
      metier, ca, cout_mo: coutMO, cout_materiaux: coutMateriaux, gain,
      donnees_json: { lignes, salariesInput, dirigeant },
    }))
  }

  const card: React.CSSProperties = { background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 24, marginBottom: 24 }
  const kpiBox: React.CSSProperties = {
    background: 'var(--gray-50)', borderRadius: 10, padding: 20, textAlign: 'center', border: '1px solid var(--gray-200)',
  }

  if (lignes.length === 0) return null

  return (
    <>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-800)' }}>Résultats & Rentabilité</h2>
          <BadgeRentabilite gain={gain} ca={ca} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={kpiBox}>
            <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>CA (devis)</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{ca.toFixed(0)} €</p>
          </div>
          <div style={kpiBox}>
            <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Coût matériaux</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-700)' }}>{coutMateriaux.toFixed(0)} €</p>
          </div>
          <div style={kpiBox}>
            <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Coût MO</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-700)' }}>{coutMO.toFixed(0)} €</p>
          </div>
          <div style={{ ...kpiBox, background: gain >= 0 ? '#dcfce7' : '#fee2e2', border: 'none' }}>
            <p style={{ fontSize: 11, color: gain >= 0 ? '#15803d' : '#991b1b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Gain estimé</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: gain >= 0 ? '#16a34a' : '#dc2626' }}>{gain.toFixed(0)} €</p>
          </div>
        </div>

        <SliderSimulation gain={gain} />

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {isAuthenticated ? (
            <>
              <button onClick={handleSave}
                style={{ padding: '11px 22px', background: 'var(--gray-100)', color: 'var(--gray-700)', border: '1px solid var(--gray-300)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                💾 Sauvegarder
              </button>
              <button onClick={handleExport}
                style={{ padding: '11px 22px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                📊 Exporter Excel
              </button>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button onClick={handleExport}
                style={{ padding: '11px 22px', background: 'var(--gray-300)', color: 'var(--gray-500)', border: 'none', borderRadius: 8, cursor: 'not-allowed', fontWeight: 600, fontSize: 14 }}
                title="Créez un compte gratuit pour exporter">
                📊 Exporter Excel (connexion requise)
              </button>
            </div>
          )}
        </div>
      </div>
      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSwitchMode={setAuthMode} />}
    </>
  )
}
