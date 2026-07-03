import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { az, ru } from 'date-fns/locale';
import i18n from '@/shared/i18n/config';
import type { Transaction, TransactionType } from './types';

const DATE_LOCALES = { az, ru };

function getDateLocale() {
  return DATE_LOCALES[i18n.language as keyof typeof DATE_LOCALES] ?? az;
}

export function filterByMonth(transactions: Transaction[], reference: Date): Transaction[] {
  return transactions.filter((tx) => isSameMonth(new Date(tx.date), reference));
}

export function filterByDay(transactions: Transaction[], reference: Date): Transaction[] {
  return transactions.filter((tx) => isSameDay(new Date(tx.date), reference));
}

export function sumByType(transactions: Transaction[], type: TransactionType): number {
  return transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);
}

export function getNetBalance(transactions: Transaction[]): number {
  return sumByType(transactions, 'income') - sumByType(transactions, 'expense');
}

export interface CategoryTotal {
  categoryId: string;
  total: number;
}

export function getCategoryTotals(transactions: Transaction[], type: TransactionType): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== type) continue;
    totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0) + tx.amount);
  }
  return Array.from(totals.entries())
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}

export interface MonthOverMonth {
  current: number;
  previous: number;
  changePercent: number;
}

export function compareToPreviousMonth(
  transactions: Transaction[],
  type: TransactionType,
  reference: Date,
): MonthOverMonth {
  const current = sumByType(filterByMonth(transactions, reference), type);
  const previous = sumByType(filterByMonth(transactions, subMonths(reference, 1)), type);
  const changePercent = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);
  return { current, previous, changePercent };
}

export interface MonthlyBucket {
  monthKey: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export function getMonthlyBuckets(
  transactions: Transaction[],
  monthsCount: number,
  reference = new Date(),
): MonthlyBucket[] {
  const buckets: MonthlyBucket[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const monthDate = subMonths(reference, i);
    const monthKey = format(monthDate, 'yyyy-MM');
    const monthTx = transactions.filter((tx) => tx.date.startsWith(monthKey));
    const income = sumByType(monthTx, 'income');
    const expense = sumByType(monthTx, 'expense');

    buckets.push({
      monthKey,
      label: format(monthDate, 'LLL', { locale: getDateLocale() }),
      income,
      expense,
      net: income - expense,
    });
  }

  return buckets;
}

export interface WeeklyExpenseBucket {
  weekKey: string;
  label: string;
  total: number;
}

export function getWeeklyExpenses(
  transactions: Transaction[],
  weeksCount: number,
  reference = new Date(),
): WeeklyExpenseBucket[] {
  const buckets: WeeklyExpenseBucket[] = [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(reference, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const total = transactions
      .filter((tx) => tx.type === 'expense' && isWithinInterval(new Date(tx.date), { start: weekStart, end: weekEnd }))
      .reduce((sum, tx) => sum + tx.amount, 0);

    buckets.push({
      weekKey: format(weekStart, 'yyyy-MM-dd'),
      label: format(weekStart, 'd MMM', { locale: getDateLocale() }),
      total,
    });
  }

  return buckets;
}

export interface BalanceHistoryPoint {
  date: string;
  label: string;
  balance: number;
}

export function getBalanceHistory(
  transactions: Transaction[],
  daysCount: number,
  reference = new Date(),
): BalanceHistoryPoint[] {
  const start = subDays(reference, daysCount - 1);
  const priorBalance = transactions
    .filter((tx) => new Date(tx.date) < start)
    .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);

  let running = priorBalance;
  const points: BalanceHistoryPoint[] = [];

  for (let i = 0; i < daysCount; i++) {
    const day = addDays(start, i);
    const dayTotal = filterByDay(transactions, day).reduce(
      (sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount),
      0,
    );
    running += dayTotal;
    points.push({ date: format(day, 'yyyy-MM-dd'), label: format(day, 'd MMM', { locale: getDateLocale() }), balance: running });
  }

  return points;
}
