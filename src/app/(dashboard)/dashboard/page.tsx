'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { IncomeChart } from '@/components/dashboard/IncomeChart'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionDialog } from '@/components/transactions/TransactionDialog'
import { useTransactions } from '@/hooks/useTransactions'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function DashboardPage() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.first_name
      if (name) setFirstName(name)
    })
  }, [])

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions({
    month,
    year,
  })

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
          <h1 className="text-2xl font-bold text-foreground">
            {firstName ? `Olá, ${firstName}` : 'Dashboard'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Resumo financeiro mensal</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova transação</span>
        </Button>
      </div>

      <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <SummaryCards transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart transactions={transactions} />
            <IncomeChart transactions={transactions} />
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Últimas transações</h2>
            <TransactionList
              transactions={transactions.slice(0, 8)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAdd}
      />
    </div>
  )
}
