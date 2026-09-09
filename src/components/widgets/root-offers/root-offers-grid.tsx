'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import { OfferListCard } from '@/components/widgets/offers/offer-list-card';
import type { OffersListResponse } from '@/store/services/offers/offers.types';

import { STATUS_LABEL, STATUS_TONE } from './root-offers.constants';

interface RootOffersGridProps {
  data: OffersListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
}

const SKELETON_COUNT = 6;

const GRID = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

export const RootOffersGrid = ({
  data,
  isLoading,
  isError,
  hasFilters,
  onRetry,
  onClearFilters,
}: RootOffersGridProps) => {
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
    return hasFilters ? (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Nenhuma oferta encontrada com esses filtros.</p>
        <p className="text-muted max-w-96 text-sm">
          O catálogo não está vazio — só não há nada que combine com o que você procurou.
        </p>
        <Button onPress={onClearFilters} variant="secondary">
          Limpar filtros
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium">Nenhuma oferta cadastrada ainda.</p>
        <p className="text-muted max-w-96 text-sm">
          Quando a primeira for criada, ela aparece aqui com rascunho, publicada e inativa juntas.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {data.data.map((offer) => (
        <OfferListCard
          action={
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold ${STATUS_TONE[offer.status]}`}
            >
              {STATUS_LABEL[offer.status]}
            </span>
          }
          data={offer}
          key={offer.id}
          onPress={() => push(`/root/offers/${offer.id}`)}
        />
      ))}
    </div>
  );
};
