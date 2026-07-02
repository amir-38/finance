import { TooltipProvider } from '@/shared/components/ui/tooltip';
import type { ReactNode } from 'react';

interface TooltipProviderWrapperProps {
  children: ReactNode;
}

export function TooltipProviderWrapper({ children }: TooltipProviderWrapperProps) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>;
}
