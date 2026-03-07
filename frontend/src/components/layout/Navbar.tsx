import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logout } from '../../features/auth/authSlice'
import AuthModal from '../auth/AuthModal'

export default function Navbar() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated, email } = useAppSelector(s => s.auth)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const navStyle: React.CSSProperties = {
    background: 'var(--primary)',
    color: 'white',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    fontSize: 14,
    fontWeight: 500,
  })

  return (
    <>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>🏗️ Chantier Rentable</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={linkStyle(location.pathname === '/')}>Analyser</Link>
          <Link to="/historique" style={linkStyle(location.pathname === '/historique')}>Historique</Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>{email}</span>
              <button
                onClick={() => dispatch(logout())}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setAuthMode('login'); setShowAuth(true) }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
              >
                Connexion
              </button>
              <button
                onClick={() => { setAuthMode('register'); setShowAuth(true) }}
                style={{ background: 'white', border: 'none', color: 'var(--primary)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Créer un compte
              </button>
            </div>
          )}
        </div>
      </nav>
      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSwitchMode={setAuthMode} />}
    </>
  )
}
