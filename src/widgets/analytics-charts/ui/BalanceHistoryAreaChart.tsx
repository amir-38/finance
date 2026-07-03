import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

import { useTransactionsQuery, getBalanceHistory } from '@/entities/transaction';
import { formatCompactCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function BalanceHistoryAreaChart() {
  const { t, i18n } = useTranslation();
  const { data: transactions = [] } = useTransactionsQuery();
  const data = useMemo(() => getBalanceHistory(transactions, 60),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, i18n.language]);

  return (
    <ChartCard title={t('analytics.balanceHistoryTitle')} description={t('analytics.balanceHistoryDescription')}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          minTickGap={32}
        />
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
          dataKey="balance"
          name={t('analytics.balanceSeriesName')}
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#balanceGradient)"
        />
      </AreaChart>
    </ChartCard>
  );
}
