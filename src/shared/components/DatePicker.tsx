import { CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn, formatDate } from '@/shared/utils/index';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder, disabled, className }: DatePickerProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-start gap-2 font-normal', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="size-4" />
          {value ? formatDate(value, 'd MMMM yyyy') : (placeholder ?? t('common.selectDate'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} autoFocus />
      </PopoverContent>
    </Popover>
  );
}
