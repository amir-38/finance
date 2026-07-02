import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getWeeklyExpenses } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function WeeklyExpensesBarChart() {
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getWeeklyExpenses(transactions, 10), [transactions]);

  return (
    <ChartCard title="Расходы по неделям" description="Последние 10 недель">
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
        <Bar dataKey="total" name="Расходы" fill="var(--warning)" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartCard>
  );
}
