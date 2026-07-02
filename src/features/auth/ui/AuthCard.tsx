import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
