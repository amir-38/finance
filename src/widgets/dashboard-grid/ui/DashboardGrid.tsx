import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { cn } from '@/shared/utils/index';
import { useWidgetOrder } from '../model/useWidgetOrder';
import { SortableWidgetCard } from './SortableWidgetCard';

export interface DashboardGridItem {
  id: string;
  content: ReactNode;
}

interface DashboardGridProps {
  items: DashboardGridItem[];
  storageKey?: string;
  className?: string;
}

export function DashboardGrid({ items, storageKey = 'financeflow:dashboard-widget-order', className }: DashboardGridProps) {
  const defaultOrder = items.map((item) => item.id);
  const { order, reorder } = useWidgetOrder(storageKey, defaultOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    reorder(arrayMove(order, oldIndex, newIndex));
  }

  const itemsById = new Map(items.map((item) => [item.id, item.content]));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3', className)}>
          {order.map((id) => (
            <SortableWidgetCard key={id} id={id}>
              {itemsById.get(id)}
            </SortableWidgetCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
