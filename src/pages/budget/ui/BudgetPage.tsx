import { useState } from 'react';
import { AlertTriangle, MoreHorizontal, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BudgetFormDialog, DeleteBudgetDialog, useBudgetUsage, type BudgetUsage } from '@/features/budget';
import { getAllCategories, type Category } from '@/entities/category';
import type { Budget } from '@/entities/budget';
import { CategoryIcon } from '@/entities/category';
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
import { cn, formatCurrency } from '@/shared/utils/index';

const progressClass: Record<BudgetUsage['status'], string> = {
  ok: '[&>div]:bg-success',
  warning: '[&>div]:bg-warning',
  over: '[&>div]:bg-destructive',
};

const percentClass: Record<BudgetUsage['status'], string> = {
  ok: 'text-foreground',
  warning: 'text-warning',
  over: 'text-destructive',
};

export function BudgetPage() {
  const { t } = useTranslation();
  const budgets = useBudgetUsage();
  const [categories] = useState<Category[]>(() => getAllCategories());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [deletingBudget, setDeletingBudget] = useState<BudgetUsage | null>(null);

  const existingCategoryIds = budgets.map((budget) => budget.categoryId);

  function handleCreate() {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  }

  function handleEdit(budget: BudgetUsage) {
    setEditingBudget({ id: budget.id, categoryId: budget.categoryId, limit: budget.limit, month: budget.month });
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('budget.pageTitle')}
        description={t('budget.pageDescription')}
        actions={
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="size-4" />
            {t('budget.createBudget')}
          </Button>
        }
      />

      {budgets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={t('budget.noBudgetsTitle')}
          description={t('budget.noBudgetsDescription')}
          action={
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="size-4" />
              {t('budget.createBudget')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <Card key={budget.id} className="glass-card border-0">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={budget.icon} color={budget.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{budget.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(budget.spent)} {t('common.of')} {formatCurrency(budget.limit)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={t('common.actions')}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => handleEdit(budget)}>
                        <Pencil className="size-4" />
                        {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => setDeletingBudget(budget)}>
                        <Trash2 className="size-4" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Progress value={budget.percent} className={cn('h-2', progressClass[budget.status])} />

                <div className="flex items-center justify-between text-xs">
                  <span className={cn('font-semibold tabular-nums', percentClass[budget.status])}>{budget.percent}%</span>
                  {budget.status !== 'ok' && (
                    <span className={cn('flex items-center gap-1', percentClass[budget.status])}>
                      <AlertTriangle className="size-3.5" />
                      {budget.status === 'over' ? t('budget.limitExceeded') : t('budget.closeToLimit')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BudgetFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        budget={editingBudget}
        categories={categories}
        existingCategoryIds={existingCategoryIds}
      />

      <DeleteBudgetDialog budget={deletingBudget} onOpenChange={(open) => !open && setDeletingBudget(null)} />
    </div>
  );
}
