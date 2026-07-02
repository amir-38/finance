import { Car, GraduationCap, Home, Laptop, PiggyBank, Plane, Smartphone, Umbrella, type LucideIcon } from 'lucide-react';

export const GOAL_ICON_MAP: Record<string, LucideIcon> = {
  'piggy-bank': PiggyBank,
  laptop: Laptop,
  plane: Plane,
  home: Home,
  car: Car,
  umbrella: Umbrella,
  'graduation-cap': GraduationCap,
  smartphone: Smartphone,
};

export function getGoalIcon(icon: string): LucideIcon {
  return GOAL_ICON_MAP[icon] ?? PiggyBank;
}
