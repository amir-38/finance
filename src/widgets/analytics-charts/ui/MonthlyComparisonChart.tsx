import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function MonthlyComparisonChart() {
  const { t, i18n } = useTranslation();
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getMonthlyBuckets(transactions, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, i18n.language]);

  return (
    <ChartCard title={t('analytics.monthlyComparisonTitle')} description={t('analytics.comparisonDescription')}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={formatCompactCurrency}
          width={78}
        />
        <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'var(--border)' }} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
        <Line type="monotone" dataKey="income" name={t('analytics.incomeSeriesName')} stroke="var(--success)" strokeWidth={2} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="expense" name={t('analytics.expensesSeriesName')} stroke="var(--destructive)" strokeWidth={2} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="net" name={t('analytics.netFlowSeriesName')} stroke="var(--primary)" strokeWidth={2} dot={{ r: 2.5 }} strokeDasharray="4 3" />
      </LineChart>
    </ChartCard>
  );
}
