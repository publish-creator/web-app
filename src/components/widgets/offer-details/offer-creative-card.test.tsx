import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { OfferCreative } from '@/store/services/offers/offer-details.types';

import { OfferCreativeCard } from './offer-creative-card';

vi.mock('@heroui/react', () => ({
  Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

const TITLE = 'Criativo de teste';

function buildCreative(overrides: Partial<OfferCreative> = {}): OfferCreative {
  return {
    id: 'cre-1',
    offerId: 'off-1',
    kind: 'IMAGE',
    title: TITLE,
    description: null,
    uploadId: 'up-1',
    sortOrder: 0,
    mimeType: 'image/png',
    sizeBytes: 2048,
    url: 'https://localstack/assinada?X-Amz-Signature=abc',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('OfferCreativeCard', () => {
  it('renders an image creative with the signed URL it was given', () => {
    render(<OfferCreativeCard creative={buildCreative()} />);

    expect(screen.getByAltText(TITLE)).toHaveAttribute(
      'src',
      'https://localstack/assinada?X-Amz-Signature=abc',
    );
  });

  it('renders a video creative as a video, not as an image', () => {
    const { container } = render(<OfferCreativeCard creative={buildCreative({ kind: 'VIDEO' })} />);

    expect(container.querySelector('video')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('labels the kind in words rather than showing the enum', () => {
    render(<OfferCreativeCard creative={buildCreative({ kind: 'VIDEO' })} />);

    expect(screen.getByText('Vídeo')).toBeInTheDocument();
    expect(screen.queryByText('VIDEO')).not.toBeInTheDocument();
  });

  it('shows the size in units a person reads', () => {
    render(<OfferCreativeCard creative={buildCreative({ sizeBytes: 2048 })} />);

    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  it('scales the size to megabytes for a large file', () => {
    render(<OfferCreativeCard creative={buildCreative({ sizeBytes: 5 * 1024 * 1024 })} />);

    expect(screen.getByText('5.0 MB')).toBeInTheDocument();
  });

  it('keeps bytes for something tiny instead of rounding it to 0 KB', () => {
    render(<OfferCreativeCard creative={buildCreative({ sizeBytes: 300 })} />);

    expect(screen.getByText('300 B')).toBeInTheDocument();
  });

  it('opens in a new tab without handing the opener to the signed URL', () => {
    render(<OfferCreativeCard creative={buildCreative()} />);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
