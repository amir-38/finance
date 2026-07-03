import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

import { useTransactionsQuery, getWeeklyExpenses } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function WeeklyExpensesBarChart() {
  const { t, i18n } = useTranslation();
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getWeeklyExpenses(transactions, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, i18n.language]);

  return (
    <ChartCard title={t('analytics.weeklyExpensesTitle')} description={t('analytics.last10Weeks')}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={formatCompactCurrency}
          width={78}
        />
        <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
        <Bar dataKey="total" name={t('analytics.expensesSeriesName')} fill="var(--warning)" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartCard>
  );
}
