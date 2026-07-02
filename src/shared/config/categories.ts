export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Еда', icon: 'utensils', color: '#F59E0B' },
  { id: 'transport', name: 'Транспорт', icon: 'bus', color: '#3B82F6' },
  { id: 'car', name: 'Автомобиль', icon: 'car', color: '#6366F1' },
  { id: 'home', name: 'Дом', icon: 'home', color: '#8B5CF6' },
  { id: 'utilities', name: 'Коммунальные услуги', icon: 'zap', color: '#EC4899' },
  { id: 'travel', name: 'Путешествия', icon: 'plane', color: '#14B8A6' },
  { id: 'clothing', name: 'Одежда', icon: 'shirt', color: '#F97316' },
  { id: 'entertainment', name: 'Развлечения', icon: 'gamepad-2', color: '#A855F7' },
  { id: 'education', name: 'Образование', icon: 'graduation-cap', color: '#0EA5E9' },
  { id: 'health', name: 'Здоровье', icon: 'heart-pulse', color: '#EF4444' },
  { id: 'subscriptions', name: 'Подписки', icon: 'repeat', color: '#64748B' },
  { id: 'work', name: 'Работа', icon: 'briefcase', color: '#10B981' },
  { id: 'investments', name: 'Инвестиции', icon: 'trending-up', color: '#22C55E' },
  { id: 'gifts', name: 'Подарки', icon: 'gift', color: '#E11D48' },
  { id: 'other', name: 'Другое', icon: 'more-horizontal', color: '#94A3B8' },
] as const;

export type DefaultCategoryId = (typeof DEFAULT_CATEGORIES)[number]['id'];
