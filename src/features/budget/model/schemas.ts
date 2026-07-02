import { z } from 'zod';

export const OVERALL_BUDGET_VALUE = '__overall__';

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Выберите категорию'),
  limit: z.coerce.number({ invalid_type_error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
});
export type BudgetFormValues = z.infer<typeof budgetSchema>;
