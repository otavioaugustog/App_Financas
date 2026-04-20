# FinançasPessoais

App web de gestão financeira pessoal com Next.js 16, Supabase e shadcn/ui.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui** (base-ui v4)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Recharts** para gráficos
- **Vercel** para deploy

## Setup

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute o conteúdo de `supabase-schema.sql`
3. Copie a URL e anon key em **Project Settings → API**

### 2. Variáveis de ambiente

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

### 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 4. Deploy na Vercel

1. Faça push para GitHub
2. Importe o repo na Vercel
3. Configure as env vars: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Funcionalidades

- Autenticação com email/senha (Supabase Auth)
- Dashboard com resumo mensal (receitas, despesas, saldo)
- Gráfico de pizza — despesas por categoria
- Cadastro, edição e exclusão de transações
- Filtros por mês, tipo e categoria
- Responsivo (mobile-first)
- Row Level Security — cada usuário vê apenas seus próprios dados
