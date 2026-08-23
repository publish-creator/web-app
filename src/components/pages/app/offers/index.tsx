'use client';

import { OffersCategories } from '@/components/widgets/offers/offers-categories';
import { OffersHeader } from '@/components/widgets/offers/offers-header';
import { OffersList } from '@/components/widgets/offers/offers-list';
import { OffersRecentViewed } from '@/components/widgets/offers/offers-recent-viewed';
import { useGetOffersCategoriesQuery } from '@/store/services/offers-category/offers-category.api';
import { useGetOffersQuery } from '@/store/services/offers/offers.api';

export const OffersPage = () => {
  const { data: offersCategories } = useGetOffersCategoriesQuery({ page: 1, pageSize: 11 });
  const { data: recentOffers } = useGetOffersQuery({ page: 1, pageSize: 7 });
  const { data: offers } = useGetOffersQuery({ page: 2, pageSize: 12 });
  console.log(offersCategories);
  return (
    <div className="flex h-full flex-col gap-8 px-20 pb-8">
      <OffersHeader />
      <OffersCategories data={offersCategories} />
      <OffersRecentViewed data={recentOffers} />
      <OffersList data={offers} />
    </div>
  );
};
