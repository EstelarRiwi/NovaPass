import { useState, useCallback } from 'react'
import { api } from '../api/client'

export interface Ticket {
  id: number
  event_id: number
  event_name: string
  event_date: string
  category_name: string
  seat: string
  price: number
  status: string
  qr_token: string
  qr_url: string
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Ticket[]>('/tickets')
      setTickets(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { tickets, loading, fetch }
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Ticket[]>('/tickets/history')
      setPurchases(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { purchases, loading, fetch }
}

export function useCheckout() {
  const [loading, setLoading] = useState(false)

  const createPreference = useCallback(async (eventId: number, categoryId: number, quantity: number) => {
    setLoading(true)
    try {
      const data = await api.post<{ init_point: string }>('/tickets/checkout', {
        event_id: eventId,
        category_id: categoryId,
        quantity,
      })
      return data.init_point
    } finally {
      setLoading(false)
    }
  }, [])

  return { createPreference, loading }
}
