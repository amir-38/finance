import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

import { getCategoryById } from '@/entities/category';
import { useTransactionsQuery } from '@/entities/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/EmptyState';
import { cn, formatRelativeDate, formatSignedCurrency } from '@/shared/utils/index';

export function TransactionsTimeline() {
  const { data = [] } = useTransactionsQuery();

  const items = useMemo(
    () => [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12),
    [data]
  );

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Хронология операций</CardTitle>
        <CardDescription>Последние 12 операций</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={History} title="Пока нет операций" />
        ) : (
          <div className="relative space-y-5 pl-6">
            <div className="absolute top-1.5 bottom-1.5 left-[7px] w-px bg-border" />
            {items.map((transaction, index) => {
              const category = getCategoryById(transaction.categoryId);
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="relative flex items-start gap-3"
                >
                  <span
                    className="absolute top-1 -left-6 size-3.5 rounded-full ring-4 ring-card"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{transaction.title}</span>
                      <span
                        className={cn(
                          'shrink-0 text-sm font-semibold tabular-nums',
                          transaction.type === 'income' ? 'text-success' : 'text-foreground'
                        )}
                      >
                        {formatSignedCurrency(transaction.amount, transaction.type)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {category.name} · {formatRelativeDate(transaction.date)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
