'use client';

import { CopyBoldIcon } from '@solar-icons/react';
import { EyeIcon } from '@solar-icons/react/bold';

import { useState } from 'react';

import { Widget } from '@heroui-pro/react';
import { Button, Table } from '@heroui/react';

import { useGetOfferBuyLinksQuery } from '@/store/services/offers/offers.api';

import { useOffer, useOfferId } from './use-offer';

function formatPrice(value: string, currency: string | null): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);
}

export const OfferBuyLinks = () => {
  const offerId = useOfferId();
  const { data: offer } = useOffer();
  const { data, isLoading, isError } = useGetOfferBuyLinksQuery(offerId, { skip: offerId === '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const links = data?.data ?? [];

  const copy = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
  };

  return (
    <Widget className="bg-surface">
      <Widget.Header className="h-fit">
        <div className="flex flex-col gap-0.5">
          <Widget.Title className="text-base font-semibold">Buy links</Widget.Title>
          <Widget.Description className="text-muted text-sm">
            Os destinos para onde o tráfego desta oferta é enviado.
          </Widget.Description>
        </div>
      </Widget.Header>
      <Widget.Content className="bg-surface-secondary mt-1.5 flex flex-col gap-4 p-0">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="bg-surface h-10 animate-pulse rounded" key={index} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted p-4 text-sm">Não foi possível carregar os buy links.</p>
        ) : links.length === 0 ? (
          <p className="text-muted p-4 text-sm">Esta oferta ainda não tem buy links.</p>
        ) : (
          <Table variant="secondary">
            <Table.Content className="p-0">
              <Table.Header className="sr-only">
                <Table.Column>Nome</Table.Column>
                <Table.Column>Preço</Table.Column>
                <Table.Column>Ações</Table.Column>
              </Table.Header>
              <Table.Body>
                {links.map((link) => (
                  <Table.Row key={link.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element -- an arbitrary host an admin pastes; next/image would need every one allowlisted */}
                        <img
                          alt=""
                          className="rounded-md object-cover"
                          height={32}
                          src={link.imageUrl ?? 'https://placehold.co/32x32'}
                          width={32}
                        />
                        <div>
                          <p className="text-sm font-semibold">{link.title}</p>
                          <p className="text-muted text-xs">
                            {link.type === 'DTC' ? 'DTC' : 'Buy link'}
                            {link.isAvailableForAllUsers ? '' : ' · restrito'}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{formatPrice(link.value, offer?.currency ?? null)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end">
                        <Button
                          aria-label={copiedId === link.id ? 'Link copiado' : 'Copiar link'}
                          isIconOnly
                          onPress={() => void copy(link.id, link.url)}
                          size="sm"
                          variant="ghost"
                        >
                          <CopyBoldIcon />
                        </Button>
                        <Button
                          aria-label="Abrir link"
                          isIconOnly
                          onPress={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                          size="sm"
                          variant="ghost"
                        >
                          <EyeIcon />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        )}
      </Widget.Content>
    </Widget>
  );
};
