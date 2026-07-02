import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Введите название'),
  color: z.string().min(1, 'Выберите цвет'),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
