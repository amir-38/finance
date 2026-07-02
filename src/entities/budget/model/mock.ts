import { format } from 'date-fns';
import type { Budget } from './types';

const currentMonth = format(new Date(), 'yyyy-MM');

export const MOCK_BUDGETS: Budget[] = [
  { id: 'budget-overall', categoryId: null, limit: 150000, month: currentMonth },
  { id: 'budget-food', categoryId: 'food', limit: 35000, month: currentMonth },
  { id: 'budget-transport', categoryId: 'transport', limit: 8000, month: currentMonth },
  { id: 'budget-entertainment', categoryId: 'entertainment', limit: 6000, month: currentMonth },
  { id: 'budget-subscriptions', categoryId: 'subscriptions', limit: 1500, month: currentMonth },
];
