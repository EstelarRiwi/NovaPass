import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import type { Event } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { Heart } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  event: Event
}

export function EventCard({ event }: Props) {
  const { user } = useAuth()
  const { favorites, toggle, fetch } = useFavorites()

  useEffect(() => {
    if (user) fetch()
  }, [user])

  const date = new Date(event.date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isFav = favorites.includes(event.id)

  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <div style={{
        height: '180px',
        background: event.image_url
          ? `url(${event.image_url}) center/cover`
          : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
        }}>
          {event.status === 'active' && (
            <span className="badge badge-success">Disponible</span>
          )}
          {user && (
            <button
              onClick={(e) => { e.preventDefault(); toggle(event.id) }}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart size={18} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#6B7280'} />
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>{event.name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={14} /> {date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={14} /> {event.location}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.125rem' }}>
            Desde ${Math.min(...event.categories.map(c => c.price)).toLocaleString()}
          </span>
          <Link to={`/evento/${event.id}`} className="btn btn-primary btn-sm">
            Ver Boletas
          </Link>
        </div>
      </div>
    </div>
  )
}
