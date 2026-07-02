import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { updatePassword } from '../api/auth';
import { newPasswordSchema, type NewPasswordFormValues } from '../model/schemas';

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(values: NewPasswordFormValues) {
    setLoading(true);
    try {
      await updatePassword(values.password);
      toast.success('Пароль обновлён');
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
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
        <Button type="submit" className="gap-2" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Обновить пароль
        </Button>
      </form>
    </Form>
  );
}
