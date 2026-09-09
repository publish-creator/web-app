import type { AuthUser } from '@/store/services/auth/auth.types';

export const ROOT_FALLBACK_ROUTE = '/offers';

export type RootAccess = 'loading' | 'allow' | 'redirect';

export function rootAccessFor(user: AuthUser | null, isResolved: boolean): RootAccess {
  if (!isResolved) return 'loading';

  if (!user) return 'redirect';

  return user.role === 'ADMIN' && user.platformRole === 'ROOT' ? 'allow' : 'redirect';
}
