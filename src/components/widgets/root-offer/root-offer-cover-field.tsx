'use client';

import { Description } from '@heroui/react';

import { TextField } from '@/components/composites';

interface RootOfferCoverFieldProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | undefined;
}

export const RootOfferCoverField = ({
  value,
  onChange,
  errorMessage,
}: RootOfferCoverFieldProps) => (
  <div className="flex flex-col gap-3">
    {value ? (
      <div className="bg-surface-secondary w-full overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- a capa vem de um host arbitrário que o admin cola; next/image exigiria allowlist */}
        <img alt="Prévia da capa" className="aspect-[2/1] w-full object-cover" src={value} />
      </div>
    ) : (
      <div className="border-border text-muted flex aspect-[2/1] w-full items-center justify-center rounded-xl border border-dashed px-4 text-center text-xs">
        Sem capa. O card da listagem usa uma imagem genérica.
      </div>
    )}

    <TextField
      aria-label="Imagem de capa"
      errorMessage={errorMessage}
      onChange={onChange}
      placeholder="https://..."
      value={value}
      variant="secondary"
    />
    <Description className="text-xs">Cole a URL da imagem. A prévia atualiza sozinha.</Description>
  </div>
);
