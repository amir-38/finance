import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import { DEFAULT_CATEGORIES } from '@/shared/config/categories';
import i18n from '@/shared/i18n/config';
import type { Category } from '../model/types';

const STORAGE_KEY = 'financeflow:custom-categories';

function loadCustomCategories(): Category[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
}

let customCategories: Category[] = loadCustomCategories();
let initializedUserId: string | null = null;

function persistLocal() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
}

export interface CategoryInput {
  name: string;
  color: string;
}

interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

function mapRowToCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, icon: row.icon, color: row.color };
}

export async function initCustomCategories(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  if (initializedUserId === userId) return;
  initializedUserId = userId;

  const { data, error } = await supabase.from('categories').select('*');
  if (error) return;
  customCategories = (data ?? []).map(mapRowToCategory);
}

export function getAllCategories(): Category[] {
  const defaults = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    name: i18n.t(`categories.${category.id}`),
  }));
  return [...defaults, ...customCategories];
}

export async function addCustomCategory(input: CategoryInput): Promise<Category> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: input.name, color: input.color, icon: 'tag' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const category = mapRowToCategory(data);
    customCategories = [...customCategories, category];
    return category;
  }

  const category: Category = {
    id: `custom-${crypto.randomUUID()}`,
    name: input.name,
    icon: 'tag',
    color: input.color,
  };
  customCategories = [...customCategories, category];
  persistLocal();
  return category;
}
