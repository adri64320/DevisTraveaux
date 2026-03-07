import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import AnalysePage from './pages/AnalysePage'
import HistoriquePage from './pages/HistoriquePage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<AnalysePage />} />
          <Route path="/historique" element={<HistoriquePage />} />
        </Routes>
      </main>
    </div>
  )
}
