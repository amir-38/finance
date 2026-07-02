import { Link } from 'react-router-dom';

import { AuthCard, GoogleAuthButton, RegisterForm } from '@/features/auth';
import { Separator } from '@/shared/components/ui/separator';
import { ROUTES } from '@/shared/config/routes';

export function RegisterPage() {
  return (
    <AuthCard
      title="Регистрация"
      description="Создайте аккаунт, чтобы начать вести бюджет"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
            Войти
          </Link>
        </p>
      }
    >
      <RegisterForm />
      <div className="relative py-1">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          или
        </span>
      </div>
      <GoogleAuthButton />
    </AuthCard>
  );
}
