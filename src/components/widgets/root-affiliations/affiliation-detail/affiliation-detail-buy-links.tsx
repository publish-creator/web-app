'use client';

import { CopyBoldIcon } from '@solar-icons/react';
import { EyeIcon } from '@solar-icons/react/bold';

import { useMemo, useState } from 'react';

import { Button, Chip } from '@heroui/react';

import type { AffiliationDetail } from '@/store/services/offers/offer-details.types';
import { useGetOfferBuyLinksQuery } from '@/store/services/offers/offers.api';

import { buyLinkAccessFor } from './affiliation-detail-buy-links.access';

interface Props {
  offerId: string;
  userId: string;
  tags: AffiliationDetail['tags'];
  currency: string | null;
}

export const AffiliationDetailBuyLinks = ({ offerId, userId, tags, currency }: Props) => {
  const { data, isLoading } = useGetOfferBuyLinksQuery(offerId, { skip: !offerId });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const reachable = useMemo(
    () =>
      (data?.data ?? [])
        .map((link) => ({ link, access: buyLinkAccessFor(link, userId, tags) }))
        .filter(
          (row): row is { link: (typeof row)['link']; access: NonNullable<typeof row.access> } =>
            Boolean(row.access),
        ),
    [data?.data, tags, userId],
  );

  const copy = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
  };

  return (
    <section className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-5">
      <div>
        <h2 className="text-sm font-semibold">Buy Links</h2>
        <p className="text-muted text-xs">Só os destinos que este afiliado alcança.</p>
      </div>
      {isLoading ? (
        <p className="text-muted text-sm">Carregando links…</p>
      ) : reachable.length === 0 ? (
        <p className="text-muted text-sm">
          Este afiliado ainda não alcança nenhum buy link desta oferta.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {reachable.map(({ link, access }) => (
            <li
              className="bg-surface-secondary flex items-center gap-3 rounded-xl px-3 py-2.5"
              key={link.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary host */}
              <img
                alt=""
                className="size-10 shrink-0 rounded-md object-cover"
                src={link.imageUrl ?? 'https://placehold.co/40x40'}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{link.title}</p>
                <p className="text-muted truncate text-xs">{link.url}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {access.viaEveryone ? (
                    <Chip size="sm" variant="soft">
                      Todos
                    </Chip>
                  ) : null}
                  {access.viaUser ? (
                    <Chip size="sm" variant="soft">
                      Afiliado
                    </Chip>
                  ) : null}
                  {access.viaTags.map((tag) => (
                    <Chip key={tag.id} size="sm" variant="soft">
                      Tag: {tag.name}
                    </Chip>
                  ))}
                </div>
              </div>
              <span className="text-muted hidden text-xs sm:inline">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: currency || 'BRL',
                }).format(Number(link.value))}
              </span>
              <Button
                aria-label={copiedId === link.id ? 'Copiado' : 'Copiar'}
                isIconOnly
                onPress={() => void copy(link.id, link.url)}
                size="sm"
                variant="ghost"
              >
                <CopyBoldIcon />
              </Button>
              <Button
                aria-label="Abrir"
                isIconOnly
                onPress={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                size="sm"
                variant="ghost"
              >
                <EyeIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
