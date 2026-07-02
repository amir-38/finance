import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z.string().min(2, 'Введите название'),
  description: z.string().optional(),
  amount: z.coerce.number({ invalid_type_error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  date: z.date({ required_error: 'Выберите дату' }),
  comment: z.string().optional(),
});
export type TransactionFormValues = z.infer<typeof transactionSchema>;
