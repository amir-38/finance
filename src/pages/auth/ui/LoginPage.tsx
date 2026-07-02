import { Link } from 'react-router-dom';

import { AuthCard, GoogleAuthButton, LoginForm } from '@/features/auth';
import { Separator } from '@/shared/components/ui/separator';
import { ROUTES } from '@/shared/config/routes';

export function LoginPage() {
  return (
    <AuthCard
      title="Вход"
      description="Войдите, чтобы продолжить управлять финансами"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link to={ROUTES.AUTH.REGISTER} className="font-medium text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      }
    >
      <LoginForm />
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
