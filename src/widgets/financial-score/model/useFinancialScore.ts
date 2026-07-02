import { useMemo } from 'react';

import { useTransactionsQuery, compareToPreviousMonth } from '@/entities/transaction';
import { useBudgetUsage } from '@/features/budget';

export interface FinancialScoreResult {
  score: number;
  label: string;
  color: string;
}

function scoreToLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Отлично', color: '#10B981' };
  if (score >= 60) return { label: 'Хорошо', color: '#2563EB' };
  if (score >= 40) return { label: 'Нормально', color: '#F59E0B' };
  return { label: 'Требует внимания', color: '#EF4444' };
}

export function useFinancialScore(): FinancialScoreResult {
  const budgets = useBudgetUsage();
  const { data: transactions = [] } = useTransactionsQuery();

  return useMemo(() => {
    const now = new Date();
    const income = compareToPreviousMonth(transactions, 'income', now).current;
    const expense = compareToPreviousMonth(transactions, 'expense', now).current;

    const savingsRate = income > 0 ? Math.max(0, Math.min(1, (income - expense) / income)) : 0;
    const budgetAdherence =
      budgets.length === 0 ? 0.8 : budgets.reduce((sum, b) => sum + Math.max(0, 1 - b.percent / 100), 0) / budgets.length;

    const score = Math.round(Math.min(100, Math.max(0, savingsRate * 60 + budgetAdherence * 40)));
    const { label, color } = scoreToLabel(score);

    return { score, label, color };
  }, [budgets, transactions]);
}
