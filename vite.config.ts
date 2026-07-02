import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          query: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          radix: ['radix-ui', '@radix-ui/react-slot'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          icons: ['lucide-react'],
          dates: ['date-fns'],
        },
      },
    },
  },
});
