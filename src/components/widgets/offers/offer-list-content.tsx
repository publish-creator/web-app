import type { OffersListResponse } from '@/store/services/offers/offers.types';
import { OfferListCard } from './offer-list-card';
import { useRouter } from 'next/navigation';

interface OffersListContentProps {
  data: OffersListResponse | undefined;
}

export const OffersListContent = ({ data }: OffersListContentProps) => {
  const { push } = useRouter();
  const handlePress = (id: string) => {
    push(`/offers/${id}`);
  };
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.data.map((offer) => (
        <OfferListCard data={offer} key={offer.id} onPress={() => handlePress(offer.id)} />
      ))}
    </div>
  );
};
