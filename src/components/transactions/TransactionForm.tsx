'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Transaction, TransactionInsert, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (data: TransactionInsert) => Promise<void>
  onCancel: () => void
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense')
  const [amount, setAmount] = useState(transaction?.amount.toString() || '')
  const [category, setCategory] = useState(transaction?.category || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [date, setDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date + 'T12:00:00') : new Date()
  )
  const [loading, setLoading] = useState(false)

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount.replace(',', '.')),
        category,
        description,
        date: format(date, 'yyyy-MM-dd'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={type === 'expense' ? 'default' : 'outline'}
          className={type === 'expense' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          onClick={() => { setType('expense'); setCategory('') }}
        >
          Despesa
        </Button>
        <Button
          type="button"
          variant={type === 'income' ? 'default' : 'outline'}
          className={type === 'income' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
          onClick={() => { setType('income'); setCategory('') }}
        >
          Receita
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={category} onValueChange={(v) => setCategory(v ?? '')} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Supermercado, Salário..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Data</Label>
        <Popover>
          <PopoverTrigger
            className={cn(
              'flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione a data'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !category}
          className={cn(
            'flex-1',
            type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {loading ? 'Salvando...' : transaction ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}
