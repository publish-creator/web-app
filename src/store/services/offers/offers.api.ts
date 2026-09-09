import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  BuyLinksResponse,
  OfferCreativesResponse,
  OfferSubListParams,
} from './offer-details.types';
import type { Offer, OfferUpdateArgs, OffersListParams, OffersListResponse } from './offers.types';

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

    getOffer: builder.query<Offer, string>({
      query: (id) => ({ url: `/offers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Offers', id }],
    }),

    updateOffer: builder.mutation<{ id: string }, OfferUpdateArgs>({
      query: ({ id, body }) => ({ url: `/offers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Offers', id },
        { type: 'Offers', id: 'LIST' },
      ],
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
  useUpdateOfferMutation,
  useGetOfferBuyLinksQuery,
  useGetOfferCreativesQuery,
} = offersApi;
