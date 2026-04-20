'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionDialog } from '@/components/transactions/TransactionDialog'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { useTransactions } from '@/hooks/useTransactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'
import { toast } from 'sonner'

export default function TransactionsPage() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions({
    month,
    year,
    category: categoryFilter || 'all',
    type: typeFilter || 'all',
  })

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  const handleAdd = async (data: Parameters<typeof addTransaction>[0]) => {
    try {
      await addTransaction(data)
      toast.success('Transação adicionada!')
    } catch {
      toast.error('Erro ao adicionar transação.')
    }
  }

  const handleUpdate = async (id: string, data: Parameters<typeof addTransaction>[0]) => {
    try {
      await updateTransaction(id, data)
      toast.success('Transação atualizada!')
    } catch {
      toast.error('Erro ao atualizar transação.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
      toast.success('Transação excluída!')
    } catch {
      toast.error('Erro ao excluir transação.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova transação</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />

        <div className="flex gap-2 flex-1">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(!v || v === 'all' ? '' : v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo de transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(!v || v === 'all' ? '' : v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tipo de categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAdd}
      />
    </div>
  )
}
