import { Wallet, TrendingUp, TrendingDown, PiggyBank, Receipt, CalendarClock, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

import { StatCard } from '@/shared/components/StatCard';
import { formatCurrency } from '@/shared/utils/index';
import { useDashboardStats } from '../model/useDashboardStats';

const miniStatContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const miniStatItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function BalanceOverview() {
  const stats = useDashboardStats();

  const miniStats = [
    { icon: Receipt, label: 'Операций за месяц', value: String(stats.transactionsCount) },
    { icon: CalendarClock, label: 'Средний расход / день', value: formatCurrency(stats.avgExpensePerDay) },
    { icon: Landmark, label: 'Средний доход / мес', value: formatCurrency(stats.avgIncomePerMonth) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Общий баланс" value={formatCurrency(stats.balance)} accent="primary" />
        <StatCard
          icon={TrendingUp}
          label="Доходы за месяц"
          value={formatCurrency(stats.income.current)}
          accent="success"
          trend={{ value: stats.income.changePercent, label: 'за месяц' }}
        />
        <StatCard
          icon={TrendingDown}
          label="Расходы за месяц"
          value={formatCurrency(stats.expense.current)}
          accent="danger"
          trend={{ value: -stats.expense.changePercent, label: 'за месяц' }}
        />
        <StatCard
          icon={PiggyBank}
          label="Сбережения за месяц"
          value={formatCurrency(stats.savings)}
          accent={stats.savings >= 0 ? 'success' : 'danger'}
          trend={{ value: stats.savingsChangePercent, label: 'за месяц' }}
        />
      </div>

      <motion.div
        variants={miniStatContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {miniStats.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            variants={miniStatItem}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{label}</p>
              <p className="truncate text-sm font-semibold text-foreground">{value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
