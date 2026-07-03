import { z } from 'zod';
import i18n from '@/shared/i18n/config';

export function categorySchema() {
  return z.object({
    name: z.string().min(2, i18n.t('validation.enterTitle')),
    color: z.string().min(1, i18n.t('validation.selectColor')),
  });
}
export type CategoryFormValues = z.infer<ReturnType<typeof categorySchema>>;
