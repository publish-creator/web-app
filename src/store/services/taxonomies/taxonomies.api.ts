import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type { TaxonomyListParams, TaxonomyListResponse } from './taxonomies.types';

const listOf = (path: string, tag: string) => ({
  query: (params: TaxonomyListParams | void) => ({
    url: `/settings/${path}`,
    params: params ?? {},
  }),
  serializeQueryArgs: ({ queryArgs }: { queryArgs: unknown }) =>
    `${tag}:${stableQueryKey((queryArgs ?? {}) as Record<string, unknown>)}`,
});

export const taxonomiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNiches: builder.query<TaxonomyListResponse, TaxonomyListParams | void>(
      listOf('niches', 'niches'),
    ),
    getStructures: builder.query<TaxonomyListResponse, TaxonomyListParams | void>(
      listOf('structures', 'structures'),
    ),
  }),
  overrideExisting: false,
});

export const { useGetNichesQuery, useGetStructuresQuery } = taxonomiesApi;
