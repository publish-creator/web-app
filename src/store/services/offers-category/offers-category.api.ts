import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type { OffersCategoryListParams, OffersCategoryListResponse } from './offers-category.types';

export const offersCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOffersCategories: builder.query<OffersCategoryListResponse, OffersCategoryListParams | void>(
      {
        query: (params) => ({
          url: '/labs/category',
          params: params ?? {},
        }),
        serializeQueryArgs: ({ queryArgs }) =>
          stableQueryKey((queryArgs ?? {}) as Record<string, unknown>),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({ type: 'OffersCategory' as const, id })),
                { type: 'OffersCategory', id: 'LIST' },
              ]
            : [{ type: 'OffersCategory', id: 'LIST' }],
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetOffersCategoriesQuery } = offersCategoryApi;
