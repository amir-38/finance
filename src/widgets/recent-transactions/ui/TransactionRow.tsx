import { CategoryIcon, getCategoryById } from '@/entities/category';
import type { Transaction } from '@/entities/transaction';
import { cn, formatDate, formatSignedCurrency } from '@/shared/utils/index';

interface TransactionRowProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionRow({ transaction, className }: TransactionRowProps) {
  const category = getCategoryById(transaction.categoryId);

  return (
    <div className={cn('flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/50', className)}>
      <CategoryIcon icon={category.icon} color={category.color} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{transaction.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {category.name} · {formatDate(transaction.date)}
        </p>
      </div>

      <span
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          transaction.type === 'income' ? 'text-success' : 'text-foreground'
        )}
      >
        {formatSignedCurrency(transaction.amount, transaction.type)}
      </span>
    </div>
  );
}
