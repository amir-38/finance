import { useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getCategoryById } from '@/entities/category';
import { useBudgetsQuery } from '@/entities/budget';
import { useTransactionsQuery } from '@/entities/transaction';

export interface BudgetUsage {
  id: string;
  categoryId: string | null;
  month: string;
  name: string;
  icon: string;
  color: string;
  limit: number;
  spent: number;
  percent: number;
  status: 'ok' | 'warning' | 'over';
}

export function useBudgetUsage(): BudgetUsage[] {
  const { t, i18n } = useTranslation();
  const { data: transactions = [] } = useTransactionsQuery();
  const { data: budgets = [] } = useBudgetsQuery();

  return useMemo(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');

    return budgets
      .filter((budget) => budget.month === currentMonth)
      .map((budget) => {
        const spent = transactions
          .filter((tx) => {
            if (tx.type !== 'expense') return false;
            if (!tx.date.startsWith(currentMonth)) return false;
            return budget.categoryId === null || tx.categoryId === budget.categoryId;
          })
          .reduce((sum, tx) => sum + tx.amount, 0);

        const percent = Math.min(100, Math.round((spent / budget.limit) * 100));
        const status: BudgetUsage['status'] = percent >= 100 ? 'over' : percent >= 80 ? 'warning' : 'ok';

        const category = budget.categoryId ? getCategoryById(budget.categoryId) : null;

        return {
          id: budget.id,
          categoryId: budget.categoryId,
          month: budget.month,
          name: category?.name ?? t('budget.overallBudget'),
          icon: category?.icon ?? 'wallet',
          color: category?.color ?? '#2563EB',
          limit: budget.limit,
          spent,
          percent,
          status,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, budgets, i18n.language]);
}
