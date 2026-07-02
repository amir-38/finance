import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { cn } from '@/shared/utils/index';

interface SortableWidgetCardProps {
  id: string;
  children: ReactNode;
}

export function SortableWidgetCard({ id, children }: SortableWidgetCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('group relative', isDragging && 'z-10 opacity-70')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-10 flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Перетащить виджет"
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </div>
  );
}
