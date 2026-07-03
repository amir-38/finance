import { z } from 'zod';
import i18n from '@/shared/i18n/config';

export function goalSchema() {
  return z.object({
    title: z.string().min(2, i18n.t('validation.enterTitle')),
    targetAmount: z.coerce.number({ invalid_type_error: i18n.t('validation.enterAmount') }).positive(i18n.t('validation.amountPositive')),
    currentAmount: z.coerce.number({ invalid_type_error: i18n.t('validation.enterAmount') }).min(0, i18n.t('validation.notNegative')),
    deadline: z.date({ required_error: i18n.t('common.selectDate') }),
    icon: z.string().min(1, i18n.t('validation.selectIcon')),
    color: z.string().min(1, i18n.t('validation.selectColor')),
  });
}
export type GoalFormValues = z.infer<ReturnType<typeof goalSchema>>;

export function contributeSchema() {
  return z.object({
    amount: z.coerce.number({ invalid_type_error: i18n.t('validation.enterAmount') }).positive(i18n.t('validation.amountPositive')),
  });
}
export type ContributeFormValues = z.infer<ReturnType<typeof contributeSchema>>;
