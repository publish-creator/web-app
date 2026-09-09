'use client';

import { useParams } from 'next/navigation';

import { useGetOfferQuery } from '@/store/services/offers/offers.api';

export function useOffer() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  return useGetOfferQuery(id, { skip: id === '' });
}

export function useOfferId(): string {
  const params = useParams<{ id: string }>();

  return params?.id ?? '';
}
