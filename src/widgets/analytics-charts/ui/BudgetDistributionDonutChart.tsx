import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

import { useBudgetUsage } from '@/features/budget';
import { formatCurrency } from '@/shared/utils/index';
import { ChartCard } from './ChartCard';
import { ChartTooltipContent } from './ChartTooltipContent';

export function BudgetDistributionDonutChart() {
  const { t } = useTranslation();
  const budgets = useBudgetUsage();

  const data = useMemo(
    () =>
      budgets
        .filter((budget) => budget.id !== 'budget-overall')
        .map((budget) => ({ name: budget.name, value: budget.limit, color: budget.color })),
    [budgets]
  );

  return (
    <ChartCard title={t('analytics.budgetDistributionTitle')} description={t('analytics.budgetDistributionDescription')}>
      <PieChart>
        <Tooltip content={<ChartTooltipContent valueFormatter={formatCurrency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={3} animationDuration={700}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}
