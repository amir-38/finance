import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ChangePasswordForm, ProfileForm, useAuth } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '@/shared/components/PageHeader';
import { cn } from '@/shared/utils/index';

const THEME_OPTIONS = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Moon },
  { value: 'system', label: 'Системная', icon: Laptop },
] as const;

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle>Внешний вид</CardTitle>
        <CardDescription>Выберите тему интерфейса</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid max-w-sm grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border border-border/60 px-4 py-4 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50',
                theme === value && 'border-primary bg-primary/10 text-primary'
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { isConfigured } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader title="Настройки" description="Профиль, безопасность и внешний вид" />

      {!isConfigured && (
        <Card className="border-warning/30 bg-warning/10">
          <CardContent className="text-sm text-warning">
            Supabase не настроен — изменения профиля и пароля будут доступны после подключения ключей на Этапе 9.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Основная информация об аккаунте</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Смена пароля</CardTitle>
              <CardDescription>Обновите пароль для входа в аккаунт</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
