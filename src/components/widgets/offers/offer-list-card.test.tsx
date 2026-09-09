import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { Offer } from '@/store/services/offers/offers.types';

import { OfferListCard } from './offer-list-card';

const TITLE = 'Oferta de teste';

vi.mock('@heroui/react', () => ({
  Button: ({ children }: { children?: ReactNode }) => <button type="button">{children}</button>,
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@solar-icons/react/linear', () => ({ InfoCircleIcon: () => null }));

function buildOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'off-1',
    code: 'off_abc123',
    title: TITLE,
    description: null,
    imageUrl: 'https://exemplo.com/capa.png',
    status: 'PUBLISHED',
    angle: null,
    currency: 'BRL',
    paymentPlatform: 'SPARK',
    countries: ['BR', 'US', 'PT', 'AR'],
    countryGroupIds: [],
    pvUrl: null,
    isAvailableForAllUsers: true,
    allowsAutomaticAffiliation: false,
    allowedPlatformRoles: [],
    allowedUserIds: [],
    tags: [],
    category: { id: 'cat-1', name: 'Saúde' },
    niche: null,
    structure: null,
    commissionMode: 'STANDARD',
    frontCommissionType: 'CPA',
    frontCommissionValue: '150.00',
    backCommissionType: 'CPA',
    backCommissionValue: '0.00',
    recurrenceCommissionType: 'CPA',
    recurrenceCommissionValue: '0.00',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('OfferListCard', () => {
  it('renders the category name, which the API calls `name` and not `title`', () => {
    render(<OfferListCard data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByText('Saúde')).toBeInTheDocument();
  });

  it('says "sem categoria" instead of leaving a blank line when there is none', () => {
    render(<OfferListCard data={buildOffer({ category: null })} onPress={() => {}} />);

    expect(screen.getByText('Sem categoria')).toBeInTheDocument();
  });

  it('reads the commission from `frontCommissionValue` as a plain amount, not as cents', () => {
    render(<OfferListCard data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.queryByText(/1,50/)).not.toBeInTheDocument();
  });

  it('shows a revenue share as a percentage rather than as money', () => {
    const offer = buildOffer({ frontCommissionType: 'REV_SHARE', frontCommissionValue: '40.00' });

    render(<OfferListCard data={offer} onPress={() => {}} />);

    expect(screen.getByText(/40%/)).toBeInTheDocument();
  });

  it('uses `imageUrl` for the cover', () => {
    render(<OfferListCard data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByAltText(TITLE)).toHaveAttribute('src', 'https://exemplo.com/capa.png');
  });

  it('falls back to a placeholder when the offer has no image', () => {
    render(<OfferListCard data={buildOffer({ imageUrl: null })} onPress={() => {}} />);

    expect(screen.getByAltText(TITLE)).toHaveAttribute('src', expect.stringContaining('placehold'));
  });

  it('reads the country list from `countries`, showing three flags and a count for the rest', () => {
    render(<OfferListCard data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByAltText('BR')).toBeInTheDocument();
    expect(screen.getByAltText('US')).toBeInTheDocument();
    expect(screen.getByAltText('PT')).toBeInTheDocument();
    expect(screen.queryByAltText('AR')).not.toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('lowercases the country code for the flag service, which the API stores uppercase', () => {
    render(<OfferListCard data={buildOffer({ countries: ['BR'] })} onPress={() => {}} />);

    expect(screen.getByAltText('BR')).toHaveAttribute('src', expect.stringContaining('/br.svg'));
  });

  it('draws no flag row for an offer with no countries', () => {
    render(<OfferListCard data={buildOffer({ countries: [] })} onPress={() => {}} />);

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});

describe('the action slot', () => {
  it('keeps Apply when nobody passes one, so the affiliate screen is untouched', () => {
    render(<OfferListCard data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('lets a caller put something else there, which is how root shows the status', () => {
    render(<OfferListCard action={<span>Rascunho</span>} data={buildOffer()} onPress={() => {}} />);

    expect(screen.getByText('Rascunho')).toBeInTheDocument();
    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
  });
});
