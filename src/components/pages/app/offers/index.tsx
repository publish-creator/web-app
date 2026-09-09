'use client';

import { OffersCategories } from '@/components/widgets/offers/offers-categories';
import { OffersHeader } from '@/components/widgets/offers/offers-header';
import { OffersList } from '@/components/widgets/offers/offers-list';
import { OffersRecentViewed } from '@/components/widgets/offers/offers-recent-viewed';
import { usePaginationFilter } from '@/hooks/query/filters/use-pagination-filter';
import { useGetOffersCategoriesQuery } from '@/store/services/offers-category/offers-category.api';
import { useGetOffersQuery } from '@/store/services/offers/offers.api';

const RECENT_COUNT = 7;

const DEFAULT_PAGE_SIZE = 12;

const MAX_PAGE_SIZE = 100;

export const OffersPage = () => {
  const { page, limit, setPage } = usePaginationFilter({ limit: DEFAULT_PAGE_SIZE });

  const pageSize = Math.min(limit, MAX_PAGE_SIZE);

  const offers = useGetOffersQuery({ page, pageSize, orderBy: 'createdAt', order: 'desc' });
  const recent = useGetOffersQuery({
    page: 1,
    pageSize: RECENT_COUNT,
    orderBy: 'createdAt',
    order: 'desc',
  });
  const { data: offersCategories } = useGetOffersCategoriesQuery({ page: 1, pageSize: 11 });

  return (
    <div className="container-wrapper">
      <OffersHeader total={offers.data?.meta.total} />
      <OffersCategories data={offersCategories} />
      <OffersRecentViewed data={recent.data} />
      <OffersList
        data={offers.data}
        isError={offers.isError}
        isLoading={offers.isLoading}
        onPageChange={setPage}
        onRetry={() => void offers.refetch()}
      />
    </div>
  );
};
