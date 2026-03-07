import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login, register, clearError } from '../../features/auth/authSlice'

interface Props {
  mode: 'login' | 'register'
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: Props) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(s => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const action = mode === 'login'
      ? dispatch(login({ email, password }))
      : dispatch(register({ email, password }))
    const result = await action
    if (!result.type.endsWith('/rejected')) onClose()
  }

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }
  const modal: React.CSSProperties = {
    background: 'white', borderRadius: 12, padding: 32, width: 400,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--gray-300)',
    borderRadius: 8, fontSize: 14, marginBottom: 16,
  }
  const btnPrimary: React.CSSProperties = {
    width: '100%', padding: '11px', background: 'var(--primary)', color: 'white',
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer',
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 24, color: 'var(--primary)' }}>
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h2>
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required style={inputStyle}
          />
          <input
            type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)} required style={inputStyle}
          />
          <button type="submit" style={btnPrimary} disabled={loading}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--gray-500)' }}>
          {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          <button
            onClick={() => { dispatch(clearError()); onSwitchMode(mode === 'login' ? 'register' : 'login') }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  )
}
