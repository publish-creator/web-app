'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import { OfferContentLeft } from '@/components/widgets/offer-details';
import { useOffer } from '@/components/widgets/offer-details/use-offer';

export const OfferDetailsPage = () => {
  const router = useRouter();
  const { isError, isLoading } = useOffer();

  /**
   * The API answers 404 both for an offer that does not exist and for one this caller may not see —
   * a draft, or one outside their reach. Telling those apart would say which ids are real, so the
   * screen says the same thing for both.
   */
  if (isError && !isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Oferta não encontrada</p>
        <p className="text-muted max-w-96 text-sm">
          Ela pode ter sido removida, ou não estar disponível para o seu perfil.
        </p>
        <Button onPress={() => router.push('/offers')} variant="secondary">
          Voltar para as ofertas
        </Button>
      </div>
    );
  }

  return <OfferContentLeft />;
};
