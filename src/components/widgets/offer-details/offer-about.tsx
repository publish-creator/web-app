'use client';

import { useOffer } from './use-offer';

export const OfferAbout = () => {
  const { data: offer } = useOffer();

  if (!offer) return null;

  return (
    <div className="flex max-w-140 flex-col gap-2">
      <p className="text-base font-semibold">Sobre esta oferta</p>
      <p className="text-muted text-sm whitespace-pre-line">
        {offer.description ?? 'Esta oferta ainda não tem descrição.'}
      </p>
      {offer.countries.length > 0 ? (
        <p className="text-muted mt-2 text-sm">
          <span className="text-foreground font-medium">Alcance:</span> {offer.countries.join(', ')}
        </p>
      ) : null}
      {offer.pvUrl ? (
        <a
          className="text-accent text-sm no-underline hover:underline"
          href={offer.pvUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          Ver página de vendas
        </a>
      ) : null}
    </div>
  );
};
