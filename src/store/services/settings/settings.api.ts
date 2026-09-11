import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  CountryGroupListResponse,
  SettingsListParams,
  UserTagListResponse,
} from './settings.types';

const listOf = (path: string, tag: string) => ({
  query: (params: SettingsListParams | void) => ({
    url: `/settings/${path}`,
    params: params ?? {},
  }),
  serializeQueryArgs: ({ queryArgs }: { queryArgs: unknown }) =>
    `${tag}:${stableQueryKey((queryArgs ?? {}) as Record<string, unknown>)}`,
});

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountryGroups: builder.query<CountryGroupListResponse, SettingsListParams | void>(
      listOf('country-groups', 'country-groups'),
    ),
    getUserTags: builder.query<UserTagListResponse, SettingsListParams | void>(
      listOf('user-tags', 'user-tags'),
    ),
  }),
  overrideExisting: false,
});

export const { useGetCountryGroupsQuery, useGetUserTagsQuery } = settingsApi;
