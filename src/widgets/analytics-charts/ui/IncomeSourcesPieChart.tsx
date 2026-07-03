import { useMemo } from 'react';
import { subMonths } from 'date-fns';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

import { getCategoryById } from '@/entities/category';
import { useTransactionsQuery, getCategoryTotals } from '@/entities/transaction';
import { formatCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function IncomeSourcesPieChart() {
  const { t, i18n } = useTranslation();
  const { data: transactions = [] } = useTransactionsQuery();

  const data = useMemo(() => {
    const since = subMonths(new Date(), 3);
    const recent = transactions.filter((tx) => new Date(tx.date) >= since);
    return getCategoryTotals(recent, 'income').map((item) => {
      const category = getCategoryById(item.categoryId);
      return { name: category.name, value: item.total, color: category.color };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, i18n.language]);

  return (
    <ChartCard title={t('analytics.incomeSourcesTitle')} description={t('analytics.last3Months')}>
      <PieChart>
        <Tooltip content={<ChartTooltipContent valueFormatter={formatCurrency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="0%" outerRadius="85%" animationDuration={700}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}
