import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { resetPasswordForEmail } from '../api/auth';
import { requestResetSchema, type RequestResetFormValues } from '../model/schemas';

export function RequestResetForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: RequestResetFormValues) {
    setLoading(true);
    try {
      await resetPasswordForEmail(values.email);
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось отправить ссылку');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success/10 px-4 py-6 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-sm text-foreground">
          Мы отправили ссылку для восстановления пароля на <strong>{form.getValues('email')}</strong>
        </p>
      </div>
    );
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
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Отправить ссылку
        </Button>
      </form>
    </Form>
  );
}
