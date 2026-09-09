import { describe, expect, it } from 'vitest';

import { isPublicRoute } from './public-routes';

describe('isPublicRoute', () => {
  it('knows the magic link landing, where nobody has a session yet', () => {
    expect(isPublicRoute('/auth/magic-link')).toBe(true);
  });

  it('matches the magic link carrying its token in the query string', () => {
    expect(isPublicRoute('/auth/magic-link')).toBe(true);
    expect(isPublicRoute('/auth/sign-up')).toBe(true);
  });

  it('does not treat an onboarding step as public, since those need a session', () => {
    expect(isPublicRoute('/auth/verify-phone')).toBe(false);
    expect(isPublicRoute('/auth/set-password')).toBe(false);
    expect(isPublicRoute('/auth/terms')).toBe(false);
  });

  it('does not treat an application route as public', () => {
    expect(isPublicRoute('/offers')).toBe(false);
    expect(isPublicRoute('/mfa')).toBe(false);
  });
});
