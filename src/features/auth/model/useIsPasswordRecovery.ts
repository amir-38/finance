import { useEffect, useState } from 'react';
import { supabase } from '@/shared/services/supabase';

export function useIsPasswordRecovery() {
  const [isRecovery, setIsRecovery] = useState(() => window.location.hash.includes('type=recovery'));

  useEffect(() => {
    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return isRecovery;
}
