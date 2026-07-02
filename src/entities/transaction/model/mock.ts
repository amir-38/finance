import { subDays } from 'date-fns';
import type { Transaction, TransactionType } from './types';

function createRng(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(1337);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const randomInRange = (min: number, max: number) => Math.round(min + rng() * (max - min));

interface Template {
  categoryId: string;
  title: string;
  min: number;
  max: number;
  weight?: number;
}

const EXPENSE_TEMPLATES: Template[] = [
  { categoryId: 'food', title: 'Продукты', min: 800, max: 4500, weight: 4 },
  { categoryId: 'food', title: 'Кафе', min: 400, max: 2200, weight: 3 },
  { categoryId: 'transport', title: 'Такси', min: 250, max: 900, weight: 3 },
  { categoryId: 'transport', title: 'Метро', min: 60, max: 60, weight: 4 },
  { categoryId: 'car', title: 'Бензин', min: 1500, max: 3500, weight: 2 },
  { categoryId: 'travel', title: 'Авиабилеты', min: 8000, max: 15000, weight: 1 },
  { categoryId: 'clothing', title: 'Одежда', min: 1500, max: 6000, weight: 1 },
  { categoryId: 'entertainment', title: 'Кино', min: 500, max: 1800, weight: 3 },
  { categoryId: 'education', title: 'Онлайн-курс', min: 2000, max: 8000, weight: 1 },
  { categoryId: 'health', title: 'Аптека', min: 300, max: 3000, weight: 2 },
  { categoryId: 'gifts', title: 'Подарок', min: 1000, max: 4000, weight: 1 },
  { categoryId: 'other', title: 'Разное', min: 200, max: 1200, weight: 2 },
];

const EXPENSE_POOL: Template[] = EXPENSE_TEMPLATES.flatMap((template) =>
  Array(template.weight ?? 1).fill(template),
);

const RENT_TEMPLATE: Template = { categoryId: 'home', title: 'Аренда квартиры', min: 35000, max: 35000 };
const UTILITIES_TEMPLATE: Template = { categoryId: 'utilities', title: 'Коммунальные платежи', min: 4500, max: 7000 };
const NETFLIX_TEMPLATE: Template = { categoryId: 'subscriptions', title: 'Netflix', min: 599, max: 599 };
const SPOTIFY_TEMPLATE: Template = { categoryId: 'subscriptions', title: 'Spotify', min: 299, max: 299 };

const INCOME_TEMPLATES: Template[] = [
  { categoryId: 'work', title: 'Зарплата', min: 120000, max: 120000 },
  { categoryId: 'work', title: 'Премия', min: 10000, max: 30000 },
  { categoryId: 'investments', title: 'Дивиденды', min: 2000, max: 15000 },
  { categoryId: 'other', title: 'Фриланс-проект', min: 8000, max: 40000 },
];

function buildTransaction(
  index: number,
  date: Date,
  type: TransactionType,
  template: Template,
): Transaction {
  const isoDate = date.toISOString();
  return {
    id: `mock-${index}`,
    type,
    title: template.title,
    amount: randomInRange(template.min, template.max),
    categoryId: template.categoryId,
    date: isoDate,
    userId: 'mock-user',
    createdAt: isoDate,
    updatedAt: isoDate,
  };
}

function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  let index = 0;

  for (let daysAgo = 0; daysAgo < 200; daysAgo++) {
    const date = subDays(today, daysAgo);
    const dayOfMonth = date.getDate();

    if (dayOfMonth === 1) {
      transactions.push(buildTransaction(index++, date, 'income', INCOME_TEMPLATES[0]));
      transactions.push(buildTransaction(index++, date, 'expense', RENT_TEMPLATE));
    }
    if (dayOfMonth === 3) {
      transactions.push(buildTransaction(index++, date, 'expense', UTILITIES_TEMPLATE));
    }
    if (dayOfMonth === 7) {
      transactions.push(buildTransaction(index++, date, 'expense', NETFLIX_TEMPLATE));
      transactions.push(buildTransaction(index++, date, 'expense', SPOTIFY_TEMPLATE));
    }
    if (dayOfMonth === 5 && rng() > 0.4) {
      transactions.push(buildTransaction(index++, date, 'income', pick(INCOME_TEMPLATES.slice(1))));
    }

    const expenseCount = rng() > 0.9 ? 2 : rng() > 0.4 ? 1 : 0;
    for (let i = 0; i < expenseCount; i++) {
      transactions.push(buildTransaction(index++, date, 'expense', pick(EXPENSE_POOL)));
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const MOCK_TRANSACTIONS: Transaction[] = generateMockTransactions();
