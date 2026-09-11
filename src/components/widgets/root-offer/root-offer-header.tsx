'use client';

import type { ReactNode } from 'react';

import type { Offer } from '@/store/services/offers/offers.types';
import { STATUS_LABEL, STATUS_TONE } from '@/widgets/root-offers';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));

export const RootOfferHeader = ({ offer, actions }: { offer: Offer; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="truncate text-xl font-semibold tracking-tight">{offer.title}</h1>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] leading-none font-semibold ${STATUS_TONE[offer.status]}`}
        >
          {STATUS_LABEL[offer.status]}
        </span>
      </div>
      <p className="text-muted font-mono text-xs">
        {offer.code}
        <span className="mx-1.5">·</span>
        {formatDate(offer.createdAt)}
      </p>
    </div>
    {actions}
  </div>
);
