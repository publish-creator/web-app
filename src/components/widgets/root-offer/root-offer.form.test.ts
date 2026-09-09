import { describe, expect, it } from 'vitest';

import type { Offer } from '@/store/services/offers/offers.types';

import { formValuesFrom, offerFormSchema, updateBodyFrom } from './root-offer.form';
import { DEFAULT_TAB, offerTabFrom } from './root-offer.tabs';

const CATEGORY = '11111111-1111-4111-8111-111111111111';
const USER_TAG = '22222222-2222-4222-8222-222222222222';
const ALLOWED_USER = '33333333-3333-4333-8333-333333333333';

function buildOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'off-1',
    code: 'off_ABC',
    title: 'Oferta',
    description: null,
    imageUrl: null,
    status: 'DRAFT',
    angle: null,
    currency: 'BRL',
    paymentPlatform: 'SPARK',
    countries: ['BR', 'PT'],
    countryGroupIds: ['grupo-latam'],
    pvUrl: null,
    isAvailableForAllUsers: false,
    allowedPlatformRoles: ['AFFILIATE'],
    allowedUserIds: [ALLOWED_USER],
    tags: [{ id: 'tag-1', name: 'BF', active: true, userTagIds: [USER_TAG] }],
    category: { id: CATEGORY, name: 'Saúde' },
    niche: null,
    structure: null,
    commissionMode: 'STANDARD',
    frontCommissionType: 'REV_SHARE',
    frontCommissionValue: '40.00',
    backCommissionType: 'CPA',
    backCommissionValue: '12.50',
    recurrenceCommissionType: 'CPA',
    recurrenceCommissionValue: '0.00',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const parse = (offer: Offer) => offerFormSchema.parse(formValuesFrom(offer));

describe('offerTabFrom', () => {
  it('accepts a tab the screen has', () => {
    expect(offerTabFrom('comissao')).toBe('comissao');
    expect(offerTabFrom('coprodutores')).toBe('coprodutores');
  });

  it('falls back for anything the URL might carry, instead of rendering nothing', () => {
    for (const junk of ['', 'QUALQUER', 'Detalhes', undefined]) {
      expect(offerTabFrom(junk)).toBe(DEFAULT_TAB);
    }
  });
});

describe('publishing needs a sales link', () => {
  it('refuses PUBLISHED without pvUrl, before the request leaves', () => {
    const result = offerFormSchema.safeParse({
      ...formValuesFrom(buildOffer()),
      status: 'PUBLISHED',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['status']);
  });

  it('accepts PUBLISHED once the link is there', () => {
    const values = { ...formValuesFrom(buildOffer()), status: 'PUBLISHED', pvUrl: 'https://e.com' };

    expect(offerFormSchema.safeParse(values).success).toBe(true);
  });

  it('never asks for the link on a draft', () => {
    expect(offerFormSchema.safeParse(formValuesFrom(buildOffer())).success).toBe(true);
  });
});

describe('commission', () => {
  it('refuses a negative value, with the same floor as the database CHECK', () => {
    const values = { ...formValuesFrom(buildOffer()), frontCommissionValue: -1 };

    expect(offerFormSchema.safeParse(values).success).toBe(false);
  });

  it('reads the string the API sends as a number, without turning it into NaN', () => {
    expect(parse(buildOffer()).frontCommissionValue).toBe(40);
    expect(parse(buildOffer()).backCommissionValue).toBe(12.5);
  });
});

describe('updateBodyFrom carries what the screen does not edit', () => {
  it('sends the reach back untouched, because the PUT replaces instead of merging', () => {
    const offer = buildOffer();
    const body = updateBodyFrom(offer, parse(offer));

    expect(body.countries).toEqual(['BR', 'PT']);
    expect(body.countryGroupIds).toEqual(['grupo-latam']);
    expect(body.allowedUserIds).toEqual([ALLOWED_USER]);
    expect(body.allowedPlatformRoles).toEqual(['AFFILIATE']);
    expect(body.isAvailableForAllUsers).toBe(false);
  });

  it('sends the tags back with their user tag ids, which is what targeting depends on', () => {
    const offer = buildOffer();
    const body = updateBodyFrom(offer, parse(offer));

    expect(body.tags).toEqual([{ name: 'BF', active: true, userTagIds: [USER_TAG] }]);
  });

  it('survives a round trip with nothing changed', () => {
    const offer = buildOffer();
    const body = updateBodyFrom(offer, parse(offer));

    expect(body.title).toBe(offer.title);
    expect(body.categoryId).toBe(CATEGORY);
    expect(body.frontCommissionValue).toBe(40);
    expect(body.commissionMode).toBe('STANDARD');
    expect(body.paymentPlatform).toBe('SPARK');
  });

  it('sends the payment platform the form chose, not the one the offer had', () => {
    const offer = buildOffer();
    const body = updateBodyFrom(
      offer,
      offerFormSchema.parse({ ...formValuesFrom(offer), paymentPlatform: 'BUY_GOODS' }),
    );

    expect(body.paymentPlatform).toBe('BUY_GOODS');
  });

  it('turns an emptied text field into null, not into an empty string', () => {
    const offer = buildOffer({ description: 'algo' });
    const body = updateBodyFrom(
      offer,
      offerFormSchema.parse({ ...formValuesFrom(offer), description: '' }),
    );

    expect(body.description).toBeNull();
  });
});
