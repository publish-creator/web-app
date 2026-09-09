import { describe, expect, it } from 'vitest';

import type { PendingStep } from '@/store/services/auth/auth.types';

import { HOME_ROUTE, PENDING_ROUTE, nextRouteFor, redirectTargetFor } from './pending-route';

const PHONE_ROUTE = '/auth/verify-phone';

const EVERY_STEP: PendingStep[] = [
  'VERIFY_EMAIL',
  'VERIFY_PHONE',
  'SET_PASSWORD',
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
    expect(nextRouteFor({ pending: ['VERIFY_PHONE', 'ENABLE_MFA'] })).toBe(PHONE_ROUTE);
  });

  it('has a screen for every step the API can send, so none of them dead-ends', () => {
    for (const step of EVERY_STEP) {
      expect(PENDING_ROUTE[step]).toMatch(/^\//);
    }

    expect(Object.keys(PENDING_ROUTE).sort()).toEqual([...EVERY_STEP].sort());
  });
});

describe('redirectTargetFor', () => {
  it('pushes somebody sitting on the wrong screen to the step they owe', () => {
    expect(redirectTargetFor('/offers', ['VERIFY_PHONE'])).toBe(PHONE_ROUTE);
  });

  it('stays put when the screen already is the step they owe', () => {
    expect(redirectTargetFor(PHONE_ROUTE, ['VERIFY_PHONE'])).toBeNull();
  });

  it('does nothing when nothing is owed', () => {
    expect(redirectTargetFor('/offers', [])).toBeNull();
  });

  it('leaves the MFA screen alone once the step is satisfied, so the recovery codes can be read', () => {
    expect(redirectTargetFor(PENDING_ROUTE.ENABLE_MFA, ['ACCEPT_TERMS'])).toBeNull();
  });

  it('still pulls somebody onto the MFA screen while the step is owed', () => {
    expect(redirectTargetFor('/offers', ['ENABLE_MFA', 'ACCEPT_TERMS'])).toBe(
      PENDING_ROUTE.ENABLE_MFA,
    );
  });

  it('does not extend the exception to any other screen', () => {
    expect(redirectTargetFor(PHONE_ROUTE, ['ACCEPT_TERMS'])).toBe('/auth/terms');
  });
});
