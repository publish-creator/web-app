'use client';

import { Pencil, Plus, TrashBin } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, Chip, Table } from '@heroui/react';

import type { BuyLink, BuyLinkWriteBody } from '@/store/services/offers/offer-details.types';
import {
  useCreateOfferBuyLinkMutation,
  useDeleteOfferBuyLinkMutation,
  useGetOfferBuyLinksQuery,
  useUpdateOfferBuyLinkMutation,
} from '@/store/services/offers/offers.api';
import type { Offer } from '@/store/services/offers/offers.types';

import { RootOfferBuyLinksDialog } from './root-offer-buy-links-dialog';

interface RootOfferBuyLinksTabProps {
  offer: Offer;
}

const formatPrice = (value: string, currency: string | null) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);
};

export const RootOfferBuyLinksTab = ({ offer }: RootOfferBuyLinksTabProps) => {
  const { data, isLoading } = useGetOfferBuyLinksQuery(offer.id);
  const [createLink] = useCreateOfferBuyLinkMutation();
  const [updateLink] = useUpdateOfferBuyLinkMutation();
  const [deleteLink] = useDeleteOfferBuyLinkMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BuyLink | null>(null);

  const links = data?.data ?? [];

  const saveLink = async (body: BuyLinkWriteBody) => {
    if (editing) {
      await updateLink({ offerId: offer.id, id: editing.id, body }).unwrap();
      return;
    }

    await createLink({ offerId: offer.id, body }).unwrap();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted max-w-lg text-sm">
          Destinos de checkout desta oferta. O código do link é gerado no servidor.
        </p>
        <Button
          onPress={() => {
            setEditing(null);
            setIsOpen(true);
          }}
        >
          <Plus className="size-4" />
          Novo buy link
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted text-sm">Carregando buy links…</p>
      ) : links.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Nenhum buy link nesta oferta.</p>
          <p className="text-muted max-w-96 text-sm">
            Crie o primeiro para o afiliado ter um destino de venda.
          </p>
        </div>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Buy links da oferta">
              <Table.Header>
                <Table.Column isRowHeader>Código</Table.Column>
                <Table.Column>Título</Table.Column>
                <Table.Column>Valor</Table.Column>
                <Table.Column>Alcance</Table.Column>
                <Table.Column>URL</Table.Column>
                <Table.Column />
              </Table.Header>
              <Table.Body>
                {links.map((link) => (
                  <Table.Row key={link.id}>
                    <Table.Cell className="max-w-36">
                      <p className="truncate font-mono text-xs">{link.code}</p>
                    </Table.Cell>
                    <Table.Cell className="max-w-48">
                      <div className="flex min-w-0 items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element -- URL colada pelo admin */}
                        <img
                          alt=""
                          className="size-8 shrink-0 rounded-md object-cover"
                          src={link.imageUrl ?? 'https://placehold.co/32x32'}
                        />
                        <p className="truncate text-sm font-medium">{link.title}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-sm">{formatPrice(link.value, offer.currency)}</p>
                      {link.cpa ? (
                        <p className="text-muted text-xs">
                          CPA {formatPrice(link.cpa, offer.currency)}
                        </p>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell>
                      {link.isAvailableForAllUsers ? (
                        <Chip size="sm" variant="soft">
                          Todos
                        </Chip>
                      ) : (
                        <Chip size="sm" variant="soft">
                          {link.allowedUserIds.length}{' '}
                          {link.allowedUserIds.length === 1 ? 'afiliado' : 'afiliados'}
                        </Chip>
                      )}
                    </Table.Cell>
                    <Table.Cell className="max-w-56">
                      <p className="text-muted truncate text-xs">{link.url}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end gap-1">
                        <Button
                          onPress={() => {
                            setEditing(link);
                            setIsOpen(true);
                          }}
                          size="sm"
                          variant="tertiary"
                        >
                          <Pencil className="size-4" />
                          Editar
                        </Button>
                        <Button
                          className="text-danger"
                          onPress={() => void deleteLink({ offerId: offer.id, id: link.id })}
                          size="sm"
                          variant="tertiary"
                        >
                          <TrashBin className="size-4" />
                          Remover
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <RootOfferBuyLinksDialog
        editing={editing}
        isOpen={isOpen}
        offerCode={offer.code}
        offerTitle={offer.title}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmitLink={saveLink}
      />
    </div>
  );
};
