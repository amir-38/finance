import { useState } from 'react';
import { Plus } from 'lucide-react';

import { AddCategoryDialog } from '@/features/category';
import {
  DeleteTransactionDialog,
  TransactionFilters,
  TransactionFormDialog,
  TransactionsPagination,
  TransactionsTable,
  useTransactionFilters,
} from '@/features/transaction';
import { getAllCategories, type Category } from '@/entities/category';
import { useTransactionsQuery, type Transaction } from '@/entities/transaction';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ErrorState } from '@/shared/components/ErrorState';
import { PageHeader } from '@/shared/components/PageHeader';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function TransactionsPage() {
  const { data: transactions = [], isLoading, isError, refetch } = useTransactionsQuery();
  const { filters, setFilters, resetFilters, total, pageCount, pageItems } = useTransactionFilters(transactions);

  const [categories, setCategories] = useState<Category[]>(() => getAllCategories());
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  function handleAddClick() {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  }

  function handleEditClick(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Операции"
        description="Все ваши доходы и расходы в одном месте"
        actions={
          <Button className="gap-2" onClick={handleAddClick}>
            <Plus className="size-4" />
            Добавить операцию
          </Button>
        }
      />

      <Card className="glass-card border-0">
        <CardContent className="space-y-4">
          <TransactionFilters categories={categories} filters={filters} onChange={setFilters} onReset={resetFilters} />

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              <TransactionsTable transactions={pageItems} onEdit={handleEditClick} onDelete={setDeletingTransaction} />
              <TransactionsPagination
                page={filters.page}
                pageCount={pageCount}
                pageSize={filters.pageSize}
                total={total}
                onPageChange={(page) => setFilters({ page })}
                onPageSizeChange={(pageSize) => setFilters({ pageSize })}
              />
            </>
          )}
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editingTransaction}
        categories={categories}
        onRequestAddCategory={() => setIsAddCategoryOpen(true)}
      />

      <DeleteTransactionDialog
        transaction={deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
      />

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onCreated={(category) => setCategories((prev) => [...prev, category])}
      />
    </div>
  );
}
