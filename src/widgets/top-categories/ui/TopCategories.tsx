import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

import { getCategoryById, CategoryIcon } from '@/entities/category';
import { useTransactionsQuery, filterByMonth, getCategoryTotals } from '@/entities/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/EmptyState';
import { formatCurrency, formatPercent } from '@/shared/utils/index';

export function TopCategories() {
  const { data: transactions = [] } = useTransactionsQuery();

  const items = useMemo(() => {
    const monthTransactions = filterByMonth(transactions, new Date());
    const totals = getCategoryTotals(monthTransactions, 'expense').slice(0, 5);
    const grandTotal = totals.reduce((sum, item) => sum + item.total, 0) || 1;

    return totals.map((item) => ({
      category: getCategoryById(item.categoryId),
      total: item.total,
      percent: (item.total / grandTotal) * 100,
    }));
  }, [transactions]);

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Топ категорий</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={PieChart} title="Нет расходов за месяц" />
        ) : (
          <div className="space-y-4">
            {items.map(({ category, total, percent }, index) => (
              <div key={category.id} className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{category.name}</span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{formatPercent(percent)} от расходов</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
