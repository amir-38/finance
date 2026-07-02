import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { ROUTES } from '@/shared/config/routes';
import { signUpWithPassword } from '../api/auth';
import { registerSchema, type RegisterFormValues } from '../model/schemas';

export function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: RegisterFormValues) {
    setLoading(true);
    try {
      const { hasSession } = await signUpWithPassword(values.email, values.password, values.fullName);
      if (hasSession) {
        toast.success('Аккаунт создан!');
        navigate(ROUTES.HOME);
      } else {
        toast.success('Мы отправили письмо для подтверждения аккаунта');
        navigate(ROUTES.AUTH.LOGIN);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать аккаунт');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Амир Саруханов" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Создать аккаунт
        </Button>
      </form>
    </Form>
  );
}
