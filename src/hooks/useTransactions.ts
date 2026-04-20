'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Transaction, TransactionInsert } from '@/types'

interface Filters {
  month?: number
  year?: number
  category?: string
  type?: string
}

export function useTransactions(filters?: Filters) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (filters?.month !== undefined && filters?.year !== undefined) {
      const startDate = new Date(filters.year, filters.month, 1)
      const endDate = new Date(filters.year, filters.month + 1, 0)
      query = query
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }, [filters?.month, filters?.year, filters?.category, filters?.type])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (transaction: TransactionInsert) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('transactions').insert({
      ...transaction,
      user_id: user.id,
    })

    if (error) throw error
    await fetchTransactions()
  }

  const updateTransaction = async (id: string, transaction: TransactionInsert) => {
    const { error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)

    if (error) throw error
    await fetchTransactions()
  }

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchTransactions()
  }

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
