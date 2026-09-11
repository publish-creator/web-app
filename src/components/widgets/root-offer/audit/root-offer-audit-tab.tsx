'use client';

import { Button, Skeleton } from '@heroui/react';

import { Pagination } from '@/components/composites/pagination/pagination';
import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import { useGetOfferAuditQuery } from '@/store/services/offers/offers.api';

import { RootOfferAuditTable } from './root-offer-audit-table';

const PAGE_SIZE = 20;

interface Props {
  offerId: string;
}

const AuditSkeleton = () => (
  <div aria-busy aria-live="polite" className="flex flex-col gap-2">
    {Array.from({ length: 8 }, (_, index) => (
      <Skeleton className="h-12 w-full rounded-xl" key={index} />
    ))}
  </div>
);

export const RootOfferAuditTab = ({ offerId }: Props) => {
  const { page, limit, setPage } = usePaginationFilter({ limit: PAGE_SIZE, pageKey: 'auditPage' });
  const { data, isLoading, isFetching, isError, refetch } = useGetOfferAuditQuery({
    offerId,
    page,
    pageSize: limit,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;
  const waiting = isLoading || (isFetching && !data);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted max-w-lg text-sm">
        Histórico desta oferta. Clique em uma linha para ver o antes, o depois e o contexto da
        requisição.
      </p>

      {waiting ? (
        <AuditSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm font-medium">Não foi possível carregar o histórico.</p>
          <p className="text-muted max-w-96 text-sm">
            Verifique sua conexão e tente de novo. Se continuar, o serviço pode estar fora do ar.
          </p>
          <Button onPress={() => void refetch()} variant="secondary">
            Tentar novamente
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Nenhuma alteração registrada</p>
          <p className="text-muted max-w-96 text-sm">
            Quando alguém mudar a oferta, o buy-link, a comissão ou a afiliação, o registro aparece
            aqui.
          </p>
        </div>
      ) : (
        <div className={isFetching ? 'opacity-60' : undefined}>
          <RootOfferAuditTable offerId={offerId} rows={rows} />
        </div>
      )}

      {meta && (meta.totalPages > 1 || meta.page > 1) ? (
        <Pagination
          onPageChange={setPage}
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      ) : null}
    </div>
  );
};
