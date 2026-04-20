'use client'

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/format'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const cards = [
    {
      title: 'Receitas',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950',
      iconBg: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Despesas',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950',
      iconBg: 'bg-red-100 dark:bg-red-900',
    },
    {
      title: 'Saldo',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400',
      bg: balance >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-red-50 dark:bg-red-950',
      iconBg: balance >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`border-0 shadow-sm ${card.bg}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground dark:text-foreground">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
