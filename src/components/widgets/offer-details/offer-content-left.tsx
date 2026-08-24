import { OfferAbout } from './offer-about';
import { OfferCreative } from './offer-creative';
import { OfferHeader } from './offer-header';
import { OfferInformation } from './offer-information';
import { OfferTerms } from './offer-terms';

export const OfferContentLeft = () => {
  return (
    <div className="flex flex-col gap-4">
      <OfferHeader />
      <OfferInformation />
      <OfferAbout />
      <OfferTerms />
      <OfferCreative />
    </div>
  );
};
