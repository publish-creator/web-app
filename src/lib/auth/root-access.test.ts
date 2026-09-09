import { describe, expect, it } from 'vitest';

import type { AuthUser } from '@/store/services/auth/auth.types';

import { rootAccessFor } from './root-access';

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

describe('rootAccessFor', () => {
  it('waits while the session has not answered, instead of guessing', () => {
    expect(rootAccessFor(null, false)).toBe('loading');
    expect(rootAccessFor(user({ role: 'ADMIN', platformRole: 'ROOT' }), false)).toBe('loading');
  });

  it('lets ADMIN with ROOT through, which is what the API asks for', () => {
    expect(rootAccessFor(user({ role: 'ADMIN', platformRole: 'ROOT' }), true)).toBe('allow');
  });

  it('refuses ADMIN without ROOT, which is the easy mistake', () => {
    expect(rootAccessFor(user({ role: 'ADMIN', platformRole: 'COMMERCIAL' }), true)).toBe(
      'redirect',
    );
    expect(rootAccessFor(user({ role: 'ADMIN', platformRole: 'FINANCE' }), true)).toBe('redirect');
  });

  it('refuses ROOT without ADMIN, because both halves are the rule', () => {
    expect(rootAccessFor(user({ role: 'USER', platformRole: 'ROOT' }), true)).toBe('redirect');
  });

  it('refuses a plain affiliate', () => {
    expect(rootAccessFor(user(), true)).toBe('redirect');
  });

  it('refuses a resolved session with nobody in it', () => {
    expect(rootAccessFor(null, true)).toBe('redirect');
  });

  it('never answers allow while loading, whoever the user is', () => {
    const everyone = [
      user({ role: 'ADMIN', platformRole: 'ROOT' }),
      user({ role: 'ADMIN', platformRole: 'COMMERCIAL' }),
      user(),
      null,
    ];

    for (const someone of everyone) expect(rootAccessFor(someone, false)).not.toBe('allow');
  });
});
