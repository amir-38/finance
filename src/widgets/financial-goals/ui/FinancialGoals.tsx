import { Link } from 'react-router-dom';
import { ArrowRight, Target } from 'lucide-react';

import { useGoalsQuery, getGoalIcon } from '@/entities/goal';
import { Button } from '@/shared/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/shared/config/routes';
import { formatCurrency, formatDate } from '@/shared/utils/index';

export function FinancialGoals() {
  const { data: goals = [] } = useGoalsQuery();

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Финансовые цели</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link to={ROUTES.GOALS}>
              Все цели
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <EmptyState icon={Target} title="Пока нет целей" description="Создайте цель, чтобы копить осознанно" />
        ) : (
          <div className="space-y-5">
            {goals.map((goal) => {
              const Icon = getGoalIcon(goal.icon);
              const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${goal.color}1f`, color: goal.color }}
                    >
                      <Icon className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">до {formatDate(goal.deadline, 'd MMMM yyyy')}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{percent}%</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} из {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
