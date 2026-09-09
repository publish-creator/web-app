import { describe, expect, it } from 'vitest';

import { accessRuleFor, routeAccess } from '@/config/route-access';
import type { AuthUser } from '@/store/services/auth/auth.types';

import { accessDecision } from './route-access';

const ROOT_RULE = accessRuleFor('/root');

const user = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 'u1',
  email: 'person@beworke.com',
  name: 'Person',
  status: 'ACTIVE',
  role: 'USER',
  platformRole: 'AFFILIATE',
  country: 'BR',
  phone: null,
  ...overrides,
});

const root = user({ role: 'ADMIN', platformRole: 'ROOT' });

describe('accessRuleFor', () => {
  it('claims /root and everything under it', () => {
    expect(accessRuleFor('/root')?.path).toBe('/root');
    expect(accessRuleFor('/root/offers')?.path).toBe('/root');
    expect(accessRuleFor('/root/offers/new')?.path).toBe('/root');
  });

  it('does not claim a route that merely starts with the same letters', () => {
    expect(accessRuleFor('/rootless')).toBeUndefined();
    expect(accessRuleFor('/roots')).toBeUndefined();
  });

  it('leaves the rest of the app alone', () => {
    for (const path of ['/offers', '/settings', '/auth/sign-in', '/']) {
      expect(accessRuleFor(path)).toBeUndefined();
    }
  });

  it('prefers the most specific rule when two could match', () => {
    const rules = [
      { path: '/root', role: 'ADMIN', platformRole: 'ROOT', fallback: '/offers' },
      { path: '/root/finance', role: 'ADMIN', platformRole: 'FINANCE', fallback: '/offers' },
    ] as const;

    const longestFirst = [...rules].sort((left, right) => right.path.length - left.path.length);

    expect(longestFirst[0]?.path).toBe('/root/finance');
  });

  it('names a fallback on every rule, so nobody is redirected nowhere', () => {
    for (const rule of routeAccess) expect(rule.fallback.startsWith('/')).toBe(true);
  });
});

describe('accessDecision', () => {
  it('says public when no rule claims the route, whatever the session is', () => {
    expect(accessDecision(undefined, null, false)).toBe('public');
    expect(accessDecision(undefined, user(), true)).toBe('public');
  });

  it('waits while the session has not answered, instead of guessing', () => {
    expect(accessDecision(ROOT_RULE, null, false)).toBe('loading');
    expect(accessDecision(ROOT_RULE, root, false)).toBe('loading');
  });

  it('lets through whoever matches both halves of the rule', () => {
    expect(accessDecision(ROOT_RULE, root, true)).toBe('allow');
  });

  it('refuses ADMIN without ROOT, which is the easy mistake', () => {
    expect(
      accessDecision(ROOT_RULE, user({ role: 'ADMIN', platformRole: 'COMMERCIAL' }), true),
    ).toBe('redirect');
  });

  it('refuses ROOT without ADMIN, because both halves are the rule', () => {
    expect(accessDecision(ROOT_RULE, user({ platformRole: 'ROOT' }), true)).toBe('redirect');
  });

  it('refuses a plain affiliate', () => {
    expect(accessDecision(ROOT_RULE, user(), true)).toBe('redirect');
  });

  it('refuses a resolved session with nobody in it', () => {
    expect(accessDecision(ROOT_RULE, null, true)).toBe('redirect');
  });

  it('never answers allow while loading, whoever the user is', () => {
    for (const someone of [root, user({ role: 'ADMIN' }), user(), null]) {
      expect(accessDecision(ROOT_RULE, someone, false)).not.toBe('allow');
    }
  });
});
