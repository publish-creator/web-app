import { Chip } from '@heroui/react';

import type { OfferCreative } from '@/store/services/offers/offer-details.types';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Its own card rather than the one from the creative library, which takes no props and is used by
 * another screen — repurposing it would have changed that screen too.
 */
export function OfferCreativeCard({ creative }: { creative: OfferCreative }) {
  return (
    <a
      className="hover:bg-surface-hover group flex cursor-pointer flex-col rounded-2xl p-1 no-underline transition-colors duration-200"
      href={creative.url}
      rel="noreferrer noopener"
      target="_blank"
    >
      <div className="bg-surface aspect-3/4 overflow-hidden rounded-2xl">
        {creative.kind === 'VIDEO' ? (
          <video className="size-full object-cover" muted preload="metadata" src={creative.url} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- a signed URL that expires; next/image would cache a link that stops working
          <img
            alt={creative.title}
            className="size-full object-cover"
            loading="lazy"
            src={creative.url}
          />
        )}
      </div>
      <div className="px-2">
        <p className="group-hover:text-primary truncate text-sm font-semibold">{creative.title}</p>
        <div className="mt-1 flex items-center gap-1">
          <Chip className="bg-surface-secondary text-muted group-hover:bg-surface" color="default">
            {creative.kind === 'VIDEO' ? 'Vídeo' : 'Imagem'}
          </Chip>
          <Chip className="bg-surface-secondary text-muted group-hover:bg-surface" color="default">
            {formatSize(creative.sizeBytes)}
          </Chip>
        </div>
      </div>
    </a>
  );
}
