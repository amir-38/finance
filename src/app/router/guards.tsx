import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';

function FullscreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, isConfigured } = useAuth();

  if (!isConfigured) return <>{children}</>;
  if (loading) return <FullscreenLoader />;
  if (!user) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  return <>{children}</>;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading, isConfigured } = useAuth();

  if (!isConfigured) return <>{children}</>;
  if (loading) return <FullscreenLoader />;
  if (user) return <Navigate to={ROUTES.HOME} replace />;
  return <>{children}</>;
}
