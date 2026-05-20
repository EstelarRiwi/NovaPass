import { useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useFavorites } from '../hooks/useFavorites'
import { EventCard } from '../components/EventCard'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisFavoritos() {
  const { events, loading } = useEvents()
  const { favorites, fetch: fetchFavs } = useFavorites()

  useEffect(() => { fetchFavs() }, [])

  const favEvents = events.filter(e => favorites.includes(e.id))

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 style={{ marginBottom: '2rem' }}>Mis Favoritos</h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : favEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Heart size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Sin favoritos</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No has agregado eventos a favoritos.</p>
            <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {favEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
