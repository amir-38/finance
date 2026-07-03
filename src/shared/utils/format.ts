import { format, formatDistanceToNowStrict } from 'date-fns';
import { az, ru } from 'date-fns/locale';
import i18n from '@/shared/i18n/config';

const CURRENCY_SYMBOL = '₼';

const DATE_LOCALES = { az, ru };

function getDateLocale() {
  return DATE_LOCALES[i18n.language as keyof typeof DATE_LOCALES] ?? az;
}

function getIntlLocale(): string {
  return i18n.language === 'ru' ? 'ru-RU' : 'az-AZ';
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat(getIntlLocale(), { maximumFractionDigits: 0 });
  return `${formatter.format(amount)} ${CURRENCY_SYMBOL}`;
}

export function formatCompactCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat(getIntlLocale(), { notation: 'compact', maximumFractionDigits: 0 });
  return `${formatter.format(amount)} ${CURRENCY_SYMBOL}`;
}

export function formatSignedCurrency(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '−';
  return `${sign}${formatCurrency(Math.abs(amount))}`;
}

export function formatDate(date: string | Date, pattern = 'd MMMM'): string {
  return format(typeof date === 'string' ? new Date(date) : date, pattern, { locale: getDateLocale() });
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNowStrict(typeof date === 'string' ? new Date(date) : date, {
    addSuffix: true,
    locale: getDateLocale(),
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
