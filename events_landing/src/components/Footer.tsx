import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{
      background: 'var(--color-primary-dark)',
      color: 'white',
      padding: '3rem 0 1.5rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              Estelar
            </h3>
            <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>
              Tu plataforma de confianza para la compra y gestión de boletas para los mejores eventos.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Enlaces</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Eventos</Link>
              <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Iniciar Sesión</Link>
              <Link to="/register" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Registrarse</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Contacto</h4>
            <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>
              soporte@estelar.com<br />
              +57 1 234 5678
            </p>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          opacity: 0.6,
        }}>
          &copy; {new Date().getFullYear()} Estelar. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
