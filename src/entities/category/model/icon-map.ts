import {
  Utensils,
  Bus,
  Car,
  Home,
  Zap,
  Plane,
  Shirt,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Repeat,
  Briefcase,
  TrendingUp,
  Gift,
  MoreHorizontal,
  Wallet,
  Tag,
  type LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  wallet: Wallet,
  tag: Tag,
  utensils: Utensils,
  bus: Bus,
  car: Car,
  home: Home,
  zap: Zap,
  plane: Plane,
  shirt: Shirt,
  'gamepad-2': Gamepad2,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  repeat: Repeat,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  gift: Gift,
  'more-horizontal': MoreHorizontal,
};

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICON_MAP[icon] ?? MoreHorizontal;
}
