import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { updateProfile } from '../api/auth';
import { useAuth } from '../model/AuthContext';
import { profileSchema, type ProfileFormValues } from '../model/schemas';

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
  return email.slice(0, 2).toUpperCase();
}

export function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName ?? '' },
  });

  async function onSubmit(values: ProfileFormValues) {
    setLoading(true);
    try {
      await updateProfile({ fullName: values.fullName });
      toast.success('Профиль обновлён');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось сохранить изменения');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 border border-border/60">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {getInitials(user?.fullName ?? null, user?.email ?? 'ГС')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{user?.fullName ?? 'Без имени'}</p>
          <p className="text-sm text-muted-foreground">{user?.email ?? 'Вход не выполнен'}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Ваше имя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ''} disabled />
          </div>
          <Button type="submit" className="gap-2" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Сохранить изменения
          </Button>
        </form>
      </Form>
    </div>
  );
}
