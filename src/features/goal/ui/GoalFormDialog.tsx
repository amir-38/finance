import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { GOAL_ICON_MAP, getGoalIcon, useCreateGoalMutation, useUpdateGoalMutation, type Goal } from '@/entities/goal';
import { Button } from '@/shared/components/ui/button';
import { DatePicker } from '@/shared/components/DatePicker';
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
import { cn } from '@/shared/utils/index';
import { goalSchema, type GoalFormValues } from '../model/schemas';

const COLOR_PALETTE = ['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
}

function toDefaultValues(goal?: Goal): GoalFormValues {
  if (!goal) {
    return {
      title: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date(),
      icon: 'piggy-bank',
      color: COLOR_PALETTE[0],
    };
  }
  return {
    title: goal.title,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    deadline: new Date(goal.deadline),
    icon: goal.icon,
    color: goal.color,
  };
}

export function GoalFormDialog({ open, onOpenChange, goal }: GoalFormDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(goal);
  const createMutation = useCreateGoalMutation();
  const updateMutation = useUpdateGoalMutation();
  const loading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema()),
    defaultValues: toDefaultValues(goal),
  });

  useEffect(() => {
    if (open) form.reset(toDefaultValues(goal));
  }, [open, goal, form]);

  async function onSubmit(values: GoalFormValues) {
    const input = {
      title: values.title,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      deadline: values.deadline.toISOString(),
      icon: values.icon,
      color: values.color,
    };

    try {
      if (isEdit && goal) {
        await updateMutation.mutateAsync({ id: goal.id, input });
        toast.success(t('goals.goalUpdated'));
      } else {
        await createMutation.mutateAsync(input);
        toast.success(t('goals.goalCreated'));
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('goals.goalSaveFailed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('goals.editGoalTitle') : t('goals.newGoalTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('goals.editGoalDescription') : t('goals.createGoalDialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('goals.titlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('goals.targetLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('goals.currentLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.deadlineLabel')}</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} disabled={(date) => date < new Date()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.iconLabel')}</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(GOAL_ICON_MAP).map((iconKey) => {
                        const Icon = getGoalIcon(iconKey);
                        const selected = field.value === iconKey;
                        return (
                          <button
                            key={iconKey}
                            type="button"
                            onClick={() => field.onChange(iconKey)}
                            className={cn(
                              'flex size-10 items-center justify-center rounded-xl border-2 text-muted-foreground transition-colors',
                              selected ? 'border-primary text-primary' : 'border-transparent bg-muted hover:text-foreground'
                            )}
                          >
                            <Icon className="size-4.5" />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.colorLabel')}</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={cn(
                            'size-8 rounded-full border-2 transition-transform hover:scale-110',
                            field.value === color ? 'border-foreground' : 'border-transparent'
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? t('common.save') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
