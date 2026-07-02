import { LogIn, LogOut, Settings, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ROUTES } from '@/shared/config/routes';
import { signOut } from '../api/auth';
import { useAuth } from '../model/AuthContext';

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName ?? user?.email ?? 'Гость';
  const email = user?.email ?? 'Вход не выполнен';
  const initials = user ? getInitials(user.fullName, user.email) : 'ГС';

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Вы вышли из аккаунта');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось выйти');
    } finally {
      navigate(ROUTES.AUTH.LOGIN);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none ring-primary/40 transition-shadow focus-visible:ring-2">
          <Avatar className="size-9 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-medium text-foreground">{displayName}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={ROUTES.SETTINGS} className="gap-2">
            <User className="size-4" />
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.SETTINGS} className="gap-2">
            <Settings className="size-4" />
            Настройки
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem variant="destructive" className="gap-2" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Выйти
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to={ROUTES.AUTH.LOGIN} className="gap-2">
              <LogIn className="size-4" />
              Войти
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
