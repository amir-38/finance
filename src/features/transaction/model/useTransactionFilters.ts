import { useMemo, useState } from 'react';
import { endOfDay, startOfDay } from 'date-fns';

import type { Transaction } from '@/entities/transaction';
import { useDebounce } from '@/shared/hooks';

export type SortField = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';
export type TypeFilter = 'all' | 'income' | 'expense';

export interface TransactionFiltersState {
  search: string;
  type: TypeFilter;
  categoryId: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
}

const DEFAULT_FILTERS: TransactionFiltersState = {
  search: '',
  type: 'all',
  categoryId: 'all',
  dateFrom: undefined,
  dateTo: undefined,
  sortBy: 'date',
  sortDir: 'desc',
  page: 1,
  pageSize: 10,
};

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFiltersState] = useState<TransactionFiltersState>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 300);

  function setFilters(patch: Partial<TransactionFiltersState>) {
    setFiltersState((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  }

  function resetFilters() {
    setFiltersState(DEFAULT_FILTERS);
  }

  const filtered = useMemo(() => {
    let result = transactions;

    const query = debouncedSearch.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(query) ||
          tx.description?.toLowerCase().includes(query) ||
          tx.comment?.toLowerCase().includes(query)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    if (filters.categoryId !== 'all') {
      result = result.filter((tx) => tx.categoryId === filters.categoryId);
    }

    if (filters.dateFrom) {
      const from = startOfDay(filters.dateFrom);
      result = result.filter((tx) => new Date(tx.date) >= from);
    }

    if (filters.dateTo) {
      const to = endOfDay(filters.dateTo);
      result = result.filter((tx) => new Date(tx.date) <= to);
    }

    const dir = filters.sortDir === 'asc' ? 1 : -1;
    return [...result].sort((a, b) => {
      if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });
  }, [transactions, debouncedSearch, filters.type, filters.categoryId, filters.dateFrom, filters.dateTo, filters.sortBy, filters.sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / filters.pageSize));
  const currentPage = Math.min(filters.page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * filters.pageSize, currentPage * filters.pageSize);

  return {
    filters: { ...filters, page: currentPage },
    setFilters,
    resetFilters,
    total: filtered.length,
    pageCount,
    pageItems,
  };
}
