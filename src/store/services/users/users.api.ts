import { stableQueryKey } from '@/hooks/query/shared/stable-query-key';

import { api } from '../api/base-api';
import type {
  InviteCodeDetail,
  InviteCodeWriteBody,
  InviteCodesListParams,
  InviteCodesListResponse,
} from './invite-codes.types';
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
    getInviteCodes: builder.query<InviteCodesListResponse, InviteCodesListParams | void>({
      query: (params) => ({
        url: '/invite-codes',
        params: { order: 'desc', ...(params ?? {}) },
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        `invites:${stableQueryKey((queryArgs ?? {}) as Record<string, unknown>)}`,
      providesTags: [{ type: 'Users', id: 'INVITES' }],
    }),
    getInviteCode: builder.query<
      InviteCodeDetail,
      { id: string; page?: number; pageSize?: number }
    >({
      query: ({ id, ...params }) => ({ url: `/invite-codes/${id}`, params }),
      providesTags: (_result, _error, { id }) => [{ type: 'Users', id: `invite:${id}` }],
    }),
    createInviteCode: builder.mutation<
      { id: string; code: string; signupUrl: string; type: string; expiresAt: string },
      InviteCodeWriteBody
    >({
      query: (body) => ({ url: '/invite-codes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Users', id: 'INVITES' }],
    }),
    updateInviteCode: builder.mutation<
      { id: string; updated: boolean },
      { id: string; body: Partial<InviteCodeWriteBody> }
    >({
      query: ({ id, body }) => ({ url: `/invite-codes/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id: 'INVITES' },
        { type: 'Users', id: `invite:${id}` },
      ],
    }),
    revokeInviteCode: builder.mutation<{ id: string; revoked: boolean }, string>({
      query: (id) => ({ url: `/invite-codes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id: 'INVITES' },
        { type: 'Users', id: `invite:${id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useSearchUsersQuery,
  useGetInviteCodesQuery,
  useGetInviteCodeQuery,
  useCreateInviteCodeMutation,
  useUpdateInviteCodeMutation,
  useRevokeInviteCodeMutation,
} = usersApi;
