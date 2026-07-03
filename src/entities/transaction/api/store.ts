import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import i18n from '@/shared/i18n/config';
import { MOCK_TRANSACTIONS } from '../model/mock';
import type { Transaction, TransactionType } from '../model/types';

const STORAGE_KEY = 'financeflow:transactions';

function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return MOCK_TRANSACTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {
    return MOCK_TRANSACTIONS;
  }
  return MOCK_TRANSACTIONS;
}

let transactions: Transaction[] = loadTransactions();

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export interface TransactionInput {
  type: TransactionType;
  title: string;
  description?: string;
  amount: number;
  categoryId: string;
  date: string;
  comment?: string;
}

interface TransactionRow {
  id: string;
  user_id: string;
  type: TransactionType;
  title: string;
  description: string | null;
  amount: number;
  category_id: string;
  date: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description ?? undefined,
    amount: row.amount,
    categoryId: row.category_id,
    date: row.date,
    comment: row.comment ?? undefined,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToRow(input: TransactionInput) {
  return {
    type: input.type,
    title: input.title,
    description: input.description ?? null,
    amount: input.amount,
    category_id: input.categoryId,
    date: input.date,
    comment: input.comment ?? null,
  };
}

export function getTransactionsSnapshot(): Transaction[] {
  return transactions;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRowToTransaction);
  }
  return transactions;
}

export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('transactions').insert(mapInputToRow(input)).select().single();
    if (error) throw new Error(error.message);
    return mapRowToTransaction(data);
  }

  const now = new Date().toISOString();
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    userId: 'mock-user',
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  transactions = [transaction, ...transactions];
  persist();
  return transaction;
}

export async function updateTransaction(id: string, input: TransactionInput): Promise<Transaction> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('transactions').update(mapInputToRow(input)).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return mapRowToTransaction(data);
  }

  let updated: Transaction | undefined;
  transactions = transactions.map((tx) => {
    if (tx.id !== id) return tx;
    updated = { ...tx, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });
  persist();
  if (!updated) throw new Error(i18n.t('common.notFound'));
  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }

  transactions = transactions.filter((tx) => tx.id !== id);
  persist();
}
