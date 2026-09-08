import type { PendingStep, Session } from '@/store/services/auth/auth.types';

export const PENDING_ROUTE: Record<PendingStep, string> = {
  VERIFY_EMAIL: '/auth/verify-email',
  SET_PASSWORD: '/auth/set-password',
  ENABLE_MFA: '/mfa',
  ACCEPT_TERMS: '/auth/terms',
};

export const HOME_ROUTE = '/';

export function nextRouteFor(session: Pick<Session, 'pending'>): string {
  const [first] = session.pending;

  return first ? PENDING_ROUTE[first] : HOME_ROUTE;
}
