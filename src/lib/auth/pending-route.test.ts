import { describe, expect, it } from 'vitest';

import type { PendingStep } from '@/store/services/auth/auth.types';

import { HOME_ROUTE, PENDING_ROUTE, nextRouteFor } from './pending-route';

const EVERY_STEP: PendingStep[] = [
  'VERIFY_EMAIL',
  'SET_PASSWORD',
  'VERIFY_PHONE',
  'ENABLE_MFA',
  'ACCEPT_TERMS',
];

describe('nextRouteFor', () => {
  it('sends someone with nothing owed home', () => {
    expect(nextRouteFor({ pending: [] })).toBe(HOME_ROUTE);
  });

  it('answers the first owed step, not the last', () => {
    expect(nextRouteFor({ pending: ['ENABLE_MFA', 'ACCEPT_TERMS'] })).toBe(
      PENDING_ROUTE.ENABLE_MFA,
    );
  });

  it('routes the phone step to its screen', () => {
    expect(nextRouteFor({ pending: ['VERIFY_PHONE', 'ENABLE_MFA'] })).toBe('/auth/verify-phone');
  });

  it('has a screen for every step the API can send, so none of them dead-ends', () => {
    for (const step of EVERY_STEP) {
      expect(PENDING_ROUTE[step]).toMatch(/^\//);
    }

    expect(Object.keys(PENDING_ROUTE).sort()).toEqual([...EVERY_STEP].sort());
  });
});
