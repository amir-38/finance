import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

import { useTransactionsQuery, getMonthlyBuckets } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function CashFlowLineChart() {
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getMonthlyBuckets(transactions, 6), [transactions]);

  return (
    <ChartCard title="Денежный поток" description="Чистый поток (доходы минус расходы) по месяцам">
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
        <ReferenceLine y={0} stroke="var(--border)" />
        <Line
          type="monotone"
          dataKey="net"
          name="Чистый поток"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartCard>
  );
}
