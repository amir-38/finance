import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Receipt } from 'lucide-react';

import { useTransactionsQuery } from '@/entities/transaction';
import { Button } from '@/shared/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/shared/config/routes';
import { TransactionRow } from './TransactionRow';

export function RecentTransactions() {
  const { data = [] } = useTransactionsQuery();

  const transactions = useMemo(
    () => [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
    [data]
  );

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Последние операции</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link to={ROUTES.TRANSACTIONS}>
              Все операции
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState icon={Receipt} title="Пока нет операций" description="Добавьте первую операцию, чтобы увидеть историю" />
        ) : (
          <div className="flex flex-col gap-0.5">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
