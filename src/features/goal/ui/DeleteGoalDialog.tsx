import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useDeleteGoalMutation, type Goal } from '@/entities/goal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface DeleteGoalDialogProps {
  goal: Goal | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGoalDialog({ goal, onOpenChange }: DeleteGoalDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteGoalMutation();

  async function handleConfirm() {
    if (!goal) return;
    try {
      await deleteMutation.mutateAsync(goal.id);
      toast.success(t('goals.goalDeleted'));
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('goals.goalDeleteFailed'));
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(goal)}
      onOpenChange={onOpenChange}
      title={t('goals.deleteGoalTitle')}
      description={goal ? t('goals.deleteGoalDescription', { title: goal.title }) : undefined}
      confirmLabel={t('common.delete')}
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
