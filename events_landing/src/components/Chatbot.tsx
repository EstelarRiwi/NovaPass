import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente de Estelar. ¿En qué puedo ayudarte?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setMessages(p => [...p, { role: 'user', text }])
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: text }),
        }
      )
      const data = await res.json()
      setMessages(p => [...p, { role: 'bot', text: data.response || data.message }])
    } catch {
      setMessages(p => [...p, { role: 'bot', text: 'Lo siento, hubo un error. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          zIndex: 200,
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          width: 360,
          maxWidth: 'calc(100vw - 3rem)',
          height: 500,
          maxHeight: 'calc(100vh - 8rem)',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--color-primary)',
            color: 'white',
          }}>
            <strong>Asistente Estelar</strong>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--color-primary)' : '#F3F4F6',
                color: m.role === 'user' ? 'white' : 'var(--color-text)',
                padding: '0.625rem 0.875rem',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '85%',
                fontSize: '0.875rem',
                lineHeight: 1.4,
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '0.5rem' }}>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu mensaje..."
              style={{ flex: 1 }}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="btn btn-primary" style={{ padding: '0.75rem' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
