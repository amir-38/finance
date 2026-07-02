import { AuthProvider } from '@/features/auth';
import { Toaster } from '@/shared/components/ui/sonner';
import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { TooltipProviderWrapper } from './TooltipProviderWrapper';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <TooltipProviderWrapper>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </TooltipProviderWrapper>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
