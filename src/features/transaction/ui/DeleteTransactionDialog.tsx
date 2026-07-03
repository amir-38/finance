import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useDeleteTransactionMutation, type Transaction } from '@/entities/transaction';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({ transaction, onOpenChange }: DeleteTransactionDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteTransactionMutation();

  async function handleConfirm() {
    if (!transaction) return;
    try {
      await deleteMutation.mutateAsync(transaction.id);
      toast.success(t('transactions.transactionDeleted'));
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('transactions.transactionDeleteFailed'));
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(transaction)}
      onOpenChange={onOpenChange}
      title={t('transactions.deleteTransactionTitle')}
      description={transaction ? t('transactions.deleteTransactionDescription', { title: transaction.title }) : undefined}
      confirmLabel={t('common.delete')}
      variant="destructive"
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
