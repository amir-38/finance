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
  labelKey: 'nav.dashboard' | 'nav.transactions' | 'nav.analytics' | 'nav.budget' | 'nav.goals' | 'nav.settings';
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.dashboard', href: ROUTES.HOME, icon: LayoutDashboard },
  { labelKey: 'nav.transactions', href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { labelKey: 'nav.analytics', href: ROUTES.ANALYTICS, icon: PieChart },
  { labelKey: 'nav.budget', href: ROUTES.BUDGET, icon: Wallet },
  { labelKey: 'nav.goals', href: ROUTES.GOALS, icon: Target },
  { labelKey: 'nav.settings', href: ROUTES.SETTINGS, icon: Settings },
];

export function getPageTitleKey(pathname: string): NavItem['labelKey'] {
  const match = NAV_ITEMS.find(
    (item) => item.href === pathname || (item.href !== ROUTES.HOME && pathname.startsWith(item.href)),
  );
  return match?.labelKey ?? 'nav.dashboard';
}
