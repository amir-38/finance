import { format, formatDistanceToNowStrict } from 'date-fns';
import { ru } from 'date-fns/locale';

const CURRENCY_SYMBOL = '₼';

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat('ru-RU', {
  notation: 'compact',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return `${numberFormatter.format(amount)} ${CURRENCY_SYMBOL}`;
}

export function formatCompactCurrency(amount: number): string {
  return `${compactNumberFormatter.format(amount)} ${CURRENCY_SYMBOL}`;
}

export function formatSignedCurrency(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '−';
  return `${sign}${formatCurrency(Math.abs(amount))}`;
}

export function formatDate(date: string | Date, pattern = 'd MMMM'): string {
  return format(typeof date === 'string' ? new Date(date) : date, pattern, { locale: ru });
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNowStrict(typeof date === 'string' ? new Date(date) : date, {
    addSuffix: true,
    locale: ru,
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
