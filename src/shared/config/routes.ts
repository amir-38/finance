export const ROUTES = {
  HOME: '/',
  TRANSACTIONS: '/transactions',
  ANALYTICS: '/analytics',
  BUDGET: '/budget',
  GOALS: '/goals',
  SETTINGS: '/settings',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
  },
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
