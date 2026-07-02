import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search, X } from 'lucide-react';

import type { Category } from '@/entities/category';
import { Button } from '@/shared/components/ui/button';
import { DatePicker } from '@/shared/components/DatePicker';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import type { TransactionFiltersState } from '../model/useTransactionFilters';

interface TransactionFiltersProps {
  categories: Category[];
  filters: TransactionFiltersState;
  onChange: (patch: Partial<TransactionFiltersState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { value: 'date', label: 'По дате' },
  { value: 'amount', label: 'По сумме' },
] as const;

export function TransactionFilters({ categories, filters, onChange, onReset }: TransactionFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.categoryId !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Поиск по названию, описанию, комментарию…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.type} onValueChange={(value) => onChange({ type: value as TransactionFiltersState['type'] })}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="income">Доходы</SelectItem>
            <SelectItem value="expense">Расходы</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.categoryId} onValueChange={(value) => onChange({ categoryId: value })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Все категории" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker
          value={filters.dateFrom}
          onChange={(date) => onChange({ dateFrom: date })}
          placeholder="Дата от"
          className="w-36"
        />
        <DatePicker
          value={filters.dateTo}
          onChange={(date) => onChange({ dateTo: date })}
          placeholder="Дата до"
          className="w-36"
        />

        <Select value={filters.sortBy} onValueChange={(value) => onChange({ sortBy: value as TransactionFiltersState['sortBy'] })}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
          aria-label="Направление сортировки"
        >
          {filters.sortDir === 'asc' ? <ArrowUpWideNarrow className="size-4" /> : <ArrowDownWideNarrow className="size-4" />}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset} className="gap-1.5 text-muted-foreground">
            <X className="size-3.5" />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
}
