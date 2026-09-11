'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button, Skeleton } from '@heroui/react';

import { useGetOfferAuditEntryQuery, useGetOfferQuery } from '@/store/services/offers/offers.api';
import { RootOfferAuditDetail } from '@/widgets/root-offer';

export function RootOfferAuditDetailPage() {
  const params = useParams<{ id: string; entryId: string }>();
  const router = useRouter();
  const offerId = params?.id ?? '';
  const entryId = params?.entryId ?? '';
  const back = `/root/offers/${offerId}?tab=auditoria`;

  const offer = useGetOfferQuery(offerId, { skip: !offerId });
  const entry = useGetOfferAuditEntryQuery({ offerId, entryId }, { skip: !offerId || !entryId });

  if (offer.isLoading || entry.isLoading) {
    return (
      <div className="container-wrapper flex flex-col gap-4">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (entry.isError || !entry.data) {
    return (
      <div className="container-wrapper flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Registro de auditoria não encontrado</p>
        <p className="text-muted max-w-96 text-sm">
          Ele pode ter sido de outra oferta, ou o identificador na URL não corresponde a nenhum.
        </p>
        <Button onPress={() => router.push(back)} variant="secondary">
          Voltar para a auditoria
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wrapper">
      <RootOfferAuditDetail
        entry={entry.data}
        offer={offer.data ?? null}
        onBack={() => router.push(back)}
      />
    </div>
  );
}
