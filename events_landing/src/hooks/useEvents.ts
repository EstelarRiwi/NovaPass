import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

export interface Event {
  id: number
  name: string
  description: string
  date: string
  location: string
  image_url: string | null
  status: string
  categories: Category[]
  is_favorite?: boolean
}

export interface Category {
  id: number
  name: string
  price: number
  capacity: number
  available: number
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<Event[]>('/events')
      setEvents(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { events, loading, error, refetch: fetch }
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get<Event>(`/events/${id}`)
      .then(setEvent)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load event'))
      .finally(() => setLoading(false))
  }, [id])

  return { event, loading, error }
}
