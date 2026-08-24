import { OfferApply } from './offer-apply';
import { OfferBuyLinks } from './offer-buy-links';

export const OfferContentRight = () => {
  return (
    <div className="flex flex-col gap-4">
      <OfferBuyLinks />
      <OfferApply />
    </div>
  );
};
