import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AuthCard, NewPasswordForm, RequestResetForm, useIsPasswordRecovery } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';

export function ResetPasswordPage() {
  const isRecovery = useIsPasswordRecovery();
  const { t } = useTranslation();

  return (
    <AuthCard
      title={isRecovery ? t('auth.newPasswordTitle') : t('auth.resetTitle')}
      description={isRecovery ? t('auth.newPasswordDescription') : t('auth.resetDescription')}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.rememberedPassword')}{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      }
    >
      {isRecovery ? <NewPasswordForm /> : <RequestResetForm />}
    </AuthCard>
  );
}
