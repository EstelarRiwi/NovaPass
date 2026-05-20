import { useEffect, useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { Download, Calendar, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisEntradas() {
  const { tickets, loading, fetch: fetchTickets } = useTickets()
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => { fetchTickets() }, [])

  const downloadPdf = async (ticketId: number) => {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets/${ticketId}/pdf`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 style={{ marginBottom: '2rem' }}>Mis Entradas</h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <QrCode size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Sin entradas</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No tienes entradas disponibles.</p>
            <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tickets.map(ticket => (
              <div key={ticket.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', padding: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{ticket.event_name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} /> {new Date(ticket.event_date).toLocaleDateString('es-CO')}
                      </span>
                      <span>{ticket.category_name}</span>
                      <span>Puesto: {ticket.seat}</span>
                      <span className={`badge ${ticket.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {ticket.status === 'active' ? 'Activa' : 'Usada'}
                      </span>
                    </div>
                    <button onClick={() => downloadPdf(ticket.id)} className="btn btn-outline btn-sm">
                      <Download size={14} /> Descargar PDF
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelected(selected === ticket.id ? null : ticket.id)}
                      style={{
                        width: 120,
                        height: 120,
                        background: 'white',
                        border: '2px dashed var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <QrCode size={32} />
                      <span style={{ fontSize: '0.75rem' }}>Mostrar QR</span>
                    </button>
                  </div>
                </div>
                {selected === ticket.id && ticket.qr_url && (
                  <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'center',
                    background: 'var(--color-bg)',
                  }}>
                    <img src={ticket.qr_url} alt="QR de la boleta" style={{ width: 200, height: 200 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
