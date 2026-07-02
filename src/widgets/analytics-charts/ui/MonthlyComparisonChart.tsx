import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function MonthlyComparisonChart() {
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getMonthlyBuckets(transactions, 6), [transactions]);

  return (
    <ChartCard title="Сравнение по месяцам" description="Доходы, расходы и чистый поток">
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
        <Line type="monotone" dataKey="income" name="Доходы" stroke="var(--success)" strokeWidth={2} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="expense" name="Расходы" stroke="var(--destructive)" strokeWidth={2} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="net" name="Чистый поток" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2.5 }} strokeDasharray="4 3" />
      </LineChart>
    </ChartCard>
  );
}
