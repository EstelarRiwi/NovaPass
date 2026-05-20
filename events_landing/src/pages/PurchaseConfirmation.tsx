import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'

export default function PurchaseConfirmation() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const paymentId = searchParams.get('payment_id')
  const statusParam = searchParams.get('status')

  useEffect(() => {
    if (statusParam === 'approved' || statusParam === 'success') {
      setStatus('success')
    } else if (statusParam === 'failure' || statusParam === 'rejected') {
      setStatus('error')
    } else {
      setStatus('loading')
      if (paymentId) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets/payment/verify?payment_id=${paymentId}`)
          .then(r => r.json())
          .then(data => setStatus(data.status === 'approved' ? 'success' : 'error'))
          .catch(() => setStatus('error'))
      }
    }
  }, [paymentId, statusParam])

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        {status === 'loading' && (
          <div className="card" style={{ padding: '3rem' }}>
            <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4, margin: '0 auto 1.5rem' }} />
            <h3>Verificando tu pago...</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Por favor espera mientras confirmamos tu transacción.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={40} color="#22C55E" />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>¡Compra Exitosa!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Tus boletas han sido generadas. Puedes verlas en Mis Entradas.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/mis-entradas" className="btn btn-primary">Ver Mis Entradas</Link>
              <Link to="/" className="btn btn-outline">Ver Más Eventos</Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <XCircle size={40} color="#EF4444" />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Pago no completado</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              El pago no pudo ser procesado. Puedes intentar de nuevo.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary">Intentar de Nuevo</Link>
              <Link to="/mis-compras" className="btn btn-outline">Mis Compras</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
