import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { User, Camera } from 'lucide-react'

export default function MiPerfil() {
  const { user } = useAuth()
  const { update, uploadPhoto, loading } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    await update({ name, email })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadPhoto(file)
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem' }}>Mi Perfil</h2>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'var(--color-bg-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '0.75rem',
              cursor: 'pointer',
            }} onClick={() => fileRef.current?.click()}>
              {user?.photo_url ? (
                <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="var(--color-primary)" />
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity var(--transition-fast)',
                borderRadius: '50%',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={24} color="white" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Haz clic para cambiar foto</span>
          </div>

          {success && (
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Perfil actualizado correctamente
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name">Nombre completo</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
