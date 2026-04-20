-- Enable Row Level Security
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric(12, 2) not null,
  category text not null,
  description text not null default '',
  date date not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- RLS Policies: users can only access their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Index for performance
create index if not exists transactions_user_id_date_idx on public.transactions (user_id, date desc);
