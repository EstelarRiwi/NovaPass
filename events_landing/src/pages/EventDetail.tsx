import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvent } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useCheckout } from '../hooks/useTickets'
import { Calendar, MapPin, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { event, loading } = useEvent(Number(id))
  const { createPreference, loading: checkoutLoading } = useCheckout()

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Evento no encontrado</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver a Eventos</Link>
        </div>
      </div>
    )
  }

  const category = event.categories.find(c => c.id === selectedCategory)
  const total = category ? category.price * quantity : 0

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedCategory) { setError('Selecciona una categoría'); return }
    setError('')
    try {
      const url = await createPreference(event.id, selectedCategory, quantity)
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la compra')
    }
  }

  const date = new Date(event.date).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          <ChevronLeft size={16} /> Volver a Eventos
        </Link>

        <div style={{
          height: 300,
          borderRadius: 'var(--radius-lg)',
          background: event.image_url
            ? `url(${event.image_url}) center/cover`
            : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          marginBottom: '2rem',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>{event.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {event.location}</span>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--color-text)' }}>{event.description}</p>
          </div>

          <div className="card" style={{ position: 'sticky', top: '5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Compra tus boletas</h3>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label>Categoría</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {event.categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setError('') }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      border: `2px solid ${selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      background: selectedCategory === cat.id ? 'var(--color-bg-alt)' : 'white',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{cat.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>${cat.price.toLocaleString()}</span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: cat.available > 0 ? 'var(--color-text-muted)' : 'var(--color-error)' }}>
                        {cat.available > 0 ? `${cat.available} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div style={{ marginBottom: '1rem' }}>
                <label>Cantidad</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-outline btn-sm"
                    style={{ width: 40, height: 40, padding: 0 }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem', minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(category?.available || 10, quantity + 1))}
                    className="btn btn-outline btn-sm"
                    style={{ width: 40, height: 40, padding: 0 }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {total > 0 && (
              <div style={{
                padding: '0.75rem 0',
                borderTop: '1px solid var(--color-border)',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={!selectedCategory || checkoutLoading}
              className="btn btn-cta btn-lg"
              style={{ width: '100%' }}
            >
              {checkoutLoading ? (
                <span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              ) : (
                <><ShoppingCart size={18} /> {user ? 'Comprar Ahora' : 'Iniciar Sesión para Comprar'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
