import { OfferHeader, OfferContentRight } from '@/components/widgets/offer-details';

export const OfferTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-wrapper grid! h-full grid-cols-[auto_480px]! gap-6">
      <div className="relative flex flex-col gap-4">
        <OfferHeader />
        {children}
      </div>

      <OfferContentRight />
    </div>
  );
};
