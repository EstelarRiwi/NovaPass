import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Ticket, User, Heart, ShoppingBag, FileText, LogOut, Star } from 'lucide-react'
import { useState } from 'react'
import styles from './Navbar.module.css'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <Star size={28} fill="currentColor" />
            <span>Estelar</span>
          </Link>

          <button className={styles.toggle} onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${styles.menu} ${open ? styles.open : ''}`}>
            <Link to="/" className={styles.link} onClick={() => setOpen(false)}>Eventos</Link>

            {user ? (
              <>
                <Link to="/mis-compras" className={styles.link} onClick={() => setOpen(false)}>
                  <ShoppingBag size={16} /> Mis Compras
                </Link>
                <Link to="/mis-entradas" className={styles.link} onClick={() => setOpen(false)}>
                  <Ticket size={16} /> Mis Entradas
                </Link>
                <Link to="/mis-favoritos" className={styles.link} onClick={() => setOpen(false)}>
                  <Heart size={16} /> Favoritos
                </Link>
                <Link to="/pqrs" className={styles.link} onClick={() => setOpen(false)}>
                  <FileText size={16} /> PQRS
                </Link>
                <Link to="/mi-perfil" className={styles.link} onClick={() => setOpen(false)}>
                  <User size={16} /> Perfil
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={16} /> Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link} onClick={() => setOpen(false)}>Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
