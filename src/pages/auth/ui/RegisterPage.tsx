import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AuthCard, GoogleAuthButton, RegisterForm } from '@/features/auth';
import { Separator } from '@/shared/components/ui/separator';
import { ROUTES } from '@/shared/config/routes';

export function RegisterPage() {
  const { t } = useTranslation();

  return (
    <AuthCard
      title={t('auth.registerTitle')}
      description={t('auth.registerDescription')}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.haveAccount')}{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      }
    >
      <RegisterForm />
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
