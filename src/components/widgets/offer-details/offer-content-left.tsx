import { OfferAbout } from './offer-about';
import { OfferCreative } from './offer-creative';
import { OfferInformation } from './offer-information';

export const OfferContentLeft = () => {
  return (
    <div className="flex flex-col gap-6">
      <OfferInformation />
      <OfferAbout />
      <OfferCreative />
    </div>
  );
};
