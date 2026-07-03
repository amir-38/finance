import { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { az, ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useTransactionsQuery } from '@/entities/transaction';
import { Button } from '@/shared/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn, formatCurrency } from '@/shared/utils/index';

const DATE_LOCALES = { az, ru };

function getDateLocale(language: string) {
  return DATE_LOCALES[language as keyof typeof DATE_LOCALES] ?? az;
}

function intensityClass(ratio: number): string {
  if (ratio <= 0) return 'bg-muted/40';
  if (ratio < 0.25) return 'bg-primary/20';
  if (ratio < 0.5) return 'bg-primary/40';
  if (ratio < 0.75) return 'bg-primary/70';
  return 'bg-primary';
}

export function TransactionsCalendar() {
  const { t, i18n } = useTranslation();
  const [month, setMonth] = useState(() => new Date());
  const { data: transactions = [] } = useTransactionsQuery();
  const dateLocale = getDateLocale(i18n.language);

  const WEEKDAYS = [
    t('dashboard.weekdayMon'),
    t('dashboard.weekdayTue'),
    t('dashboard.weekdayWed'),
    t('dashboard.weekdayThu'),
    t('dashboard.weekdayFri'),
    t('dashboard.weekdaySat'),
    t('dashboard.weekdaySun'),
  ];

  const { days, maxTotal, totalsByDay } = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start, end });

    const totals = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue;
      const key = format(new Date(tx.date), 'yyyy-MM-dd');
      totals.set(key, (totals.get(key) ?? 0) + tx.amount);
    }

    const max = Math.max(1, ...allDays.map((d) => totals.get(format(d, 'yyyy-MM-dd')) ?? 0));

    return { days: allDays, maxTotal: max, totalsByDay: totals };
  }, [month, transactions]);

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle>{t('dashboard.calendarTitle')}</CardTitle>
        <CardAction className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label={t('dashboard.prevMonth')}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-28 text-center text-sm font-medium capitalize text-foreground">
            {format(month, 'LLLL yyyy', { locale: dateLocale })}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label={t('dashboard.nextMonth')}>
            <ChevronRight className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((day) => (
            <span key={day} className="pb-1 text-center text-xs font-medium text-muted-foreground">
              {day}
            </span>
          ))}

          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const total = totalsByDay.get(key) ?? 0;
            const ratio = total / maxTotal;
            const inMonth = isSameMonth(day, month);

            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-transform hover:scale-105',
                      inMonth ? intensityClass(ratio) : 'bg-transparent text-muted-foreground/30',
                      inMonth && ratio >= 0.5 ? 'text-white' : 'text-foreground',
                      isToday(day) && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                </TooltipTrigger>
                {inMonth && (
                  <TooltipContent>
                    {format(day, 'd MMMM', { locale: dateLocale })}: {total > 0 ? formatCurrency(total) : t('dashboard.noExpenses')}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
