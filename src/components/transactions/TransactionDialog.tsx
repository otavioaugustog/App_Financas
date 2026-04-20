'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TransactionForm } from './TransactionForm'
import { Transaction, TransactionInsert } from '@/types'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  onSubmit: (data: TransactionInsert) => Promise<void>
}

export function TransactionDialog({ open, onOpenChange, transaction, onSubmit }: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSubmit={async (data) => {
            await onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
