import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function SavingsGrowthAreaChart() {
  const { data: transactions = [] } = useTransactionsQuery();

  const data = useMemo(() => {
    const buckets = getMonthlyBuckets(transactions, 6);
    let cumulative = 0;
    return buckets.map((bucket) => {
      cumulative += bucket.net;
      return { label: bucket.label, savings: cumulative };
    });
  }, [transactions]);

  return (
    <ChartCard title="Рост сбережений" description="Накопленные сбережения по месяцам">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="savings"
          name="Сбережения"
          stroke="var(--success)"
          strokeWidth={2.5}
          fill="url(#savingsGradient)"
        />
      </AreaChart>
    </ChartCard>
  );
}
