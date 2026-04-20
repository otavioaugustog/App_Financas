'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TransactionDialog } from './TransactionDialog'
import { Transaction, TransactionInsert } from '@/types'
import { formatCurrency } from '@/lib/format'

interface TransactionListProps {
  transactions: Transaction[]
  onUpdate: (id: string, data: TransactionInsert) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TransactionList({ transactions, onUpdate, onDelete }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">Adicione sua primeira transação clicando no botão acima</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-1 h-10 rounded-full flex-shrink-0 ${
                  transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {transaction.description || transaction.category}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs py-0">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date + 'T12:00:00'), "d MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span
                className={`font-semibold text-sm ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingTransaction(transaction)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
        onSubmit={(data) => onUpdate(editingTransaction!.id, data)}
      />
    </>
  )
}
