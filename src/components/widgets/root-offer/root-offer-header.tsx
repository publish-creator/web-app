'use client';

import { STATUS_LABEL, STATUS_TONE } from '@/components/widgets/root-offers/root-offers.constants';
import type { Offer } from '@/store/services/offers/offers.types';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));

export const RootOfferHeader = ({ offer }: { offer: Offer }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{offer.title}</h1>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold ${STATUS_TONE[offer.status]}`}
        >
          {STATUS_LABEL[offer.status]}
        </span>
      </div>
      <p className="text-muted text-sm">
        {offer.code} · criada em {formatDate(offer.createdAt)}
      </p>
    </div>
  </div>
);
