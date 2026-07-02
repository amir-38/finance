import type { ReactElement, ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/index';

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  height?: number;
  className?: string;
  children: ReactElement;
}

export function ChartCard({ title, description, action, height = 280, className, children }: ChartCardProps) {
  return (
    <Card className={cn('glass-card h-full border-0', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
