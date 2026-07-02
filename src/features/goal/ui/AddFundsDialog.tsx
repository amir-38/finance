import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useUpdateGoalMutation, type Goal } from '@/entities/goal';
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
import { formatCurrency } from '@/shared/utils/index';
import { contributeSchema, type ContributeFormValues } from '../model/schemas';

interface AddFundsDialogProps {
  goal: Goal | null;
  onOpenChange: (open: boolean) => void;
}

export function AddFundsDialog({ goal, onOpenChange }: AddFundsDialogProps) {
  const updateMutation = useUpdateGoalMutation();

  const form = useForm<ContributeFormValues>({
    resolver: zodResolver(contributeSchema),
    defaultValues: { amount: 0 },
  });

  useEffect(() => {
    if (goal) form.reset({ amount: 0 });
  }, [goal, form]);

  async function onSubmit(values: ContributeFormValues) {
    if (!goal) return;
    try {
      await updateMutation.mutateAsync({
        id: goal.id,
        input: {
          title: goal.title,
          icon: goal.icon,
          color: goal.color,
          targetAmount: goal.targetAmount,
          deadline: goal.deadline,
          currentAmount: goal.currentAmount + values.amount,
        },
      });
      toast.success('Средства добавлены');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось пополнить цель');
    }
  }

  return (
    <Dialog open={Boolean(goal)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Пополнить цель</DialogTitle>
          <DialogDescription>
            {goal && `Сейчас накоплено ${formatCurrency(goal.currentAmount)} из ${formatCurrency(goal.targetAmount)}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма пополнения, ₼</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                {updateMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Пополнить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
