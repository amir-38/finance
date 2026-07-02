import { formatCurrency } from '@/shared/utils/index';

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  valueFormatter?: (value: number) => string;
}

export function ChartTooltipContent({ active, payload, label, valueFormatter = formatCurrency }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 shadow-lg">
      {label && <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center gap-2 text-xs">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {typeof item.value === 'number' ? valueFormatter(item.value) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
