'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthSelectorProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  const currentDate = new Date(year, month, 1)

  const prev = () => {
    const d = new Date(year, month - 1, 1)
    onChange(d.getMonth(), d.getFullYear())
  }

  const next = () => {
    const d = new Date(year, month + 1, 1)
    onChange(d.getMonth(), d.getFullYear())
  }

  const label = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={prev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium capitalize min-w-[150px] text-center">{label}</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={next}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
