import { useMemo } from 'react';
import { subDays } from 'date-fns';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

import { getCategoryById } from '@/entities/category';
import { useTransactionsQuery, getCategoryTotals } from '@/entities/transaction';
import { formatCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

const MAX_SLICES = 6;

export function ExpensesByCategoryPieChart() {
  const { data: transactions = [] } = useTransactionsQuery();

  const data = useMemo(() => {
    const since = subDays(new Date(), 30);
    const recentTx = transactions.filter((tx) => new Date(tx.date) >= since);
    const totals = getCategoryTotals(recentTx, 'expense');
    const top = totals.slice(0, MAX_SLICES);
    const restTotal = totals.slice(MAX_SLICES).reduce((sum, item) => sum + item.total, 0);

    const items = top.map((item) => {
      const category = getCategoryById(item.categoryId);
      return { name: category.name, value: item.total, color: category.color };
    });

    if (restTotal > 0) {
      items.push({ name: 'Остальное', value: restTotal, color: '#64748B' });
    }

    return items;
  }, [transactions]);

  return (
    <ChartCard title="Расходы по категориям" description="За последние 30 дней">
      <PieChart>
        <Tooltip content={<ChartTooltipContent valueFormatter={formatCurrency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          animationDuration={700}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}
