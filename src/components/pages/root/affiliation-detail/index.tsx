'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button, Skeleton } from '@heroui/react';

import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';
import {
  useGetAdminAffiliationQuery,
  useSetAffiliationStatusMutation,
} from '@/store/services/offers/offers.api';
import {
  AffiliationDetailActions,
  AffiliationDetailBuyLinks,
  AffiliationDetailHeader,
  AffiliationDetailInfo,
  AffiliationDetailInvite,
} from '@/widgets/root-affiliations';

export function RootAffiliationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? '';

  const { data, isLoading, isError } = useGetAdminAffiliationQuery(id, { skip: !id });
  const [setStatus, { isLoading: isDeciding }] = useSetAffiliationStatusMutation();

  if (isLoading) {
    return (
      <div className="container-wrapper flex flex-col gap-4">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-wrapper flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Solicitação não encontrada</p>
        <p className="text-muted max-w-96 text-sm">
          O pedido pode ter sido removido, ou o identificador na URL não corresponde a nenhum.
        </p>
        <Button onPress={() => router.push('/root/affiliations')} variant="secondary">
          Voltar para afiliados
        </Button>
      </div>
    );
  }

  const decide = async (status: AffiliationStatus) => {
    await setStatus({ offerId: data.offerId, id: data.id, status }).unwrap();
  };

  return (
    <div className="container-wrapper flex flex-col gap-5">
      <AffiliationDetailHeader data={data} onBack={() => router.push('/root/affiliations')} />
      <AffiliationDetailInfo data={data} />
      <AffiliationDetailInvite data={data} />
      <AffiliationDetailBuyLinks
        currency={data.offer?.currency ?? null}
        offerId={data.offerId}
        tags={data.tags}
        userId={data.userId}
      />
      <AffiliationDetailActions
        isLoading={isDeciding}
        onDecide={(status) => void decide(status)}
        status={data.status}
      />
    </div>
  );
}
