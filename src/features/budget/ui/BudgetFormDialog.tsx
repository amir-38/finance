import { useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Budget } from '@/entities/budget';
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '@/entities/budget';
import { CategorySelect, type Category } from '@/entities/category';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { OVERALL_BUDGET_VALUE, budgetSchema, type BudgetFormValues } from '../model/schemas';

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
  categories: Category[];
  existingCategoryIds: (string | null)[];
}

function toDefaultValues(budget?: Budget): BudgetFormValues {
  if (!budget) return { categoryId: '', limit: 0 };
  return { categoryId: budget.categoryId ?? OVERALL_BUDGET_VALUE, limit: budget.limit };
}

export function BudgetFormDialog({ open, onOpenChange, budget, categories, existingCategoryIds }: BudgetFormDialogProps) {
  const isEdit = Boolean(budget);
  const createMutation = useCreateBudgetMutation();
  const updateMutation = useUpdateBudgetMutation();
  const loading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: toDefaultValues(budget),
  });

  useEffect(() => {
    if (open) form.reset(toDefaultValues(budget));
  }, [open, budget, form]);

  const availableCategories = categories.filter(
    (category) => category.id === budget?.categoryId || !existingCategoryIds.includes(category.id)
  );

  async function onSubmit(values: BudgetFormValues) {
    const categoryId = values.categoryId === OVERALL_BUDGET_VALUE ? null : values.categoryId;

    if (!isEdit && existingCategoryIds.includes(categoryId)) {
      form.setError('categoryId', { message: 'Бюджет для этой категории уже создан' });
      return;
    }

    const input = { categoryId, limit: values.limit, month: budget?.month ?? format(new Date(), 'yyyy-MM') };

    try {
      if (isEdit && budget) {
        await updateMutation.mutateAsync({ id: budget.id, input });
        toast.success('Бюджет обновлён');
      } else {
        await createMutation.mutateAsync(input);
        toast.success('Бюджет создан');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось сохранить бюджет');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактировать бюджет' : 'Новый бюджет'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Измените месячный лимит' : 'Задайте лимит на месяц — общий или по категории'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <FormControl>
                    <CategorySelect
                      categories={availableCategories}
                      value={field.value}
                      onChange={field.onChange}
                      overallOption={{ value: OVERALL_BUDGET_VALUE, label: 'Общий бюджет (все категории)' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Лимит на месяц, ₼</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
