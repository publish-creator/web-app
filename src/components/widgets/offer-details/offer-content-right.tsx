import { OfferApply } from './offer-apply';
import { OfferBuyLinks } from './offer-buy-links';

export const OfferContentRight = () => {
  return (
    <div className="sticky top-20 flex h-fit flex-col gap-4">
      <OfferApply />
      <OfferBuyLinks />
    </div>
  );
};
