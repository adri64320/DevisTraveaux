interface Props { gain: number; ca: number }

export default function BadgeRentabilite({ gain, ca }: Props) {
  const marge = ca > 0 ? (gain / ca) * 100 : 0

  let badge: { bg: string; color: string; label: string; icon: string }
  if (gain < 0) {
    badge = { bg: '#fee2e2', color: '#dc2626', label: 'À risque', icon: '🔴' }
  } else if (marge < 15) {
    badge = { bg: '#fef3c7', color: '#d97706', label: 'Attention', icon: '🟡' }
  } else {
    badge = { bg: '#dcfce7', color: '#16a34a', label: 'Rentable', icon: '🟢' }
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 18px', borderRadius: 20,
      background: badge.bg, color: badge.color,
      fontSize: 15, fontWeight: 700,
    }}>
      {badge.icon} {badge.label}
      {ca > 0 && <span style={{ fontWeight: 400, fontSize: 13 }}>({marge.toFixed(1)}% marge)</span>}
    </div>
  )
}
