export const DEFAULT_CATEGORIES = [
  { id: 'food', icon: 'utensils', color: '#F59E0B' },
  { id: 'transport', icon: 'bus', color: '#3B82F6' },
  { id: 'car', icon: 'car', color: '#6366F1' },
  { id: 'home', icon: 'home', color: '#8B5CF6' },
  { id: 'utilities', icon: 'zap', color: '#EC4899' },
  { id: 'travel', icon: 'plane', color: '#14B8A6' },
  { id: 'clothing', icon: 'shirt', color: '#F97316' },
  { id: 'entertainment', icon: 'gamepad-2', color: '#A855F7' },
  { id: 'education', icon: 'graduation-cap', color: '#0EA5E9' },
  { id: 'health', icon: 'heart-pulse', color: '#EF4444' },
  { id: 'subscriptions', icon: 'repeat', color: '#64748B' },
  { id: 'work', icon: 'briefcase', color: '#10B981' },
  { id: 'investments', icon: 'trending-up', color: '#22C55E' },
  { id: 'gifts', icon: 'gift', color: '#E11D48' },
  { id: 'other', icon: 'more-horizontal', color: '#94A3B8' },
] as const;

export type DefaultCategoryId = (typeof DEFAULT_CATEGORIES)[number]['id'];
