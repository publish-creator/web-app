'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import type { OffersListResponse } from '@/store/services/offers/offers.types';

import { OfferListCard } from './offer-list-card';

interface OffersListContentProps {
  data: OffersListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const SKELETON_COUNT = 6;

const GRID = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

export const OffersListContent = ({
  data,
  isLoading,
  isError,
  onRetry,
}: OffersListContentProps) => {
  const { push } = useRouter();

  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div
            aria-hidden
            className="bg-surface-secondary h-64 animate-pulse rounded-2xl"
            key={index}
          />
        ))}
      </div>
    );
  }

  /**
   * A rejected query already raises a toast from the store middleware, so this only has to give the
   * page something other than a blank grid — and a way out that does not mean reloading by hand.
   */
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Não foi possível carregar as ofertas.</p>
        <p className="text-muted max-w-80 text-sm">
          Verifique sua conexão e tente novamente. Se continuar, o serviço pode estar fora do ar.
        </p>
        <Button onPress={onRetry} variant="secondary">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">Nenhuma oferta por aqui ainda.</p>
        <p className="text-muted max-w-80 text-sm">
          Você verá as ofertas publicadas que estiverem disponíveis para o seu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {data.data.map((offer) => (
        <OfferListCard data={offer} key={offer.id} onPress={() => push(`/offers/${offer.id}`)} />
      ))}
    </div>
  );
};
