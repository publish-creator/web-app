import { OffersCategories } from '@/components/widgets/offers/offers-categories';
import { OffersHeader } from '@/components/widgets/offers/offers-header';
import { OffersList } from '@/components/widgets/offers/offers-list';
import { OffersRecentViewed } from '@/components/widgets/offers/offers-recent-viewed';

export const OffersPage = () => {
  return (
    <div className="flex h-full flex-col gap-8 px-20 pb-8">
      <OffersHeader />
      <OffersCategories />
      <OffersRecentViewed />
      <OffersList />
    </div>
  );
};
