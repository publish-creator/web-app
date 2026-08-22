import type { OffersListResponse } from '@/store/services/offers/offers.types';
import { OffersListContent } from './offer-list-content';
import { OffersListHeader } from './offers-list-header';

interface OffersListProps {
  data: OffersListResponse | undefined;
}

export const OffersList = ({ data }: OffersListProps) => {
  return (
    <div className="space-y-4">
      <OffersListHeader />
      <OffersListContent data={data} />
    </div>
  );
};
