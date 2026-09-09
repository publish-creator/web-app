'use client';

interface RootOfferCoverFieldProps {
  value: string;
}

export const RootOfferCoverField = ({ value }: RootOfferCoverFieldProps) =>
  value ? (
    <div className="bg-surface-secondary h-full min-h-56 w-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element -- a capa vem de um host arbitrário; next/image exigiria allowlist */}
      <img alt="Capa da oferta" className="h-full min-h-56 w-full object-cover" src={value} />
    </div>
  ) : (
    <div className="border-border text-muted flex h-full min-h-56 w-full items-center justify-center rounded-xl border border-dashed px-4 text-center text-xs">
      Sem capa. O card da listagem usa uma imagem genérica.
    </div>
  );
