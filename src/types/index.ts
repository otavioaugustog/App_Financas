export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export interface TransactionInsert {
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
}

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Outros',
] as const

export const EXPENSE_CATEGORIES = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Contas',
  'Outros',
] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
