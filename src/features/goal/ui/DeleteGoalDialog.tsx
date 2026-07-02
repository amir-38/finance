import { toast } from 'sonner';

import { useDeleteGoalMutation, type Goal } from '@/entities/goal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface DeleteGoalDialogProps {
  goal: Goal | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGoalDialog({ goal, onOpenChange }: DeleteGoalDialogProps) {
  const deleteMutation = useDeleteGoalMutation();

  async function handleConfirm() {
    if (!goal) return;
    try {
      await deleteMutation.mutateAsync(goal.id);
      toast.success('Цель удалена');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить цель');
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(goal)}
      onOpenChange={onOpenChange}
      title="Удалить цель?"
      description={goal ? `«${goal.title}» будет удалена без возможности восстановления.` : undefined}
      confirmLabel="Удалить"
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
