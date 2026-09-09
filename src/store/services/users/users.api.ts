import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  UserSearchParams,
  UserSearchResponse,
  UsersListParams,
  UsersListResponse,
} from './users.types';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, UsersListParams | void>({
      query: (params) => ({
        url: '/users',
        params: params ?? {},
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        stableQueryKey((queryArgs ?? {}) as Record<string, unknown>),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    searchUsers: builder.query<UserSearchResponse, UserSearchParams | void>({
      query: (params) => ({
        url: '/users',
        params: params ?? {},
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        `user-search:${stableQueryKey((queryArgs ?? {}) as Record<string, unknown>)}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useLazyGetUsersQuery, useSearchUsersQuery } = usersApi;
