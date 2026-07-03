import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AuthCard, GoogleAuthButton, LoginForm } from '@/features/auth';
import { Separator } from '@/shared/components/ui/separator';
import { ROUTES } from '@/shared/config/routes';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <AuthCard
      title={t('auth.loginTitle')}
      description={t('auth.loginDescription')}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link to={ROUTES.AUTH.REGISTER} className="font-medium text-primary hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      }
    >
      <LoginForm />
      <div className="relative py-1">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          {t('common.or')}
        </span>
      </div>
      <GoogleAuthButton />
    </AuthCard>
  );
}
