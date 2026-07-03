import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/shared/components/PageHeader';
import { BalanceOverview } from '@/widgets/balance-overview';
import { QuickActions } from '@/widgets/quick-actions';
import { TransactionsCalendar } from '@/widgets/transactions-calendar';
import { DashboardGrid } from '@/widgets/dashboard-grid';
import { RecentTransactions } from '@/widgets/recent-transactions';
import { TopCategories } from '@/widgets/top-categories';
import { BudgetProgress } from '@/widgets/budget-progress';
import { FinancialGoals } from '@/widgets/financial-goals';
import { FinancialScore } from '@/widgets/financial-score';

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard.title')} description={t('dashboard.description')} />

      <BalanceOverview />

      <QuickActions />

      <TransactionsCalendar />

      <DashboardGrid
        items={[
          { id: 'recent-transactions', content: <RecentTransactions /> },
          { id: 'financial-score', content: <FinancialScore /> },
          { id: 'top-categories', content: <TopCategories /> },
          { id: 'budget-progress', content: <BudgetProgress /> },
          { id: 'financial-goals', content: <FinancialGoals /> },
        ]}
      />
    </div>
  );
}
