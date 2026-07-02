import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { signInWithGoogle } from '../api/auth';
import { GoogleIcon } from './GoogleIcon';

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось войти через Google');
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full gap-2" onClick={handleClick} disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
      Продолжить с Google
    </Button>
  );
}
