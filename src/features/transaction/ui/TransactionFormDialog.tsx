import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/entities/category';
import { useCreateTransactionMutation, useUpdateTransactionMutation, type Transaction } from '@/entities/transaction';
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
import { Textarea } from '@/shared/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { cn } from '@/shared/utils/index';
import { transactionSchema, type TransactionFormValues } from '../model/schemas';
import { CategoryPicker } from './CategoryPicker';

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  categories: Category[];
  onRequestAddCategory: () => void;
}

function toDefaultValues(transaction?: Transaction): TransactionFormValues {
  if (!transaction) {
    return {
      type: 'expense',
      title: '',
      description: '',
      amount: 0,
      categoryId: '',
      date: new Date(),
      comment: '',
    };
  }
  return {
    type: transaction.type,
    title: transaction.title,
    description: transaction.description ?? '',
    amount: transaction.amount,
    categoryId: transaction.categoryId,
    date: new Date(transaction.date),
    comment: transaction.comment ?? '',
  };
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  categories,
  onRequestAddCategory,
}: TransactionFormDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(transaction);
  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const loading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema()),
    defaultValues: toDefaultValues(transaction),
  });

  useEffect(() => {
    if (open) form.reset(toDefaultValues(transaction));
  }, [open, transaction, form]);

  async function onSubmit(values: TransactionFormValues) {
    const input = {
      type: values.type,
      title: values.title,
      description: values.description || undefined,
      amount: values.amount,
      categoryId: values.categoryId,
      date: values.date.toISOString(),
      comment: values.comment || undefined,
    };

    try {
      if (isEdit && transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, input });
        toast.success(t('transactions.transactionUpdated'));
      } else {
        await createMutation.mutateAsync(input);
        toast.success(t('transactions.transactionCreated'));
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('transactions.transactionSaveFailed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('transactions.editTransactionTitle') : t('transactions.newTransactionTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('transactions.editTransactionDescription') : t('transactions.newTransactionDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.typeLabel')}</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => value && field.onChange(value)}
                      variant="outline"
                      className="w-full"
                    >
                      <ToggleGroupItem
                        value="expense"
                        className={cn(
                          'flex-1 gap-1.5 data-[state=on]:border-destructive data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive'
                        )}
                      >
                        <ArrowDownCircle className="size-4" />
                        {t('transactions.expenseType')}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="income"
                        className={cn(
                          'flex-1 gap-1.5 data-[state=on]:border-success data-[state=on]:bg-success/10 data-[state=on]:text-success'
                        )}
                      >
                        <ArrowUpCircle className="size-4" />
                        {t('transactions.incomeType')}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('transactions.titlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.amountLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.dateLabel')}</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.categoryLabel')}</FormLabel>
                  <FormControl>
                    <CategoryPicker
                      categories={categories}
                      value={field.value}
                      onChange={field.onChange}
                      onRequestAddCategory={onRequestAddCategory}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('transactions.descriptionPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.commentLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('transactions.commentPlaceholder')} rows={2} {...field} />
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
                {isEdit ? t('common.save') : t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
