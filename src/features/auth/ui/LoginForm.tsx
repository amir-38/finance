import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { ROUTES } from '@/shared/config/routes';
import { signInWithPassword } from '../api/auth';
import { loginSchema, type LoginFormValues } from '../model/schemas';

export function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    try {
      await signInWithPassword(values.email, values.password);
      toast.success('Добро пожаловать!');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <FormLabel>Пароль</FormLabel>
                <Link to={ROUTES.AUTH.RESET_PASSWORD} className="text-xs text-primary hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Войти
        </Button>
      </form>
    </Form>
  );
}
