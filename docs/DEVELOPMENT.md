# История разработки

Технический журнал по этапам разработки: что и как было реализовано, найденные баги и архитектурные решения. Для общего описания проекта, установки и запуска см. [README.md](../README.md).

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| State & Data | TanStack Query, React Hook Form, Zod |
| UI & Animation | Framer Motion, Lucide Icons, Recharts |
| Routing | React Router |
| Backend | Supabase, PostgreSQL |
| Auth | Google OAuth, Email/Password |

## Архитектура

Проект построен на **Feature-Sliced Design (FSD)**.

```
src/
├── app/          # Инициализация, провайдеры, роутинг, глобальные стили
├── pages/        # Страницы приложения (композиция widgets + features)
├── widgets/      # Самостоятельные блоки UI (Dashboard-карточки)
├── features/     # Пользовательские сценарии (действия, формы)
├── entities/     # Бизнес-сущности (transaction, category, budget, goal)
└── shared/       # Переиспользуемый код (UI kit, hooks, utils, types)
```

Подробнее: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## UI Kit (Этап 3)

Базовые примитивы на `radix-ui` + `class-variance-authority` в стиле shadcn/ui (`new-york`), лежат в `src/shared/components/ui/`:

`Button`, `Card`, `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Progress`, `Separator`, `Avatar`, `Badge` (+ `success`/`warning`/`danger` варианты), `Tabs`, `Dialog`, `AlertDialog`, `DropdownMenu`, `Popover`, `Sheet`, `Table`, `Calendar`, `Form`, `ScrollArea`, `Tooltip`, `Skeleton`, `Sonner` (toast), `Spinner`.

Составные паттерны в `src/shared/components/`: `StatCard`, `PageHeader`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `PlaceholderPage`.

Плюс `ThemeToggle` (`src/features/theme`) и хуки `useMediaQuery` / `useDebounce` (`src/shared/hooks`).

Все компоненты используют дизайн-токены из `src/app/styles/index.css` (glass, gradient, radius, тени) и поддерживают light/dark через `next-themes`.

## Layout (Этап 4)

`src/shared/layouts/`:

- `AppLayout` — рабочая область: сворачиваемый `Sidebar` (desktop, анимация ширины через Framer Motion), `Topbar` (заголовок страницы, поиск, кнопка «Добавить», `ThemeToggle`), контент с переходами между страницами. `UserMenu` (`features/auth`) внедряется через проп `userMenu`, а не импортируется напрямую — `shared` не должен зависеть от `features`.
- `AuthLayout` — split-screen для `/auth/*`: брендовая панель с градиентом и преимуществами продукта на десктопе, центрированная форма на мобильных.
- `ui/Sidebar`, `ui/MobileNav` (Sheet-драйвер для мобильного меню), `ui/Topbar` — внутренние блоки layout'а.

Роутинг перестроен на вложенные layout-роуты: страницы дашборда рендерятся внутри `AppLayout` через `<Outlet />`, страницы авторизации — внутри `AuthLayout`.

Список навигации и заголовки страниц — `src/shared/config/navigation.ts`.

## Dashboard (Этап 5)

Данные — детерминированный генератор в `entities/transaction/model/mock.ts` (~200 дней истории, расширено на Этапе 8 под месячную аналитику), с Этапа 7 доступны через реактивный `useTransactionsQuery()` (TanStack Query поверх localStorage) — реальные запросы к Supabase появятся на Этапе 9 с той же формой данных, без изменений в компонентах.

Сущности: `entities/category` (иконки + цвета), `entities/budget`, `entities/goal` — типы и mock-данные, без бизнес-логики, объединяющей несколько сущностей (это делают виджеты, чтобы не нарушать правило FSD «слайсы одного слоя не импортируют друг друга»).

Виджеты `src/widgets/`:

- `balance-overview` — баланс, доходы/расходы/сбережения за месяц с трендом, мини-статистика (операции, средний расход/доход).
- `quick-actions` — быстрые действия (доход, расход, бюджет, цель).
- `transactions-calendar` — календарь-heatmap расходов по дням с навигацией по месяцам.
- `recent-transactions`, `top-categories`, `budget-progress`, `financial-goals`, `financial-score` (радиальный график Recharts) — собраны в `dashboard-grid`, универсальный drag & drop контейнер на `@dnd-kit` с сохранением порядка в `localStorage`. Сам `dashboard-grid` не знает о конкретных виджетах — их передаёт `DashboardPage`.

## Этапы разработки

- [x] **Этап 1** — Структура проекта
- [x] **Этап 2** — Настройка стека
- [x] **Этап 3** — UI Kit
- [x] **Этап 4** — Layout
- [x] **Этап 5** — Dashboard
- [x] **Этап 6** — Авторизация
- [x] **Этап 7** — Транзакции
- [x] **Этап 8** — Аналитика
- [x] **Этап 9** — Supabase
- [ ] **Этап 10** — Оптимизация

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

### Переменные окружения

Скопируйте `.env.example` в `.env` и заполните ключи Supabase (Этап 9):

```bash
cp .env.example .env
```

## Авторизация (Этап 6)

`features/auth` — полноценный клиент Supabase Auth (`api/auth.ts`): email/пароль, Google OAuth, восстановление пароля, смена пароля, обновление профиля. Клиент `shared/services/supabase.ts` уже был подготовлен nullable-обёрткой (`isSupabaseConfigured`), поэтому вся логика написана против реального API и заработает сразу после того, как на Этапе 9 будут добавлены ключи в `.env` — сейчас, без ключей, приложение работает в демо-режиме: гварды (`app/router/guards.tsx`) не блокируют доступ, формы показывают понятную ошибку вместо падения.

- `AuthProvider` / `useAuth()` — сессия пользователя через `supabase.auth.onAuthStateChange`, обёрнут вокруг всего приложения в `AppProviders`.
- Формы (React Hook Form + Zod): `LoginForm`, `RegisterForm`, `RequestResetForm`, `NewPasswordForm`, `ChangePasswordForm`, `ProfileForm` — с валидацией, состояниями загрузки и toast-уведомлениями.
- `pages/auth/*` — Вход, Регистрация, Восстановление пароля (страница сама определяет режим «запросить ссылку» / «задать новый пароль» через `useIsPasswordRecovery`).
- `pages/settings` — вкладки Профиль / Безопасность / Внешний вид.
- `UserMenu` — реальные имя/email/инициалы, выход из аккаунта; внедряется в `AppLayout` через пропсы (не импортируется напрямую из `shared`, чтобы не нарушать правило FSD «shared не знает про features»).
- `RequireAuth` / `GuestOnly` (`app/router/guards.tsx`) — защита роутов, работает только когда Supabase сконфигурирован.

## Транзакции (Этап 7)

Слой данных — реактивный CRUD поверх localStorage, готовый к замене на Supabase без изменений в компонентах:

- `entities/transaction/api/store.ts` — локальное «API» (create/update/delete), персистентно в `localStorage`.
- `entities/transaction/api/queries.ts` — `useTransactionsQuery()` + мутации (`useCreate…`, `useUpdate…`, `useDeleteTransactionMutation`) на TanStack Query; любая мутация инвалидирует общий ключ кэша, поэтому Dashboard (Этап 5) и страница операций всегда синхронизированы.
- `entities/category/api/store.ts` — пользовательские категории поверх предустановленных (`localStorage`), `getCategoryById` всегда читает объединённый список.

`features/transaction`:

- `TransactionFormDialog` — добавление/редактирование (React Hook Form + Zod): тип, название, сумма, категория, дата (`DatePicker` на Popover+Calendar), описание, комментарий.
- `DeleteTransactionDialog` — подтверждение удаления через `ConfirmDialog`.
- `TransactionFilters` — поиск (с debounce), фильтр по типу/категории/периоду, сортировка по дате/сумме.
- `TransactionsTable` — таблица на десктопе, карточки на мобильных, меню действий.
- `TransactionsPagination` — пагинация с выбором размера страницы.
- `CategoryPicker` — выбор категории с пунктом «Добавить категорию» (открывает `AddCategoryDialog` из `features/category`, композиция происходит на уровне `TransactionsPage`, чтобы не нарушать правило FSD о запрете кросс-импортов внутри слоя `features`).

`features/category` — `AddCategoryDialog`: создание своей категории (название + цвет).

## Бюджет и цели (страницы `/budget`, `/goals`)

Виджеты `BudgetProgress`/`FinancialGoals` (Этап 5) изначально показывали только чтение мок-данных — страницы управления не были собраны. Добавлены по образцу транзакций (Этап 7): реактивный CRUD на TanStack Query поверх `localStorage`, полностью синхронный с дашбордом и аналитикой.

- `entities/budget/api`, `entities/goal/api` — `store.ts` (create/update/delete в localStorage) + `queries.ts` (`useBudgetsQuery`/`useGoalsQuery` и мутации); `useBudgetUsage` (`features/budget`) и виджет `FinancialGoals` переведены на эти хуки вместо статичных `MOCK_*`.
- `entities/category/ui/CategorySelect.tsx` — общий пресентационный селект категорий, вынесен в сущность, чтобы `features/budget` и `features/transaction` могли использовать выбор категории, не импортируя друг друга (правило FSD про запрет кросс-фич-импортов).
- `features/budget`: `BudgetFormDialog` (категория или «Общий бюджет» + лимit, с защитой от дублирования бюджета по категории), `DeleteBudgetDialog`.
- `features/goal`: `GoalFormDialog` (название, сумма, срок через `DatePicker`, выбор иконки/цвета), `DeleteGoalDialog`, `AddFundsDialog` — быстрое пополнение цели.
- `pages/budget`, `pages/goals` — карточки с прогрессом, предупреждениями о превышении лимита, действиями редактирования/удаления/пополнения, пустые состояния.

## Аналитика (Этап 8)

15 интерактивных графиков (список зафиксирован в `widgets/analytics-charts/index.ts` → `ANALYTICS_CHARTS`). 11 новых построены на Recharts в `widgets/analytics-charts/ui/`, 4 переиспользуют готовые виджеты со Стадии 5 (`FinancialScore`, `BudgetProgress`, `TopCategories`, `TransactionsCalendar`) — композицию собирает `AnalyticsPage`, чтобы не нарушать запрет на кросс-импорты внутри слоя `widgets`.

- `ChartCard` / `ChartTooltipContent` — общая обёртка (Card + `ResponsiveContainer`) и кастомный tooltip с точным форматированием валюты, переиспользуются всеми графиками.
- Line/Area/Bar: `IncomeExpenseLineChart`, `BalanceHistoryAreaChart`, `CashFlowLineChart`, `MonthlySpendingBarChart`, `WeeklyExpensesBarChart`, `MonthlyComparisonChart`, `SavingsGrowthAreaChart`.
- Pie/Donut: `ExpensesByCategoryPieChart` (скользящее окно 30 дней — иначе в начале месяца донат выглядит однотонным из-за нехватки данных), `IncomeSourcesPieChart`, `BudgetDistributionDonutChart`.
- `TransactionsTimeline` — вертикальная хронология последних операций (Framer Motion, не Recharts).
- Новые селекторы в `entities/transaction/model/selectors.ts`: `getMonthlyBuckets`, `getWeeklyExpenses`, `getBalanceHistory`.
- Мок-данные расширены до ~200 дней истории (было 90) — для месячных графиков и сравнения нужно больше точек.

## Supabase (Этап 9)

Все 4 CRUD-стора (`entities/transaction`, `entities/budget`, `entities/goal`, `entities/category`) переведены в **двухрежимный** вариант: реальные запросы к Supabase, если он настроен, иначе — прежний локальный fallback на `localStorage` (демо-режим со Стадии 7). Публичный API (`fetch*`/`create*`/`update*`/`delete*` и хуки `use*Query`/`use*Mutation`) не менялся — переключение происходит внутри `api/store.ts` каждой сущности по флагу `isSupabaseConfigured`, компоненты ничего не знают о режиме.

### Подключение

1. Создайте проект на [supabase.com](https://supabase.com).
2. Откройте **SQL Editor** и выполните весь файл [`supabase/schema.sql`](./supabase/schema.sql) — создаст таблицы `transactions`, `budgets`, `goals`, `categories` с Row Level Security (каждый пользователь видит и меняет только свои строки, `auth.uid() = user_id`).
3. В **Settings → API** включите провайдер **Google** (для OAuth со Стадии 6), если нужен вход через Google.
4. Скопируйте `Project URL` и `anon public key` в `.env` (см. `.env.example`) и перезапустите `npm run dev`.

После этого:
- `RequireAuth`/`GuestOnly` (Этап 6) начинают реально защищать роуты — без входа пользователь попадёт на `/auth/login`.
- Дашборд стартует **пустым** для нового аккаунта — это ожидаемо, мок-данные были локальной заглушкой, а не сид-данными в реальной БД.
- Пользовательские категории (`AddCategoryDialog`) сохраняются в таблицу `categories`; кэш прогревается один раз при входе (`initCustomCategories` в `AuthContext`), поэтому `getCategoryById`/`getAllCategories` остаются синхронными и не потребовали переписывать вызывающий код.

### Типизация

`shared/services/database.types.ts` — вручную описанный тип `Database`, передаётся в `createClient<Database>(...)` (`shared/services/supabase.ts`) для типобезопасных `.from(...).select()/.insert()/.update()`.

**Обнаруженная особенность TypeScript:** поля строк таблиц обязательно нужно описывать через `type`, а не `interface` — с `interface` цепочка условных типов в `@supabase/postgrest-js` (вывод `Schema` из `Database[SchemaName]`) не резолвится и молча деградирует до `never`, из-за чего `.insert()/.update()` перестают принимать реальные объекты (принимают только `never[]`). Обнаружено и подтверждено при сборке — если будете генерировать типы через `supabase gen types typescript`, они по умолчанию используют `type`, так что проблема актуальна только при ручном описании схемы.

## Цветовая схема

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Success | `#10B981` |
| Danger | `#EF4444` |
| Warning | `#F59E0B` |
| Background | `#0F172A` |
| Cards | `#111827` |
| Text | `#F8FAFC` |
