import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import { initCustomCategories } from '@/entities/category';
import type { AppUser } from '@/entities/user';
import { mapSupabaseUser } from '../api/auth';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  isConfigured: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(mapSupabaseUser(data.session?.user));
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) initCustomCategories(user.id);
  }, [user]);

  return <AuthContext.Provider value={{ user, loading, isConfigured: isSupabaseConfigured }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
