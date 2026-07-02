import { useMemo } from 'react';
import {
  useTransactionsQuery,
  compareToPreviousMonth,
  filterByMonth,
  getNetBalance,
  sumByType,
} from '@/entities/transaction';

export function useDashboardStats() {
  const { data: transactions = [] } = useTransactionsQuery();

  return useMemo(() => {
    const now = new Date();
    const monthTransactions = filterByMonth(transactions, now);

    const income = compareToPreviousMonth(transactions, 'income', now);
    const expense = compareToPreviousMonth(transactions, 'expense', now);
    const savings = income.current - expense.current;
    const previousSavings = income.previous - expense.previous;
    const savingsChangePercent =
      previousSavings === 0 ? 0 : Math.round(((savings - previousSavings) / Math.abs(previousSavings)) * 100);

    const daysElapsed = now.getDate();
    const avgExpensePerDay = expense.current / daysElapsed;

    return {
      balance: getNetBalance(transactions),
      income,
      expense,
      savings,
      savingsChangePercent,
      transactionsCount: monthTransactions.length,
      avgExpensePerDay,
      avgIncomePerMonth: sumByType(transactions, 'income') / 3,
    };
  }, [transactions]);
}
