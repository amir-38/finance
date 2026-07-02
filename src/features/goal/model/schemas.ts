import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(2, 'Введите название'),
  targetAmount: z.coerce.number({ invalid_type_error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
  currentAmount: z.coerce.number({ invalid_type_error: 'Введите сумму' }).min(0, 'Не может быть отрицательным'),
  deadline: z.date({ required_error: 'Выберите дату' }),
  icon: z.string().min(1, 'Выберите иконку'),
  color: z.string().min(1, 'Выберите цвет'),
});
export type GoalFormValues = z.infer<typeof goalSchema>;

export const contributeSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
});
export type ContributeFormValues = z.infer<typeof contributeSchema>;
