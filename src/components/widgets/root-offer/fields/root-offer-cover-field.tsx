'use client';

import { useRef, useState } from 'react';

import { Button } from '@heroui/react';

import { useCreateUploadMutation } from '@/store/services/uploads/uploads.api';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_BYTES = 10 * 1024 * 1024;

type NextImage = { previewUrl: string | null; uploadId: string | null };

interface RootOfferCoverFieldProps {
  value: string;
  alt?: string;
  emptyHint?: string;
  compact?: boolean;
  onChange?: (next: NextImage) => void;
}

const heightClass = (compact: boolean) => (compact ? 'min-h-40' : 'min-h-56');

export const RootOfferCoverField = ({
  value,
  alt = 'Capa da oferta',
  emptyHint = 'Sem capa. O card da listagem usa uma imagem genérica.',
  compact = false,
  onChange,
}: RootOfferCoverFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [createUpload, { isLoading }] = useCreateUploadMutation();

  const pick = () => inputRef.current?.click();

  const onFile = async (file: File | undefined) => {
    if (!onChange || !file) return;

    if (!ACCEPT.split(',').includes(file.type)) {
      setError('Use JPEG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setError('A imagem pode ter no máximo 10 MB.');
      return;
    }

    setError(null);
    const localUrl = URL.createObjectURL(file);
    onChange({ previewUrl: localUrl, uploadId: null });

    try {
      const uploaded = await createUpload(file).unwrap();
      onChange({ previewUrl: uploaded.url, uploadId: uploaded.id });
    } catch (caught) {
      const fromApi =
        caught &&
        typeof caught === 'object' &&
        'data' in caught &&
        caught.data &&
        typeof caught.data === 'object' &&
        'message' in caught.data
          ? String((caught.data as { message: unknown }).message)
          : null;

      setError(fromApi || 'Não foi possível enviar a imagem. Tente de novo.');
      onChange({ previewUrl: value || null, uploadId: null });
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  const box = value ? (
    <div
      className={`bg-surface-secondary h-full ${heightClass(compact)} w-full overflow-hidden rounded-xl`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- capa/upload de host arbitrário; next/image exigiria allowlist */}
      <img alt={alt} className={`h-full ${heightClass(compact)} w-full object-cover`} src={value} />
    </div>
  ) : (
    <div
      className={`border-border text-muted flex h-full ${heightClass(compact)} w-full items-center justify-center rounded-xl border border-dashed px-4 text-center text-xs`}
    >
      {isLoading ? 'Enviando imagem…' : emptyHint}
    </div>
  );

  if (!onChange) return box;

  return (
    <div className="flex flex-col gap-2">
      <input
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => void onFile(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />
      <button className="w-full text-left" onClick={pick} type="button">
        {box}
      </button>
      <div className="flex flex-wrap gap-2">
        <Button isPending={isLoading} onPress={pick} size="sm" variant="secondary">
          {value ? 'Trocar imagem' : 'Enviar imagem'}
        </Button>
        {value ? (
          <Button
            onPress={() => {
              setError(null);
              onChange({ previewUrl: null, uploadId: null });
            }}
            size="sm"
            variant="tertiary"
          >
            Remover
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
};
