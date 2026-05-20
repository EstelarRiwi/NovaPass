import { useState, useCallback } from 'react'
import { api } from '../api/client'

export interface PqrsRequest {
  id: number
  type: string
  message: string
  status: string
  created_at: string
  responses: { message: string; created_at: string }[]
}

export function usePqrs() {
  const [requests, setRequests] = useState<PqrsRequest[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<PqrsRequest[]>('/pqrs')
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (type: string, message: string) => {
    setLoading(true)
    try {
      await api.post('/pqrs', { type, message })
    } finally {
      setLoading(false)
    }
  }, [])

  return { requests, loading, fetch, create }
}
