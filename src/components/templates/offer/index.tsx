import { OfferHeader, OfferContentRight } from '@/components/widgets/offer-details';

export const OfferTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-wrapper grid h-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_480px]">
      <div className="relative flex flex-col gap-4">
        <OfferHeader />
        {children}
      </div>

      <OfferContentRight />
    </div>
  );
};
