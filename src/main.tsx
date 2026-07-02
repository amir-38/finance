import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/app/styles/index.css';

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<PageLoader />}>
      <App />
    </Suspense>
  </StrictMode>,
);
