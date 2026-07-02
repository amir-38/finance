-- FinanceFlow — схема базы данных Supabase (Этап 9)
--
-- Как применить:
-- 1. Создайте проект на https://supabase.com
-- 2. Откройте Dashboard → SQL Editor → New query
-- 3. Вставьте содержимое этого файла целиком и выполните (Run)
-- 4. Скопируйте Project URL и anon public key (Settings → API) в .env (см. .env.example)
--
-- Все таблицы защищены Row Level Security: пользователь видит и изменяет
-- только свои собственные записи (auth.uid() = user_id).

create extension if not exists "pgcrypto";

-- ============================================================
-- TRANSACTIONS — доходы и расходы
-- ============================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  title text not null,
  description text,
  amount numeric(12, 2) not null check (amount > 0),
  category_id text not null,
  date timestamptz not null,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_id_date_idx on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ============================================================
-- BUDGETS — лимиты по категориям или на месяц целиком
-- ============================================================
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- null = общий лимит на месяц без привязки к категории
  category_id text,
  limit_amount numeric(12, 2) not null check (limit_amount > 0),
  month text not null, -- формат 'YYYY-MM'
  created_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

alter table public.budgets enable row level security;

create policy "budgets_select_own" on public.budgets
  for select using (auth.uid() = user_id);
create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);

-- ============================================================
-- GOALS — финансовые цели
-- ============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  icon text not null default 'piggy-bank',
  color text not null default '#2563EB',
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  deadline timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals_select_own" on public.goals
  for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals
  for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals
  for delete using (auth.uid() = user_id);

-- ============================================================
-- CATEGORIES — пользовательские категории поверх встроенного набора
-- (базовые категории — Еда, Транспорт и т.д. — захардкожены в приложении
-- и в этой таблице не хранятся)
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  icon text not null default 'tag',
  color text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);
