import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setSliderValue } from '../../features/chantier/chantierSlice'

interface Props { gain: number }

export default function SliderSimulation({ gain }: Props) {
  const dispatch = useAppDispatch()
  const { sliderValue, dirigeant } = useAppSelector(s => s.chantier)
  const unite = dirigeant.unite

  const gainParUnite = sliderValue > 0 ? gain / sliderValue : 0

  return (
    <div style={{ marginTop: 24, padding: 20, background: '#eef4fb', borderRadius: 10, border: '1px solid #bcd4f0' }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 16 }}>
        Simulation durée du chantier
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--gray-600)', minWidth: 40 }}>1 {unite.slice(0, 1)}</span>
        <input
          type="range" min={1} max={60} value={sliderValue}
          onChange={e => dispatch(setSliderValue(parseInt(e.target.value)))}
          style={{ flex: 1, accentColor: 'var(--primary)' }}
        />
        <span style={{ fontSize: 13, color: 'var(--gray-600)', minWidth: 50 }}>60 {unite.slice(0, 1)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>
          Durée sélectionnée : <strong>{sliderValue} {unite}</strong>
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: gainParUnite >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {gainParUnite.toFixed(2)} € / {unite.slice(0, -1)}
        </span>
      </div>
    </div>
  )
}
