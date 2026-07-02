import { isSupabaseConfigured, supabase } from '@/shared/services/supabase';
import type { AppUser } from '@/entities/user';

const NOT_CONFIGURED_MESSAGE = 'Supabase не настроен. Добавьте ключи в .env и перезапустите приложение (Этап 9).';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }
  return supabase;
}

interface SupabaseUserLike {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}

export function mapSupabaseUser(user: SupabaseUserLike | null | undefined): AppUser | null {
  if (!user) return null;
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (metadata.full_name as string) ?? (metadata.name as string) ?? null,
    avatarUrl: (metadata.avatar_url as string) ?? (metadata.picture as string) ?? null,
  };
}

export async function signInWithPassword(email: string, password: string) {
  const client = assertConfigured();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const client = assertConfigured();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw new Error(error.message);
  return { hasSession: Boolean(data.session) };
}

export async function signInWithGoogle() {
  const client = assertConfigured();
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);
}

export async function resetPasswordForEmail(email: string) {
  const client = assertConfigured();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword: string) {
  const client = assertConfigured();
  const { error } = await client.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function updateProfile(data: { fullName?: string; avatarUrl?: string }) {
  const client = assertConfigured();
  const { error } = await client.auth.updateUser({
    data: { full_name: data.fullName, avatar_url: data.avatarUrl },
  });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const client = assertConfigured();
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
}
