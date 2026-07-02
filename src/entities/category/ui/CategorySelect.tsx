import type { ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Category } from '../model/types';
import { CategoryIcon } from './CategoryIcon';

interface CategorySelectProps {
  categories: Category[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  overallOption?: { value: string; label: string };
  extraItem?: ReactNode;
}

export function CategorySelect({ categories, value, onChange, placeholder = 'Выберите категорию', overallOption, extraItem }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {overallOption && (
          <>
            <SelectItem value={overallOption.value}>{overallOption.label}</SelectItem>
            <SelectSeparator />
          </>
        )}
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <span className="flex items-center gap-2">
              <CategoryIcon icon={category.icon} color={category.color} size="sm" />
              {category.name}
            </span>
          </SelectItem>
        ))}
        {extraItem && (
          <>
            <SelectSeparator />
            {extraItem}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
