import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { uploadDevis } from '../../features/devis/devisSlice'

export default function PDFUpload() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(s => s.devis)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés.')
      return
    }
    dispatch(uploadDevis(file))
  }

  const dropZone: React.CSSProperties = {
    border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--gray-300)'}`,
    borderRadius: 12,
    padding: '48px 32px',
    textAlign: 'center',
    background: dragging ? '#eef4fb' : 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  return (
    <div>
      <div
        style={dropZone}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault(); setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {loading ? (
          <div>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p style={{ color: 'var(--gray-600)' }}>Analyse du PDF en cours...</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>
              Déposez votre devis PDF ici
            </p>
            <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
              ou cliquez pour sélectionner un fichier (max 10MB)
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef} type="file" accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {error && (
        <div style={{ marginTop: 12, padding: 12, background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
