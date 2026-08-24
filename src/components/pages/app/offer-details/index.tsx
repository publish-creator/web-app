import { OfferContentLeft, OfferContentRight } from '@/components/widgets/offer-details';

export const OfferDetailsPage = () => {
  return (
    <div className="container-wrapper grid! grid-cols-[auto_480px]! gap-6">
      <OfferContentLeft />
      <OfferContentRight />
    </div>
  );
};
