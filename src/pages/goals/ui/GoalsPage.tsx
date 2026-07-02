import { useState } from 'react';
import { MoreHorizontal, PiggyBank, Pencil, Plus, Trash2, Wallet } from 'lucide-react';

import { getGoalIcon, useGoalsQuery, type Goal } from '@/entities/goal';
import { AddFundsDialog, DeleteGoalDialog, GoalFormDialog } from '@/features/goal';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';
import { Progress } from '@/shared/components/ui/progress';
import { formatCurrency, formatDate, formatRelativeDate } from '@/shared/utils/index';

export function GoalsPage() {
  const { data: goals = [] } = useGoalsQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [fundingGoal, setFundingGoal] = useState<Goal | null>(null);

  function handleCreate() {
    setEditingGoal(undefined);
    setIsFormOpen(true);
  }

  function handleEdit(goal: Goal) {
    setEditingGoal(goal);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Цели"
        description="Копите осознанно — следите за прогрессом по каждой цели"
        actions={
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="size-4" />
            Новая цель
          </Button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Пока нет целей"
          description="Создайте первую цель, чтобы копить осознанно"
          action={
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="size-4" />
              Новая цель
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const Icon = getGoalIcon(goal.icon);
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal.id} className="glass-card border-0">
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${goal.color}1f`, color: goal.color }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {isCompleted ? 'Цель достигнута' : `до ${formatDate(goal.deadline, 'd MMMM yyyy')}`}
                        {!isCompleted && ` · ${formatRelativeDate(goal.deadline)}`}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Действия">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => setFundingGoal(goal)}>
                          <PiggyBank className="size-4" />
                          Пополнить
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleEdit(goal)}>
                          <Pencil className="size-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => setDeletingGoal(goal)}>
                          <Trash2 className="size-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold tabular-nums text-foreground">{percent}%</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(goal.currentAmount)} из {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => setFundingGoal(goal)}>
                    <PiggyBank className="size-3.5" />
                    Пополнить
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <GoalFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} goal={editingGoal} />
      <DeleteGoalDialog goal={deletingGoal} onOpenChange={(open) => !open && setDeletingGoal(null)} />
      <AddFundsDialog goal={fundingGoal} onOpenChange={(open) => !open && setFundingGoal(null)} />
    </div>
  );
}
