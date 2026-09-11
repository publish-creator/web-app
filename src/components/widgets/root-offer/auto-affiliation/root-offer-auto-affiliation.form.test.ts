import { describe, expect, it } from 'vitest';

import { offerTabFrom } from '../root-offer.tabs';
import {
  autoAffiliationFormSchema,
  createBodyFrom,
  formValuesFromRule,
} from './root-offer-auto-affiliation.form';
import type { AutomaticAffiliationRule } from './root-offer-auto-affiliation.form';

const TAG = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const valid = {
  userTagIds: [TAG],
  applyTo: 'NEW_USERS' as const,
  sameAsFront: false,
  frontCommissionType: 'CPA' as const,
  frontCommissionValue: 5,
  backCommissionType: 'CPA' as const,
  backCommissionValue: 0,
  recurrenceCommissionType: 'CPA' as const,
  recurrenceCommissionValue: 0,
};

describe('offerTabFrom', () => {
  it('accepts the automatic affiliation tab', () => {
    expect(offerTabFrom('afiliacao-automatica')).toBe('afiliacao-automatica');
  });
});

describe('autoAffiliationFormSchema', () => {
  it('refuses a rule with no tags, because that would match everybody', () => {
    const result = autoAffiliationFormSchema.safeParse({ ...valid, userTagIds: [] });

    expect(result.success).toBe(false);
  });

  it('accepts a complete rule', () => {
    expect(autoAffiliationFormSchema.safeParse(valid).success).toBe(true);
  });

  it('refuses a negative commission', () => {
    expect(
      autoAffiliationFormSchema.safeParse({ ...valid, frontCommissionValue: -1 }).success,
    ).toBe(false);
  });
});

describe('createBodyFrom', () => {
  it('sends userTagIds, not free-text names, which is what the next API should persist', () => {
    expect(createBodyFrom(valid).userTagIds).toEqual([TAG]);
  });

  it('copies front onto back and recurrence when the toggle is on', () => {
    const body = createBodyFrom({
      ...valid,
      sameAsFront: true,
      frontCommissionType: 'REV_SHARE',
      frontCommissionValue: 40,
      backCommissionType: 'CPA',
      backCommissionValue: 9,
      recurrenceCommissionType: 'CPA',
      recurrenceCommissionValue: 1,
    });

    expect(body.backCommissionType).toBe('REV_SHARE');
    expect(body.backCommissionValue).toBe(40);
    expect(body.recurrenceCommissionType).toBe('REV_SHARE');
    expect(body.recurrenceCommissionValue).toBe(40);
  });

  it('drops duplicate tag ids before the body leaves', () => {
    expect(createBodyFrom({ ...valid, userTagIds: [TAG, TAG] }).userTagIds).toEqual([TAG]);
  });
});

describe('formValuesFromRule', () => {
  it('turns matching commissions into the same-as-front toggle', () => {
    const rule: AutomaticAffiliationRule = {
      ...valid,
      id: 'rule-1',
      updatedAt: '2026-09-10T00:00:00.000Z',
      sameAsFront: false,
      backCommissionValue: 5,
      recurrenceCommissionValue: 5,
    };

    expect(formValuesFromRule(rule).sameAsFront).toBe(true);
  });
});
