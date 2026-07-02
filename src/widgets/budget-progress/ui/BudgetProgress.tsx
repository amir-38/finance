import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Wallet } from 'lucide-react';

import { CategoryIcon } from '@/entities/category';
import { Button } from '@/shared/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/shared/config/routes';
import { cn, formatCurrency } from '@/shared/utils/index';
import { useBudgetUsage } from '@/features/budget';

const statusIndicatorClass = {
  ok: '[&>div]:bg-success',
  warning: '[&>div]:bg-warning',
  over: '[&>div]:bg-destructive',
};

export function BudgetProgress() {
  const budgets = useBudgetUsage();

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Прогресс бюджета</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link to={ROUTES.BUDGET}>
              Все бюджеты
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <EmptyState icon={Wallet} title="Бюджет не настроен" description="Создайте лимиты по категориям или на месяц" />
        ) : (
          <div className="space-y-5">
            {budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={budget.icon} color={budget.color} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground">{budget.name}</span>
                      {budget.status !== 'ok' && (
                        <AlertTriangle
                          className={cn('size-3.5 shrink-0', budget.status === 'over' ? 'text-destructive' : 'text-warning')}
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(budget.spent)} из {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold tabular-nums',
                      budget.status === 'over'
                        ? 'text-destructive'
                        : budget.status === 'warning'
                          ? 'text-warning'
                          : 'text-foreground'
                    )}
                  >
                    {budget.percent}%
                  </span>
                </div>
                <Progress value={budget.percent} className={cn('h-2', statusIndicatorClass[budget.status])} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
