import { z } from 'zod';
import i18n from '@/shared/i18n/config';

export function loginSchema() {
  return z.object({
    email: z.string().min(1, i18n.t('validation.enterEmail')).email(i18n.t('validation.invalidEmail')),
    password: z.string().min(1, i18n.t('validation.enterPassword')),
  });
}
export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;

export function registerSchema() {
  return z
    .object({
      fullName: z.string().min(2, i18n.t('validation.enterName')),
      email: z.string().min(1, i18n.t('validation.enterEmail')).email(i18n.t('validation.invalidEmail')),
      password: z.string().min(8, i18n.t('validation.minChars8')),
      confirmPassword: z.string().min(1, i18n.t('auth.confirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}
export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>;

export function requestResetSchema() {
  return z.object({
    email: z.string().min(1, i18n.t('validation.enterEmail')).email(i18n.t('validation.invalidEmail')),
  });
}
export type RequestResetFormValues = z.infer<ReturnType<typeof requestResetSchema>>;

export function newPasswordSchema() {
  return z
    .object({
      password: z.string().min(8, i18n.t('validation.minChars8')),
      confirmPassword: z.string().min(1, i18n.t('auth.confirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}
export type NewPasswordFormValues = z.infer<ReturnType<typeof newPasswordSchema>>;

export function profileSchema() {
  return z.object({
    fullName: z.string().min(2, i18n.t('validation.enterName')),
  });
}
export type ProfileFormValues = z.infer<ReturnType<typeof profileSchema>>;
