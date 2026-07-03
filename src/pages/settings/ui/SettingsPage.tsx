import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import { ChangePasswordForm, ProfileForm, useAuth } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '@/shared/components/PageHeader';
import { SUPPORTED_LANGUAGES } from '@/shared/i18n/config';
import { cn } from '@/shared/utils/index';

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Laptop },
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>{t('settings.appearance')}</CardTitle>
          <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid max-w-sm grid-cols-3 gap-3">
            {themeOptions.map(({ value, label, icon: Icon }) => (
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

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
          <CardDescription>{t('settings.languageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid max-w-sm grid-cols-2 gap-3">
            {SUPPORTED_LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => i18n.changeLanguage(lng)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border border-border/60 px-4 py-4 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50',
                  i18n.language === lng && 'border-primary bg-primary/10 text-primary'
                )}
              >
                {t(`language.${lng}`)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsPage() {
  const { isConfigured } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} description={t('settings.description')} />

      {!isConfigured && (
        <Card className="border-warning/30 bg-warning/10">
          <CardContent className="text-sm text-warning">{t('settings.notConfigured')}</CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>{t('settings.profile')}</CardTitle>
              <CardDescription>{t('settings.profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>{t('settings.changePassword')}</CardTitle>
              <CardDescription>{t('settings.changePasswordDescription')}</CardDescription>
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
