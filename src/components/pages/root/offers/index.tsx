'use client';

import { Pagination } from '@/components/composites/pagination/pagination';
import { RootOffersFilters } from '@/components/widgets/root-offers/root-offers-filters';
import { RootOffersTable } from '@/components/widgets/root-offers/root-offers-table';
import { statusParam } from '@/components/widgets/root-offers/root-offers.constants';
import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import { useSearchFilter } from '@/hooks/query/filters/use-search-filter';
import { useTabFilter } from '@/hooks/query/filters/use-tab-filter';
import { useGetOffersQuery } from '@/store/services/offers/offers.api';

const DEFAULT_PAGE_SIZE = 20;

export default function RootOffersPage() {
  const { page, limit, setPage } = usePaginationFilter({ limit: DEFAULT_PAGE_SIZE });
  const { search, inputValue, onInputChange, clearSearch } = useSearchFilter();
  const { tab, setTab } = useTabFilter({ defaultTab: 'all', resetPageOnChange: true });

  const status = statusParam(tab);
  const hasFilters = Boolean(search) || Boolean(status);

  const offers = useGetOffersQuery({
    page,
    pageSize: limit,
    orderBy: 'createdAt',
    order: 'desc',
    ...(search ? { filter: search } : {}),
    ...(status ? { status } : {}),
  });

  const meta = offers.data?.meta;

  const clearFilters = () => {
    clearSearch();
    setTab('all');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ofertas</h1>
        <p className="text-muted text-sm">
          {meta ? `${meta.total} no catálogo, incluindo rascunho e inativa.` : 'Todo o catálogo.'}
        </p>
      </div>

      <RootOffersFilters
        onSearchChange={onInputChange}
        onTabChange={setTab}
        search={inputValue}
        tab={tab ?? 'all'}
      />

      <RootOffersTable
        data={offers.data}
        hasFilters={hasFilters}
        isError={offers.isError}
        isLoading={offers.isLoading}
        onClearFilters={clearFilters}
        onRetry={() => void offers.refetch()}
      />

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
