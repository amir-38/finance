import { z } from 'zod';
import i18n from '@/shared/i18n/config';

export const OVERALL_BUDGET_VALUE = '__overall__';

export function budgetSchema() {
  return z.object({
    categoryId: z.string().min(1, i18n.t('common.selectCategory')),
    limit: z.coerce.number({ invalid_type_error: i18n.t('validation.enterAmount') }).positive(i18n.t('validation.amountPositive')),
  });
}
export type BudgetFormValues = z.infer<ReturnType<typeof budgetSchema>>;
