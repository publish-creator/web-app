import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { OffersListResponse } from '@/store/services/offers/offers.types';

import { OffersListContent } from './offer-list-content';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock('@heroui/react', () => ({
  Button: ({ children, onPress }: { children: ReactNode; onPress?: () => void }) => (
    <button onClick={onPress} type="button">
      {children}
    </button>
  ),
}));

vi.mock('./offer-list-card', () => ({
  OfferListCard: ({ data }: { data: { title: string } }) => <div>{data.title}</div>,
}));

function response(total: number, page: number, items: string[]): OffersListResponse {
  return {
    data: items.map((title, index) => ({
      id: `off-${index}`,
      title,
    })) as OffersListResponse['data'],
    meta: { total, page, pageSize: 12, totalPages: Math.max(1, Math.ceil(total / 12)) },
  };
}

const noop = () => {};

describe('OffersListContent', () => {
  it('renders a card per offer', () => {
    render(
      <OffersListContent
        data={response(2, 1, ['Primeira', 'Segunda'])}
        isError={false}
        isLoading={false}
        onBackToFirstPage={noop}
        onRetry={noop}
      />,
    );

    expect(screen.getByText('Primeira')).toBeInTheDocument();
    expect(screen.getByText('Segunda')).toBeInTheDocument();
  });

  it('says there are no offers when the account really sees none', () => {
    render(
      <OffersListContent
        data={response(0, 1, [])}
        isError={false}
        isLoading={false}
        onBackToFirstPage={noop}
        onRetry={noop}
      />,
    );

    expect(screen.getByText(/Nenhuma oferta/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('offers a way back when the page is past the end, instead of claiming there are no offers', () => {
    const onBackToFirstPage = vi.fn();

    render(
      <OffersListContent
        data={response(11, 99, [])}
        isError={false}
        isLoading={false}
        onBackToFirstPage={onBackToFirstPage}
        onRetry={onBackToFirstPage}
      />,
    );

    expect(screen.queryByText(/Nenhuma oferta/)).not.toBeInTheDocument();
    expect(screen.getByText(/11 ofertas no total/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /primeira página/i }));

    expect(onBackToFirstPage).toHaveBeenCalled();
  });

  it('shows a retry the person can press when the request failed', () => {
    const onRetry = vi.fn();

    render(
      <OffersListContent
        data={undefined}
        isError
        isLoading={false}
        onBackToFirstPage={noop}
        onRetry={onRetry}
      />,
    );

    fireEvent.click(screen.getByText(/Tentar novamente/));

    expect(onRetry).toHaveBeenCalled();
  });

  it('shows the skeleton while loading, not the empty state', () => {
    render(
      <OffersListContent
        data={undefined}
        isError={false}
        isLoading
        onBackToFirstPage={noop}
        onRetry={noop}
      />,
    );

    expect(screen.queryByText(/Nenhuma oferta/)).not.toBeInTheDocument();
  });
});
