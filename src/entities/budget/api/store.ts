import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import { MOCK_BUDGETS } from '../model/mock';
import type { Budget } from '../model/types';

const STORAGE_KEY = 'financeflow:budgets';

function loadBudgets(): Budget[] {
  if (typeof window === 'undefined') return MOCK_BUDGETS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Budget[];
  } catch {
    return MOCK_BUDGETS;
  }
  return MOCK_BUDGETS;
}

let budgets: Budget[] = loadBudgets();

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export interface BudgetInput {
  categoryId: string | null;
  limit: number;
  month: string;
}

interface BudgetRow {
  id: string;
  user_id: string;
  category_id: string | null;
  limit_amount: number;
  month: string;
  created_at: string;
}

function mapRowToBudget(row: BudgetRow): Budget {
  return { id: row.id, categoryId: row.category_id, limit: row.limit_amount, month: row.month };
}

function mapInputToRow(input: BudgetInput) {
  return { category_id: input.categoryId, limit_amount: input.limit, month: input.month };
}

export function getBudgetsSnapshot(): Budget[] {
  return budgets;
}

export async function fetchBudgets(): Promise<Budget[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('budgets').select('*');
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRowToBudget);
  }
  return budgets;
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('budgets').insert(mapInputToRow(input)).select().single();
    if (error) throw new Error(error.message);
    return mapRowToBudget(data);
  }

  const budget: Budget = { id: crypto.randomUUID(), ...input };
  budgets = [...budgets, budget];
  persist();
  return budget;
}

export async function updateBudget(id: string, input: BudgetInput): Promise<Budget> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('budgets').update(mapInputToRow(input)).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return mapRowToBudget(data);
  }

  let updated: Budget | undefined;
  budgets = budgets.map((budget) => {
    if (budget.id !== id) return budget;
    updated = { ...budget, ...input };
    return updated;
  });
  persist();
  if (!updated) throw new Error('Бюджет не найден');
  return updated;
}

export async function deleteBudget(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }

  budgets = budgets.filter((budget) => budget.id !== id);
  persist();
}
