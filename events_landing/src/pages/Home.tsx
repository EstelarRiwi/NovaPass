import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/EventCard'
import { Calendar, ChevronRight, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { events, loading } = useEvents()
  const { user } = useAuth()

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4C1D95 100%)',
        color: 'white',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 50%, #A78BFA 0%, transparent 50%), radial-gradient(circle at 80% 50%, #F97316 0%, transparent 50%)',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ color: 'white', marginBottom: '1rem' }}>
              Vive la <span style={{ color: '#F97316' }}>experiencia</span>
              <br />
              Estelar
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
              Descubre los mejores eventos, compra tus boletas de forma segura y
              guarda tus entradas digitales en un solo lugar.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {!user && (
                <Link to="/register" className="btn btn-cta btn-lg">
                  Crear Cuenta <ChevronRight size={20} />
                </Link>
              )}
              <a href="#eventos" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}>
                Ver Eventos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { icon: <Sparkles size={24} />, title: 'Compra Segura', desc: 'Pagos protegidos con Mercado Pago y entradas con QR firmado digitalmente.' },
              { icon: <Calendar size={24} />, title: 'Cartelera Completa', desc: 'Explora todos los eventos disponibles y guarda tus favoritos.' },
              { icon: <Star size={24} />, title: 'Entradas Digitales', desc: 'Tus boletas siempre disponibles en tu teléfono, sin necesidad de imprimir.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--color-bg-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  margin: '0 auto 1rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cartelera */}
      <section id="eventos" className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2>Cartelera de Eventos</h2>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
            </div>
          ) : events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Calendar size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Próximamente</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>No hay eventos disponibles por el momento. Vuelve pronto.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
