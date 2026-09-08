import type { PendingStep, Session } from '@/store/services/auth/auth.types';

/**
 * Where each unfinished step is answered. One map, so a screen added on one side and a redirect
 * written on the other cannot drift apart.
 */
export const PENDING_ROUTE: Record<PendingStep, string> = {
  VERIFY_EMAIL: '/auth/verify-email',
  SET_PASSWORD: '/auth/set-password',
  ENABLE_MFA: '/mfa',
  ACCEPT_TERMS: '/auth/terms',
};

export const HOME_ROUTE = '/';

/**
 * The next screen this person belongs on. The server decides the order — this only reads it — and
 * routing is a convenience: every endpoint behind these screens refuses a caller who skipped one,
 * so a wrong answer here is a bad experience, never an opening.
 */
export function nextRouteFor(session: Pick<Session, 'pending'>): string {
  const [first] = session.pending;

  return first ? PENDING_ROUTE[first] : HOME_ROUTE;
}
