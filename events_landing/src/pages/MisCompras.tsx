import { useEffect } from 'react'
import { usePurchases } from '../hooks/useTickets'
import { Calendar, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisCompras() {
  const { purchases, loading, fetch } = usePurchases()

  useEffect(() => { fetch() }, [])

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 style={{ marginBottom: '2rem' }}>Mis Compras</h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : purchases.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Ticket size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Sin compras</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No has realizado ninguna compra aún.</p>
            <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {purchases.map(ticket => (
              <div key={ticket.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.375rem' }}>{ticket.event_name}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {new Date(ticket.event_date).toLocaleDateString('es-CO')}
                    </span>
                    <span>{ticket.category_name}</span>
                    <span>${ticket.price.toLocaleString()}</span>
                    <span className={`badge ${ticket.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {ticket.status === 'active' ? 'Activa' : 'Usada'}
                    </span>
                  </div>
                </div>
                <Link to={`/mis-entradas`} className="btn btn-outline btn-sm">Ver Entrada</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
