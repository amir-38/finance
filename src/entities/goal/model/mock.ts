import { addMonths, subMonths } from 'date-fns';
import type { Goal } from './types';

const now = new Date();

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-emergency',
    title: 'Подушка безопасности',
    icon: 'umbrella',
    color: '#2563EB',
    targetAmount: 300000,
    currentAmount: 187000,
    deadline: addMonths(now, 4).toISOString(),
    createdAt: subMonths(now, 5).toISOString(),
  },
  {
    id: 'goal-travel',
    title: 'Путешествие в Японию',
    icon: 'plane',
    color: '#14B8A6',
    targetAmount: 250000,
    currentAmount: 96000,
    deadline: addMonths(now, 7).toISOString(),
    createdAt: subMonths(now, 2).toISOString(),
  },
  {
    id: 'goal-macbook',
    title: 'Новый ноутбук',
    icon: 'laptop',
    color: '#8B5CF6',
    targetAmount: 180000,
    currentAmount: 162000,
    deadline: addMonths(now, 1).toISOString(),
    createdAt: subMonths(now, 3).toISOString(),
  },
];
