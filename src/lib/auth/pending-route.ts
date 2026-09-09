import type { PendingStep, Session } from '@/store/services/auth/auth.types';

export const PENDING_ROUTE: Record<PendingStep, string> = {
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify-phone',
  SET_PASSWORD: '/auth/set-password',
  ENABLE_MFA: '/mfa',
  ACCEPT_TERMS: '/auth/terms',
};

export const HOME_ROUTE = '/';

export function nextRouteFor(session: Pick<Session, 'pending'>): string {
  const [first] = session.pending;

  return first ? PENDING_ROUTE[first] : HOME_ROUTE;
}

export function redirectTargetFor(pathname: string, pending: PendingStep[]): string | null {
  if (pending.length === 0) return null;

  if (pathname === PENDING_ROUTE.ENABLE_MFA && !pending.includes('ENABLE_MFA')) return null;

  const target = nextRouteFor({ pending });

  return pathname === target ? null : target;
}
