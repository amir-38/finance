import { z } from 'zod';
import i18n from '@/shared/i18n/config';

export function transactionSchema() {
  return z.object({
    type: z.enum(['income', 'expense']),
    title: z.string().min(2, i18n.t('validation.enterTitle')),
    description: z.string().optional(),
    amount: z.coerce.number({ invalid_type_error: i18n.t('validation.enterAmount') }).positive(i18n.t('validation.amountPositive')),
    categoryId: z.string().min(1, i18n.t('common.selectCategory')),
    date: z.date({ required_error: i18n.t('common.selectDate') }),
    comment: z.string().optional(),
  });
}
export type TransactionFormValues = z.infer<ReturnType<typeof transactionSchema>>;
