import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Chantier } from '../../services/api'

interface Props { chantiers: Chantier[] }

export default function SynthesesChart({ chantiers }: Props) {
  const data = chantiers.slice(0, 12).reverse().map(c => ({
    name: new Date(c.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    CA: Math.round(c.ca),
    Coût: Math.round(c.cout_total),
    Gain: Math.round(c.gain),
  }))

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Évolution sur les derniers chantiers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}€`} />
          <Tooltip formatter={(value: number) => `${value.toFixed(0)} €`} />
          <Legend />
          <Bar dataKey="CA" fill="#2C5F8A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Coût" fill="#9ca3af" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gain" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
