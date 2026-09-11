'use client';

import { Pagination } from '@/components/composites/pagination/pagination';
import { useMultiSelectFilter } from '@/hooks/query/filters/use-multi-select-filter';
import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import { useSearchFilter } from '@/hooks/query/filters/use-search-filter';
import { useTabFilter } from '@/hooks/query/filters/use-tab-filter';
import type { AffiliationStatus } from '@/store/services/offers/offer-details.types';
import {
  useGetAdminAffiliationsQuery,
  useGetOffersQuery,
  useSetAffiliationStatusMutation,
} from '@/store/services/offers/offers.api';
import { useGetUserTagsQuery } from '@/store/services/settings';
import {
  FILTER_ALL,
  RootAffiliationsFilters,
  RootAffiliationsKpis,
  RootAffiliationsTable,
} from '@/widgets/root-affiliations';

const DEFAULT_PAGE_SIZE = 20;

const PICKER_PAGE = { page: 1, pageSize: 100 } as const;

export function RootAffiliationsPage() {
  const { page, limit, setPage } = usePaginationFilter({ limit: DEFAULT_PAGE_SIZE });
  const { search, inputValue, onInputChange } = useSearchFilter();
  const { tab, setTab } = useTabFilter({
    defaultTab: FILTER_ALL,
    key: 'status',
    resetPageOnChange: true,
  });
  const { values: userTagIds, setValues: setUserTagIds } = useMultiSelectFilter({
    key: 'userTagIds',
  });
  const { values: offerIds, setValues: setOfferIds } = useMultiSelectFilter({ key: 'offerIds' });
  const status = tab ?? FILTER_ALL;

  const { data: userTags } = useGetUserTagsQuery(PICKER_PAGE);
  const { data: offers } = useGetOffersQuery({
    ...PICKER_PAGE,
    orderBy: 'title',
    order: 'asc',
  });

  const listing = useGetAdminAffiliationsQuery({
    page,
    pageSize: limit,
    ...(search ? { filter: search } : {}),
    ...(status === FILTER_ALL ? {} : { status }),
    ...(userTagIds.length ? { userTagIds: userTagIds.join(',') } : {}),
    ...(offerIds.length ? { offerIds: offerIds.join(',') } : {}),
  });
  const [setStatus] = useSetAffiliationStatusMutation();

  const rows = listing.data?.data ?? [];
  const meta = listing.data?.meta;

  const decide = async (row: (typeof rows)[number], next: AffiliationStatus) => {
    await setStatus({ offerId: row.offerId, id: row.id, status: next }).unwrap();
  };

  return (
    <div className="container-wrapper flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Afiliados</h1>
        <p className="text-muted text-sm">Pedidos e afiliações de todas as ofertas.</p>
      </div>

      <RootAffiliationsKpis counts={listing.data?.counts} />

      <RootAffiliationsFilters
        offerIds={offerIds}
        offerOptions={(offers?.data ?? []).map((offer) => ({ id: offer.id, name: offer.title }))}
        onOfferIdsChange={setOfferIds}
        onSearchChange={onInputChange}
        onStatusChange={setTab}
        onUserTagIdsChange={setUserTagIds}
        search={inputValue}
        status={status}
        userTagIds={userTagIds}
        userTagOptions={userTags?.data ?? []}
      />

      {listing.isLoading ? (
        <p className="text-muted text-sm">Carregando solicitações…</p>
      ) : rows.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Nenhuma solicitação neste filtro.</p>
          <p className="text-muted max-w-96 text-sm">
            Quem pedir acesso a uma oferta, ou for afiliado pelo root, aparece aqui.
          </p>
        </div>
      ) : (
        <RootAffiliationsTable onDecide={(row, next) => void decide(row, next)} rows={rows} />
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
}
