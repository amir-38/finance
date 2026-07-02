import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function IncomeExpenseLineChart() {
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getMonthlyBuckets(transactions, 6), [transactions]);

  return (
    <ChartCard title="Доходы и расходы" description="Динамика за последние 6 месяцев">
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
        <Line type="monotone" dataKey="income" name="Доходы" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="expense" name="Расходы" stroke="var(--destructive)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ChartCard>
  );
}
