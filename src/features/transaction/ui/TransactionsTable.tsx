import { MoreHorizontal, Pencil, Receipt, Trash2 } from 'lucide-react';

import { CategoryIcon, getCategoryById } from '@/entities/category';
import type { Transaction } from '@/entities/transaction';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EmptyState } from '@/shared/components/EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { cn, formatDate, formatSignedCurrency } from '@/shared/utils/index';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

function RowActions({ transaction, onEdit, onDelete }: { transaction: Transaction } & Pick<TransactionsTableProps, 'onEdit' | 'onDelete'>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Действия">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2" onClick={() => onEdit(transaction)}>
          <Pencil className="size-4" />
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => onDelete(transaction)}>
          <Trash2 className="size-4" />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Операции не найдены"
        description="Измените фильтры или добавьте новую операцию"
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border/60 md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Операция</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const category = getCategoryById(transaction.categoryId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{transaction.title}</span>
                      {transaction.description && (
                        <span className="text-xs text-muted-foreground">{transaction.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                      <span className="text-sm text-muted-foreground">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(transaction.date, 'd MMM yyyy')}</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold tabular-nums',
                      transaction.type === 'income' ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {formatSignedCurrency(transaction.amount, transaction.type)}
                  </TableCell>
                  <TableCell>
                    <RowActions transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        {transactions.map((transaction) => {
          const category = getCategoryById(transaction.categoryId);
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-3 py-3"
            >
              <CategoryIcon icon={category.icon} color={category.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{transaction.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {category.name} · {formatDate(transaction.date, 'd MMM yyyy')}
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
              <RowActions transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
            </div>
          );
        })}
      </div>
    </>
  );
}
