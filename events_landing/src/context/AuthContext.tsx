import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api } from '../api/client'

interface User {
  id: number
  name: string
  email: string
  photo_url: string | null
  role: string
}

interface AuthState {
  user: User | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('user')
    return {
      user: stored ? JSON.parse(stored) : null,
      loading: false,
    }
  })

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true }))
    try {
      const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      api.setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setState({ user: data.user, loading: false })
    } catch (e) {
      setState(s => ({ ...s, loading: false }))
      throw e
    }
  }, [])

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState(s => ({ ...s, loading: true }))
    try {
      const data = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password })
      api.setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setState({ user: data.user, loading: false })
    } catch (e) {
      setState(s => ({ ...s, loading: false }))
      throw e
    }
  }, [])

  const logout = useCallback(() => {
    api.setToken(null)
    localStorage.removeItem('user')
    setState({ user: null, loading: false })
  }, [])

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    setState(s => ({ ...s, user }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithGoogle, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
