import { useState, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (data: { name?: string; email?: string }) => {
    setLoading(true)
    try {
      const user = await api.put<{ id: number; name: string; email: string; photo_url: string | null; role: string }>('/auth/profile', data)
      updateUser(user)
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  const uploadPhoto = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const form = new FormData()
      form.append('photo', file)
      const user = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile/photo`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${api.getToken()}` },
          body: form,
        }
      ).then(r => r.json())
      updateUser(user)
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  return { update, uploadPhoto, loading }
}
