import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function MonthlySpendingBarChart() {
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getMonthlyBuckets(transactions, 6), [transactions]);

  return (
    <ChartCard title="Расходы по месяцам" description="Сумма расходов за последние 6 месяцев">
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
        <Bar dataKey="expense" name="Расходы" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartCard>
  );
}
