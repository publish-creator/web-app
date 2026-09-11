import type { RouteAccess } from '@/config/route-access';
import type { AuthUser } from '@/store/services/auth/auth.types';

export type AccessDecision = 'public' | 'loading' | 'allow' | 'redirect';

export function accessDecision(
  rule: RouteAccess | undefined,
  user: AuthUser | null,
  isResolved: boolean,
): AccessDecision {
  if (!rule) return 'public';

  if (!isResolved) return 'loading';

  if (!user) return 'redirect';

  return user.role === rule.role && user.platformRole === rule.platformRole ? 'allow' : 'redirect';
}
