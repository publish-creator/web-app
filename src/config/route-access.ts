import type { PlatformRole, Role } from '@/store/services/auth/auth.types';

export type RouteAccess = {
  path: string;
  role: Role;
  platformRole: PlatformRole;
  fallback: string;
};

export const routeAccess: readonly RouteAccess[] = [
  { path: '/root', role: 'ADMIN', platformRole: 'ROOT', fallback: '/offers' },
] as const;

export function accessRuleFor(pathname: string): RouteAccess | undefined {
  return [...routeAccess]
    .sort((left, right) => right.path.length - left.path.length)
    .find((rule) => pathname === rule.path || pathname.startsWith(`${rule.path}/`));
}
