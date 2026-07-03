import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useDeleteBudgetMutation } from '@/entities/budget';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { BudgetUsage } from '../model/useBudgetUsage';

interface DeleteBudgetDialogProps {
  budget: BudgetUsage | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBudgetDialog({ budget, onOpenChange }: DeleteBudgetDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteBudgetMutation();

  async function handleConfirm() {
    if (!budget) return;
    try {
      await deleteMutation.mutateAsync(budget.id);
      toast.success(t('budget.budgetDeleted'));
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('budget.budgetDeleteFailed'));
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(budget)}
      onOpenChange={onOpenChange}
      title={t('budget.deleteBudgetTitle')}
      description={budget ? t('budget.deleteBudgetDescription', { name: budget.name }) : undefined}
      confirmLabel={t('common.delete')}
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
