import { UserMenu } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';
import { AppLayout, AuthLayout } from '@/shared/layouts';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GuestOnly, RequireAuth } from './guards';

const DashboardPage = lazy(() =>
  import('@/pages/dashboard/ui/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const TransactionsPage = lazy(() =>
  import('@/pages/transactions/ui/TransactionsPage').then((m) => ({ default: m.TransactionsPage })),
);
const AnalyticsPage = lazy(() =>
  import('@/pages/analytics/ui/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
);
const BudgetPage = lazy(() =>
  import('@/pages/budget/ui/BudgetPage').then((m) => ({ default: m.BudgetPage })),
);
const GoalsPage = lazy(() =>
  import('@/pages/goals/ui/GoalsPage').then((m) => ({ default: m.GoalsPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/settings/ui/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth/ui/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth/ui/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ui/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);

export const router = createBrowserRouter([
  {
    element: (
      <RequireAuth>
        <AppLayout userMenu={<UserMenu />} />
      </RequireAuth>
    ),
    children: [
      { path: ROUTES.HOME, element: <DashboardPage /> },
      { path: ROUTES.TRANSACTIONS, element: <TransactionsPage /> },
      { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
      { path: ROUTES.BUDGET, element: <BudgetPage /> },
      { path: ROUTES.GOALS, element: <GoalsPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
    ],
  },
  {
    element: (
      <GuestOnly>
        <AuthLayout />
      </GuestOnly>
    ),
    children: [
      { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
      { path: ROUTES.AUTH.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
