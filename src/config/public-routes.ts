export const publicRoutes = [
  { path: '/auth/sign-in', whenAuthenticated: 'redirect' },
  { path: '/auth/sign-up', whenAuthenticated: 'redirect' },
  { path: '/auth/sign-out', whenAuthenticated: 'redirect' },
  { path: '/auth/mfa-challenge', whenAuthenticated: 'redirect' },
  { path: '/auth/magic-link', whenAuthenticated: 'allow' },
  { path: '/auth/recover-password', whenAuthenticated: 'redirect' },
  { path: '/auth/forgot-password', whenAuthenticated: 'redirect' },
] as const;

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route.path));
}

export const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/auth/sign-in';
export const REDIRECT_SIGN_OUT_ROUTE = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
