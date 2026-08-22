import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type { OffersListParams, OffersListResponse } from './offers.types';

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
  }),
  overrideExisting: false,
});

export const { useGetOffersQuery } = offersApi;
