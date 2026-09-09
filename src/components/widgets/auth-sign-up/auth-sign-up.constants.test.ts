import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  SIGN_UP_STEPPER_GROUPS,
  SIGN_UP_STEP_ILLUSTRATION,
  SIGN_UP_STEP_MAX_WIDTH,
  SIGN_UP_TOTAL_STEPS,
  getSignupProgress,
} from './auth-sign-up.constants';

describe('SIGN_UP_STEPPER_GROUPS', () => {
  it('asks for the country before the e-mail', () => {
    const keys = SIGN_UP_STEPPER_GROUPS.map((group) => group.key);

    expect(keys.indexOf('country')).toBeLessThan(keys.indexOf('email'));
  });

  it('numbers the steps without a gap or a repeat', () => {
    const steps = SIGN_UP_STEPPER_GROUPS.flatMap((group) => group.steps);

    expect(steps).toEqual([1, 2, 3, 4]);
  });

  it('leaves exactly one step past the last group, for the success screen', () => {
    const last = SIGN_UP_STEPPER_GROUPS.at(-1);

    expect(last?.completedAfter).toBe(SIGN_UP_TOTAL_STEPS - 1);
  });

  it('has a width for every step the flow can reach', () => {
    for (let step = 1; step <= SIGN_UP_TOTAL_STEPS; step += 1) {
      expect(SIGN_UP_STEP_MAX_WIDTH[step]).toBeTruthy();
    }
  });
});

describe('SIGN_UP_STEP_ILLUSTRATION', () => {
  it('has art for every step the flow can reach', () => {
    for (let step = 1; step <= SIGN_UP_TOTAL_STEPS; step += 1) {
      expect(SIGN_UP_STEP_ILLUSTRATION[step]).toBeTruthy();
    }
  });

  it('points at files that are actually in public/, so none renders broken', () => {
    for (const illustration of Object.values(SIGN_UP_STEP_ILLUSTRATION)) {
      expect(existsSync(join(process.cwd(), 'public', illustration.src))).toBe(true);
    }
  });

  it('names no step twice, which is how the art drifts out of the flow', () => {
    const steps = Object.keys(SIGN_UP_STEP_ILLUSTRATION).map(Number);

    expect(steps).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('getSignupProgress', () => {
  it('grows with every step and never goes backwards', () => {
    const values = [1, 2, 3, 4].map(getSignupProgress);

    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('is complete on the success screen', () => {
    expect(getSignupProgress(SIGN_UP_TOTAL_STEPS)).toBe(100);
  });
});

describe('COUNTRIES', () => {
  it('offers the default country, so the pre-selected value is selectable', () => {
    expect(COUNTRIES.some((country) => country.id === DEFAULT_COUNTRY)).toBe(true);
  });

  it('uses lowercase ids, which is what the flag CDN expects', () => {
    for (const country of COUNTRIES) expect(country.id).toBe(country.id.toLowerCase());
  });
});
