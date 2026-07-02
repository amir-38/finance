import { getAllCategories } from '../api/store';
import type { Category } from './types';

export function getCategoryById(id: string): Category {
  const all = getAllCategories();
  return all.find((category) => category.id === id) ?? all[all.length - 1];
}
