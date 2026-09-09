import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import type { PendingStep } from '@/store/services/auth/auth.types';

import {
  ONBOARDING_STEPS,
  onboardingProgress,
  stepForPath,
  stepStates,
} from './auth-onboarding-steps';

const PHONE_ROUTE = '/auth/verify-phone';

const ALL: PendingStep[] = [
  'VERIFY_EMAIL',
  'VERIFY_PHONE',
  'SET_PASSWORD',
  'ENABLE_MFA',
  'ACCEPT_TERMS',
];

describe('stepStates', () => {
  it('marks a step done once the API stops asking for it', () => {
    const states = stepStates(['ENABLE_MFA', 'ACCEPT_TERMS'], '/mfa');

    expect(states.VERIFY_EMAIL).toBe('done');
    expect(states.VERIFY_PHONE).toBe('done');
    expect(states.SET_PASSWORD).toBe('done');
  });

  it('marks the screen the person is looking at as current, not as owed', () => {
    const states = stepStates(['VERIFY_PHONE', 'SET_PASSWORD'], PHONE_ROUTE);

    expect(states.VERIFY_PHONE).toBe('current');
    expect(states.SET_PASSWORD).toBe('upcoming');
  });

  it('falls back to the first owed step when the route matches no step', () => {
    const states = stepStates(['SET_PASSWORD', 'ENABLE_MFA'], '/somewhere-else');

    expect(states.SET_PASSWORD).toBe('current');
    expect(states.ENABLE_MFA).toBe('upcoming');
  });

  it('shows every step done when nothing is owed', () => {
    const states = stepStates([], '/');

    for (const step of ONBOARDING_STEPS) expect(states[step.id]).toBe('done');
  });

  it('survives a session that has not loaded yet', () => {
    const states = stepStates(undefined, PHONE_ROUTE);

    expect(states.VERIFY_PHONE).toBe('current');
    expect(states.ACCEPT_TERMS).toBe('done');
  });

  it('reads /mfa as the second-factor step, whose route is outside /auth', () => {
    const states = stepStates(['ENABLE_MFA', 'ACCEPT_TERMS'], '/mfa');

    expect(states.ENABLE_MFA).toBe('current');
  });
});

describe('stepForPath', () => {
  it('finds the step by the route it owns', () => {
    expect(stepForPath(PHONE_ROUTE)?.id).toBe('VERIFY_PHONE');
  });

  it('finds nothing for a route no step owns, so the shell can fall back', () => {
    expect(stepForPath('/auth/magic-link')).toBeUndefined();
  });
});

describe('step illustrations', () => {
  it('points at files that are actually in public/, so none renders broken', () => {
    for (const step of ONBOARDING_STEPS) {
      if (!step.illustration) continue;

      expect(existsSync(join(process.cwd(), 'public', step.illustration.src))).toBe(true);
    }
  });

  it('gives every illustration an alt that is not the file name', () => {
    for (const step of ONBOARDING_STEPS) {
      if (!step.illustration) continue;

      expect(step.illustration.alt.trim().length).toBeGreaterThan(0);
      expect(step.illustration.alt).not.toContain('/');
    }
  });
});

describe('onboardingProgress', () => {
  it('is zero at the very start', () => {
    expect(onboardingProgress(stepStates(ALL, '/auth/verify-email'))).toBe(0);
  });

  it('is a hundred when nothing is owed', () => {
    expect(onboardingProgress(stepStates([], '/'))).toBe(100);
  });

  it('counts only the finished steps, never the one being done', () => {
    const states = stepStates(['SET_PASSWORD', 'ENABLE_MFA', 'ACCEPT_TERMS'], '/auth/set-password');

    expect(onboardingProgress(states)).toBe(40);
  });
});

describe('ONBOARDING_STEPS', () => {
  it('covers every step the API can send, so none of them is missing from the list', () => {
    expect(ONBOARDING_STEPS.map((step) => step.id).sort()).toEqual([...ALL].sort());
  });

  it('is ordered the way the API asks for them', () => {
    expect(ONBOARDING_STEPS.map((step) => step.id)).toEqual(ALL);
  });
});
