import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  BuyLinksResponse,
  OfferCreativesResponse,
  OfferSubListParams,
} from './offer-details.types';
import type { Offer, OffersListParams, OffersListResponse } from './offers.types';

export const offersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query<OffersListResponse, OffersListParams | void>({
      query: (params) => ({
        url: '/offers',
        params: params ?? {},
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        stableQueryKey((queryArgs ?? {}) as Record<string, unknown>),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Offers' as const, id })),
              { type: 'Offers', id: 'LIST' },
            ]
          : [{ type: 'Offers', id: 'LIST' }],
    }),

    /**
     * The same shape as an item of the listing. An offer the caller may not see answers 404, never
     * 403 — a 403 on something that exists and a 404 on something that does not would tell an
     * outsider which ids are real.
     */
    getOffer: builder.query<Offer, string>({
      query: (id) => ({ url: `/offers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Offers', id }],
    }),

    getOfferBuyLinks: builder.query<BuyLinksResponse, string>({
      query: (offerId) => ({ url: `/offers/${offerId}/buy-links` }),
      providesTags: (_result, _error, offerId) => [{ type: 'Offers', id: `${offerId}:buy-links` }],
    }),

    getOfferCreatives: builder.query<
      OfferCreativesResponse,
      { offerId: string } & OfferSubListParams
    >({
      query: ({ offerId, ...params }) => ({ url: `/offers/${offerId}/creatives`, params }),
      serializeQueryArgs: ({ queryArgs }) => stableQueryKey(queryArgs as Record<string, unknown>),
      providesTags: (_result, _error, { offerId }) => [
        { type: 'Offers', id: `${offerId}:creatives` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOffersQuery,
  useGetOfferQuery,
  useGetOfferBuyLinksQuery,
  useGetOfferCreativesQuery,
} = offersApi;
