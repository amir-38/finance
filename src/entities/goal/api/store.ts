import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import i18n from '@/shared/i18n/config';
import { MOCK_GOALS } from '../model/mock';
import type { Goal } from '../model/types';

const STORAGE_KEY = 'financeflow:goals';

function loadGoals(): Goal[] {
  if (typeof window === 'undefined') return MOCK_GOALS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Goal[];
  } catch {
    return MOCK_GOALS;
  }
  return MOCK_GOALS;
}

let goals: Goal[] = loadGoals();

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export interface GoalInput {
  title: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  color: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

function mapRowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    color: row.color,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    deadline: row.deadline,
    createdAt: row.created_at,
  };
}

function mapInputToRow(input: GoalInput) {
  return {
    title: input.title,
    icon: input.icon,
    color: input.color,
    target_amount: input.targetAmount,
    current_amount: input.currentAmount,
    deadline: input.deadline,
  };
}

export function getGoalsSnapshot(): Goal[] {
  return goals;
}

export async function fetchGoals(): Promise<Goal[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRowToGoal);
  }
  return goals;
}

export async function createGoal(input: GoalInput): Promise<Goal> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('goals').insert(mapInputToRow(input)).select().single();
    if (error) throw new Error(error.message);
    return mapRowToGoal(data);
  }

  const now = new Date().toISOString();
  const goal: Goal = { id: crypto.randomUUID(), createdAt: now, ...input };
  goals = [goal, ...goals];
  persist();
  return goal;
}

export async function updateGoal(id: string, input: GoalInput): Promise<Goal> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('goals').update(mapInputToRow(input)).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return mapRowToGoal(data);
  }

  let updated: Goal | undefined;
  goals = goals.map((goal) => {
    if (goal.id !== id) return goal;
    updated = { ...goal, ...input };
    return updated;
  });
  persist();
  if (!updated) throw new Error(i18n.t('common.notFound'));
  return updated;
}

export async function deleteGoal(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }

  goals = goals.filter((goal) => goal.id !== id);
  persist();
}
