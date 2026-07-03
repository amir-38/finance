import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { addCustomCategory, type Category } from '@/entities/category';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { cn } from '@/shared/utils/index';
import { categorySchema, type CategoryFormValues } from '../model/schemas';

const COLOR_PALETTE = [
  '#2563EB',
  '#10B981',
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#64748B',
  '#22C55E',
];

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (category: Category) => void;
}

export function AddCategoryDialog({ open, onOpenChange, onCreated }: AddCategoryDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema()),
    defaultValues: { name: '', color: COLOR_PALETTE[0] },
  });

  async function onSubmit(values: CategoryFormValues) {
    setLoading(true);
    try {
      const category = await addCustomCategory(values);
      toast.success(t('category.categoryAdded'));
      onCreated(category);
      form.reset({ name: '', color: COLOR_PALETTE[0] });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('category.categoryAddFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('category.newCategoryTitle')}</DialogTitle>
          <DialogDescription>{t('category.newCategoryDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('category.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category.colorLabel')}</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={cn(
                            'size-8 rounded-full border-2 transition-transform hover:scale-110',
                            field.value === color ? 'border-foreground' : 'border-transparent'
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
