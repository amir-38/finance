import { useEffect, useState } from 'react';

function loadOrder(storageKey: string, defaultOrder: string[]): string[] {
  if (typeof window === 'undefined') return defaultOrder;
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    const defaultSet = new Set(defaultOrder);
    if (
      Array.isArray(stored) &&
      stored.length === defaultOrder.length &&
      stored.every((id): id is string => typeof id === 'string' && defaultSet.has(id))
    ) {
      return stored;
    }
  } catch {
    return defaultOrder;
  }
  return defaultOrder;
}

export function useWidgetOrder(storageKey: string, defaultOrder: string[]) {
  const [order, setOrder] = useState(defaultOrder);

  useEffect(() => {
    setOrder(loadOrder(storageKey, defaultOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function reorder(next: string[]) {
    setOrder(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  return { order, reorder };
}
