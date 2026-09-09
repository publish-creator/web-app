import { Pagination } from '@/components/composites/pagination/pagination';
import type { OffersListResponse } from '@/store/services/offers/offers.types';

import { OffersListContent } from './offer-list-content';
import { OffersListHeader } from './offers-list-header';

interface OffersListProps {
  data: OffersListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

export const OffersList = ({
  data,
  isLoading,
  isError,
  onRetry,
  onPageChange,
}: OffersListProps) => {
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <OffersListHeader total={meta?.total} />
      <OffersListContent
        data={data}
        isError={isError}
        isLoading={isLoading}
        onBackToFirstPage={() => onPageChange(1)}
        onRetry={onRetry}
      />
      {meta && (meta.totalPages > 1 || meta.page > 1) ? (
        <Pagination
          onPageChange={onPageChange}
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      ) : null}
    </div>
  );
};
