import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Target,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Дашборд', href: ROUTES.HOME, icon: LayoutDashboard },
  { label: 'Операции', href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { label: 'Аналитика', href: ROUTES.ANALYTICS, icon: PieChart },
  { label: 'Бюджет', href: ROUTES.BUDGET, icon: Wallet },
  { label: 'Цели', href: ROUTES.GOALS, icon: Target },
  { label: 'Настройки', href: ROUTES.SETTINGS, icon: Settings },
];

export function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find(
    (item) => item.href === pathname || (item.href !== ROUTES.HOME && pathname.startsWith(item.href)),
  );
  return match?.label ?? 'Дашборд';
}
