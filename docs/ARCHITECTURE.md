# Архитектура FinanceFlow

## Feature-Sliced Design

FSD делит код на слои от общего к частному. Импорты разрешены только **сверху вниз**:

```
app → pages → widgets → features → entities → shared
```

### Слои

#### `app/`
Точка входа приложения: провайдеры (Query, Theme, Auth), роутер, глобальные стили.

#### `pages/`
Страницы — композиция widgets и features. Одна страница = один маршрут.

| Страница | Маршрут |
|----------|---------|
| Dashboard | `/` |
| Transactions | `/transactions` |
| Analytics | `/analytics` |
| Budget | `/budget` |
| Goals | `/goals` |
| Settings | `/settings` |
| Auth (Login/Register/Reset) | `/auth/*` |

#### `widgets/`
Крупные самостоятельные блоки Dashboard без бизнес-логики:

- `balance-overview` — общий баланс, доходы, расходы
- `recent-transactions` — последние операции
- `budget-progress` — прогресс бюджета
- `financial-goals` — финансовые цели
- `top-categories` — топ категорий
- `financial-score` — финансовый рейтинг
- `quick-actions` — быстрые действия
- `transactions-calendar` — календарь операций
- `dashboard-grid` — drag & drop сетка виджетов
- `analytics-charts` — 15 графиков аналитики (Recharts)

#### `features/`
Пользовательские сценарии и интерактивные действия:

| Feature | Описание |
|---------|----------|
| `auth` | Вход, регистрация, Google OAuth, восстановление пароля |
| `transaction` | CRUD операций, фильтры, поиск, пагинация |
| `category` | Управление категориями |
| `budget` | Создание бюджета, лимиты, предупреждения |
| `goal` | Финансовые цели |
| `export` | Экспорт CSV / Excel / PDF *(не реализовано)* |
| `import` | Импорт CSV / банковской выписки *(не реализовано)* |
| `search` | Глобальный поиск *(не реализовано)* |
| `theme` | Light / Dark / Auto |

#### `entities/`
Бизнес-сущности с типами, API и UI-примитивами:

| Entity | Содержимое |
|--------|------------|
| `transaction` | Тип, модель, API, карточка операции |
| `category` | Категории (еда, транспорт, …) |
| `budget` | Бюджет по категориям / месяцам |
| `goal` | Финансовая цель с прогрессом |
| `user` | Профиль пользователя |

#### `shared/`
Переиспользуемый код без привязки к бизнес-логике:

```
shared/
├── components/   # UI Kit (Button, Card, Dialog, …)
├── layouts/      # AppLayout, AuthLayout, Sidebar
├── hooks/        # useMediaQuery, useDebounce, …
├── services/     # Supabase client, export service
├── types/        # Общие TypeScript типы
├── utils/        # formatCurrency, formatDate, cn()
├── assets/       # Иконки, изображения
├── styles/       # Глобальные CSS, Tailwind tokens
└── config/       # Константы, env, routes
```

### Структура слайса

Каждый слайс (feature / entity / widget) следует единой структуре:

```
feature-name/
├── ui/           # React-компоненты
├── model/        # Store, hooks, бизнес-логика
├── api/          # Запросы к Supabase
├── lib/          # Вспомогательные функции
└── index.ts      # Public API слайса
```

### Правила импорта

1. Слой может импортировать только из слоёв **ниже** себя.
2. Слайсы одного слоя **не импортируют** друг друга.
3. Public API — только через `index.ts` слайса.
4. `shared` не импортирует ничего из `app`, `pages`, `widgets`, `features`, `entities`.

### Маршрутизация

```
/                     → DashboardPage
/transactions         → TransactionsPage
/analytics            → AnalyticsPage
/budget               → BudgetPage
/goals                → GoalsPage
/settings             → SettingsPage
/auth/login           → LoginPage
/auth/register        → RegisterPage
/auth/reset-password  → ResetPasswordPage
```
