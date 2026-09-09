'use client';

import { useParams } from 'next/navigation';

import { useGetOfferQuery } from '@/store/services/offers/offers.api';

/**
 * The offer is needed on both sides of the two-column layout, and the two sides are separate
 * children of the route layout — there is no shared parent to pass it down from. Each widget asks
 * for it instead: RTK Query keys the request by the id, so several callers in one render produce a
 * single network request and share the cached answer.
 */
export function useOffer() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  return useGetOfferQuery(id, { skip: id === '' });
}

export function useOfferId(): string {
  const params = useParams<{ id: string }>();

  return params?.id ?? '';
}
