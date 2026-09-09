'use client';

import { Chip } from '@heroui/react';

import { formatCommission } from '@/utils/format-commission';

import { useOffer } from './use-offer';

export const OfferInformation = () => {
  const { data: offer, isLoading } = useOffer();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-surface-secondary aspect-video h-[140px] w-[280px] animate-pulse rounded-md" />
        <div className="flex flex-col gap-3">
          <div className="bg-surface-secondary h-7 w-64 animate-pulse rounded" />
          <div className="bg-surface-secondary h-6 w-80 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!offer) return null;

  return (
    <div className="flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- the cover is an arbitrary host an admin pastes; next/image would need every one allowlisted */}
      <img
        alt={offer.title}
        className="aspect-video max-h-[140px] max-w-[280px] rounded-md object-cover"
        src={offer.imageUrl ?? 'https://placehold.co/1280x720'}
      />
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold">{offer.title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Chip color="success" variant="secondary">
            {formatCommission(
              offer.frontCommissionValue,
              offer.frontCommissionType,
              offer.currency,
            )}
          </Chip>
          <Chip className="text-muted" variant="secondary">
            {offer.frontCommissionType === 'REV_SHARE' ? 'Rev share' : 'CPA'}
          </Chip>
          {offer.category ? (
            <Chip className="text-muted" variant="secondary">
              {offer.category.name}
            </Chip>
          ) : null}
          {offer.niche ? (
            <Chip className="text-muted" variant="secondary">
              {offer.niche.name}
            </Chip>
          ) : null}
          {/*
            The old chip read "Approved Required", which nothing in the API decides. What the offer
            does carry is whether it is open to everyone, so that is what the chip says now.
          */}
          {offer.isAvailableForAllUsers ? null : (
            <Chip color="warning" variant="secondary">
              Acesso restrito
            </Chip>
          )}
          {offer.status === 'DRAFT' ? (
            <Chip color="warning" variant="secondary">
              Rascunho
            </Chip>
          ) : null}
        </div>
        {offer.angle ? <p className="text-muted text-sm">{offer.angle}</p> : null}
      </div>
    </div>
  );
};
