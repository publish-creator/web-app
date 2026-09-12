import { describe, expect, it } from 'vitest';

import type { Coproducer } from '@/store/services/offers/offer-details.types';

import { createBodyFrom, formValuesFrom } from './root-offer-coproducers.form';

const TAG = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const values = {
  userId: TAG,
  userName: 'Ana',
  userEmail: 'ana@test.local',
  status: 'ACTIVE' as const,
  sameAsFront: true,
  frontCommissionType: 'REV_SHARE' as const,
  frontCommissionValue: 20,
  backCommissionType: 'CPA' as const,
  backCommissionValue: 1,
  recurrenceCommissionType: 'CPA' as const,
  recurrenceCommissionValue: 2,
  payRefund: true,
  payTransactionalTax: true,
};

describe('createBodyFrom', () => {
  it('copies front onto back and recurrence when the toggle is on', () => {
    const body = createBodyFrom(values);

    expect(body.backCommissionType).toBe('REV_SHARE');
    expect(body.backCommissionValue).toBe(20);
    expect(body.recurrenceCommissionValue).toBe(20);
    expect(body.payRefund).toBe(true);
  });
});

describe('formValuesFrom', () => {
  it('turns matching commissions into the same-as-front toggle', () => {
    const row: Coproducer = {
      id: 'cpr-1',
      offerId: TAG,
      userId: TAG,
      user: { id: TAG, name: 'Ana', email: 'ana@test.local' },
      status: 'ACTIVE',
      commissionMode: 'STANDARD',
      frontCommissionType: 'CPA',
      frontCommissionValue: '5.00',
      backCommissionType: 'CPA',
      backCommissionValue: '5.00',
      recurrenceCommissionType: 'CPA',
      recurrenceCommissionValue: '5.00',
      excludedUserIds: [],
      payRefund: true,
      payTransactionalTax: true,
      createdAt: '2026-09-11T00:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z',
    };

    expect(formValuesFrom(row).sameAsFront).toBe(true);
  });
});
