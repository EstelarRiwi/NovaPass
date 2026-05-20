import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Chatbot } from './components/Chatbot'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EventDetail from './pages/EventDetail'
import PurchaseConfirmation from './pages/PurchaseConfirmation'
import MisCompras from './pages/MisCompras'
import MisEntradas from './pages/MisEntradas'
import MisFavoritos from './pages/MisFavoritos'
import MiPerfil from './pages/MiPerfil'
import PQRS from './pages/PQRS'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/evento/:id" element={<EventDetail />} />
            <Route path="/pago/confirmacion" element={<PurchaseConfirmation />} />
            <Route path="/mis-compras" element={<ProtectedRoute><MisCompras /></ProtectedRoute>} />
            <Route path="/mis-entradas" element={<ProtectedRoute><MisEntradas /></ProtectedRoute>} />
            <Route path="/mis-favoritos" element={<ProtectedRoute><MisFavoritos /></ProtectedRoute>} />
            <Route path="/mi-perfil" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
            <Route path="/pqrs" element={<ProtectedRoute><PQRS /></ProtectedRoute>} />
          </Route>
        </Routes>
        <Chatbot />
      </AuthProvider>
    </BrowserRouter>
  )
}
