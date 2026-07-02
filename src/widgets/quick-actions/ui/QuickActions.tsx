import { Link } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle, Target, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/utils/index';

const ACTIONS = [
  { label: 'Добавить доход', icon: ArrowUpCircle, href: ROUTES.TRANSACTIONS, accent: 'text-success bg-success/10' },
  { label: 'Добавить расход', icon: ArrowDownCircle, href: ROUTES.TRANSACTIONS, accent: 'text-destructive bg-destructive/10' },
  { label: 'Новый бюджет', icon: Wallet, href: ROUTES.BUDGET, accent: 'text-primary bg-primary/10' },
  { label: 'Новая цель', icon: Target, href: ROUTES.GOALS, accent: 'text-warning bg-warning/10' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function QuickActions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {ACTIONS.map(({ label, icon: Icon, href, accent }) => (
        <motion.div key={label} variants={item} whileHover={{ y: -2 }}>
          <Link
            to={href}
            className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/50 px-4 py-5 text-center transition-colors hover:border-primary/40 hover:bg-accent/50"
          >
            <span className={cn('flex size-10 items-center justify-center rounded-xl', accent)}>
              <Icon className="size-5" />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
