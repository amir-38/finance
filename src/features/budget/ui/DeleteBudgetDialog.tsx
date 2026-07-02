import { toast } from 'sonner';

import { useDeleteBudgetMutation } from '@/entities/budget';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { BudgetUsage } from '../model/useBudgetUsage';

interface DeleteBudgetDialogProps {
  budget: BudgetUsage | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBudgetDialog({ budget, onOpenChange }: DeleteBudgetDialogProps) {
  const deleteMutation = useDeleteBudgetMutation();

  async function handleConfirm() {
    if (!budget) return;
    try {
      await deleteMutation.mutateAsync(budget.id);
      toast.success('Бюджет удалён');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить бюджет');
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(budget)}
      onOpenChange={onOpenChange}
      title="Удалить бюджет?"
      description={budget ? `Лимит «${budget.name}» будет удалён.` : undefined}
      confirmLabel="Удалить"
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
