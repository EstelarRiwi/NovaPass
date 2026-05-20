import { useState, useCallback } from 'react'
import { api } from '../api/client'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<{ event_id: number }[]>('/favorites')
      setFavorites(data.map(f => f.event_id))
    } finally {
      setLoading(false)
    }
  }, [])

  const toggle = useCallback(async (eventId: number) => {
    const isFav = favorites.includes(eventId)
    if (isFav) {
      await api.delete(`/favorites/${eventId}`)
      setFavorites(p => p.filter(id => id !== eventId))
    } else {
      await api.post(`/favorites`, { event_id: eventId })
      setFavorites(p => [...p, eventId])
    }
  }, [favorites])

  return { favorites, loading, fetch, toggle }
}
