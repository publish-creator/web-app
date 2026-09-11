'use client';

import { Button, Card } from '@heroui/react';

import { messageFromError } from '@/lib/api/error-message';
import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';
import {
  useGetMyAffiliationsQuery,
  useRequestOfferAffiliationMutation,
} from '@/store/services/offers/offers.api';

import { useOffer, useOfferId } from './use-offer';

const IDLE = {
  title: 'Interessado nesta oferta?',
  body: 'Peça o acesso. Se a oferta aprovar na hora, você entra já afiliado. Se não, o pedido fica em análise.',
  action: 'Solicitar acesso',
  canRequest: true,
} as const;

const BY_STATUS: Record<
  AffiliationStatus,
  { title: string; body: string; action: string; canRequest: false }
> = {
  PENDING: {
    title: 'Pedido em análise',
    body: 'Sua solicitação já foi enviada. Assim que for decidida, o status muda aqui.',
    action: 'Aguardando decisão',
    canRequest: false,
  },
  APPROVED: {
    title: 'Você já é afiliado',
    body: 'Esta oferta está liberada para você. Use os buy links ao lado para promover.',
    action: 'Afiliado',
    canRequest: false,
  },
  REJECTED: {
    title: 'Pedido recusado',
    body: 'Esta solicitação não foi aprovada. Fale com o time se precisar de uma nova avaliação.',
    action: 'Recusado',
    canRequest: false,
  },
  CANCELED: {
    title: 'Afiliação cancelada',
    body: 'Este acesso não está mais ativo nesta oferta.',
    action: 'Cancelado',
    canRequest: false,
  },
};

export const OfferApply = () => {
  const offerId = useOfferId();
  const { data: offer } = useOffer();
  const mine = useGetMyAffiliationsQuery(
    { offerId, page: 1, pageSize: 1 },
    { skip: offerId === '' },
  );
  const [requestAccess, { isLoading, error }] = useRequestOfferAffiliationMutation();

  const current = mine.data?.data[0];
  const copy = current ? BY_STATUS[current.status] : IDLE;
  const published = offer?.status === 'PUBLISHED';
  const canRequest = copy.canRequest && published;

  return (
    <Card>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-base font-semibold">{copy.title}</p>
          <p className="text-muted text-sm">
            {!published && !current
              ? 'Esta oferta ainda não está aceitando pedidos de afiliação.'
              : copy.body}
          </p>
        </div>
        <Button
          className="w-full"
          isDisabled={!canRequest || isLoading || mine.isLoading}
          onPress={() => void requestAccess({ offerId }).unwrap()}
        >
          {isLoading ? 'Enviando…' : copy.action}
        </Button>
        {error ? <p className="text-danger text-sm">{messageFromError(error)}</p> : null}
      </Card.Content>
    </Card>
  );
};
