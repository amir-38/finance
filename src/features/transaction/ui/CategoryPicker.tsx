import { Plus } from 'lucide-react';

import { CategoryIcon, type Category } from '@/entities/category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface CategoryPickerProps {
  categories: Category[];
  value?: string;
  onChange: (value: string) => void;
  onRequestAddCategory: () => void;
}

export function CategoryPicker({ categories, value, onChange, onRequestAddCategory }: CategoryPickerProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === '__add__') {
          onRequestAddCategory();
          return;
        }
        onChange(next);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <span className="flex items-center gap-2">
              <CategoryIcon icon={category.icon} color={category.color} size="sm" />
              {category.name}
            </span>
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value="__add__">
          <span className="flex items-center gap-2 text-primary">
            <Plus className="size-4" />
            Добавить категорию
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
