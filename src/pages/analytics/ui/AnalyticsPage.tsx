import {
  BalanceHistoryAreaChart,
  BudgetDistributionDonutChart,
  CashFlowLineChart,
  ExpensesByCategoryPieChart,
  IncomeExpenseLineChart,
  IncomeSourcesPieChart,
  MonthlyComparisonChart,
  MonthlySpendingBarChart,
  SavingsGrowthAreaChart,
  TransactionsTimeline,
  WeeklyExpensesBarChart,
} from '@/widgets/analytics-charts';
import { BudgetProgress } from '@/widgets/budget-progress';
import { FinancialScore } from '@/widgets/financial-score';
import { TopCategories } from '@/widgets/top-categories';
import { TransactionsCalendar } from '@/widgets/transactions-calendar';
import { PageHeader } from '@/shared/components/PageHeader';

function SectionLabel({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{children}</h2>;
}

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Аналитика" description="Полная картина ваших финансов в графиках" />

      <div className="space-y-4">
        <SectionLabel>Обзор</SectionLabel>
        <IncomeExpenseLineChart />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BalanceHistoryAreaChart />
          <CashFlowLineChart />
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>Категории и источники</SectionLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ExpensesByCategoryPieChart />
          <IncomeSourcesPieChart />
          <BudgetDistributionDonutChart />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <TopCategories />
          <BudgetProgress />
          <FinancialScore />
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>Тренды</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MonthlySpendingBarChart />
          <WeeklyExpensesBarChart />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MonthlyComparisonChart />
          <SavingsGrowthAreaChart />
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>История</SectionLabel>
        <TransactionsCalendar />
        <TransactionsTimeline />
      </div>
    </div>
  );
}
