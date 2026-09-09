'use client';

import { useGetOfferCreativesQuery } from '@/store/services/offers/offers.api';

import { OfferCreativeCard } from './offer-creative-card';
import { useOfferId } from './use-offer';

const GRID = 'grid w-full grid-cols-3 gap-2';

const PAGE_SIZE = 12;

export const OfferCreative = () => {
  const offerId = useOfferId();
  const { data, isLoading, isError } = useGetOfferCreativesQuery(
    { offerId, page: 1, pageSize: PAGE_SIZE },
    { skip: offerId === '' },
  );

  const creatives = data?.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">
          Criativos
          {data ? <span className="text-muted ml-2 text-sm">{data.meta.total}</span> : null}
        </p>
      </div>

      {isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              aria-hidden
              className="bg-surface-secondary aspect-3/4 animate-pulse rounded-2xl"
              key={index}
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-muted py-8 text-sm">Não foi possível carregar os criativos.</p>
      ) : creatives.length === 0 ? (
        <p className="text-muted py-8 text-sm">Esta oferta ainda não tem criativos.</p>
      ) : (
        <div className={GRID}>
          {creatives.map((creative) => (
            <OfferCreativeCard creative={creative} key={creative.id} />
          ))}
        </div>
      )}
    </div>
  );
};
