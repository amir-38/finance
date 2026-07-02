import { toast } from 'sonner';

import { useDeleteTransactionMutation, type Transaction } from '@/entities/transaction';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({ transaction, onOpenChange }: DeleteTransactionDialogProps) {
  const deleteMutation = useDeleteTransactionMutation();

  async function handleConfirm() {
    if (!transaction) return;
    try {
      await deleteMutation.mutateAsync(transaction.id);
      toast.success('Операция удалена');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить операцию');
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(transaction)}
      onOpenChange={onOpenChange}
      title="Удалить операцию?"
      description={transaction ? `«${transaction.title}» будет удалена без возможности восстановления.` : undefined}
      confirmLabel="Удалить"
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
