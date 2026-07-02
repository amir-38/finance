import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Введите имя'),
    email: z.string().min(1, 'Введите email').email('Некорректный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const requestResetSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
});
export type RequestResetFormValues = z.infer<typeof requestResetSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Введите имя'),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
