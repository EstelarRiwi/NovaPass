import { useState, useEffect } from 'react'
import { usePqrs } from '../hooks/usePqrs'
import { Send, MessageCircle } from 'lucide-react'

const TYPES = [
  { value: 'question', label: 'Pregunta' },
  { value: 'complaint', label: 'Queja' },
  { value: 'claim', label: 'Reclamo' },
  { value: 'suggestion', label: 'Sugerencia' },
]

export default function PQRS() {
  const { requests, loading, fetch, create } = usePqrs()
  const [type, setType] = useState('question')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await create(type, message)
      setSubmitted(true)
      setMessage('')
      fetch()
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    }
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem' }}>PQRS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Enviar Solicitud</h3>

            {submitted && (
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                Solicitud enviada correctamente
              </div>
            )}

            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="type">Tipo</label>
                <select id="type" value={type} onChange={e => setType(e.target.value)}>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Describe tu solicitud en detalle..."
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || !message.trim()}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <><Send size={16} /> Enviar</>}
              </button>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Mis Solicitudes</h3>
            {requests.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <MessageCircle size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No has enviado solicitudes</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {requests.map(req => (
                  <div key={req.id} className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">
                        {TYPES.find(t => t.value === req.type)?.label || req.type}
                      </span>
                      <span className={`badge ${
                        req.status === 'resolved' || req.status === 'closed'
                          ? 'badge-success'
                          : 'badge-primary'
                      }`}>
                        {req.status === 'pending' ? 'Pendiente' :
                         req.status === 'in_progress' ? 'En gestión' :
                         req.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.375rem' }}>{req.message.substring(0, 120)}...</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(req.created_at).toLocaleDateString('es-CO')}
                    </span>
                    {req.responses.length > 0 && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          <strong>Respuesta:</strong> {req.responses[req.responses.length - 1].message.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
