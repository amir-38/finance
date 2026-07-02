import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/shared/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface TransactionsPaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function TransactionsPagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TransactionsPaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Показывать по</span>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          · Всего {total} {total === 1 ? 'операция' : 'операций'}
        </span>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-disabled={page <= 1}
              className={page <= 1 ? 'pointer-events-none opacity-40' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              size="default"
            >
              Назад
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <span className="px-3 text-sm text-muted-foreground">
              {page} из {pageCount}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-disabled={page >= pageCount}
              className={page >= pageCount ? 'pointer-events-none opacity-40' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (page < pageCount) onPageChange(page + 1);
              }}
              size="default"
            >
              Вперёд
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
