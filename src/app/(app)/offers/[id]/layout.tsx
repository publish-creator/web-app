'use client';

import { OfferTemplate } from '@/components/templates/offer';

export default function OfferDetailsLayout({ children }: { children: React.ReactNode }) {
  return <OfferTemplate>{children}</OfferTemplate>;
}
