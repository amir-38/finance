import { Link } from 'react-router-dom';

import { AuthCard, NewPasswordForm, RequestResetForm, useIsPasswordRecovery } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';

export function ResetPasswordPage() {
  const isRecovery = useIsPasswordRecovery();

  return (
    <AuthCard
      title={isRecovery ? 'Новый пароль' : 'Восстановление пароля'}
      description={
        isRecovery
          ? 'Придумайте новый пароль для вашего аккаунта'
          : 'Укажите email — мы отправим ссылку для сброса пароля'
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Вспомнили пароль?{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
            Войти
          </Link>
        </p>
      }
    >
      {isRecovery ? <NewPasswordForm /> : <RequestResetForm />}
    </AuthCard>
  );
}
