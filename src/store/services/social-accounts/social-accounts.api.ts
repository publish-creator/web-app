import { api } from '../api/base-api';
import type {
  ConnectUrlParams,
  ConnectUrlResponse,
  DisconnectResponse,
  SocialAccountsResponse,
} from './social-accounts.types';

const LIST_TAG = { type: 'SocialAccounts' as const, id: 'LIST' };

export const socialAccountsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSocialAccounts: builder.query<SocialAccountsResponse, void>({
      query: () => ({ url: '/social-accounts' }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'SocialAccounts' as const, id })), LIST_TAG]
          : [LIST_TAG],
    }),

    getConnectUrl: builder.mutation<ConnectUrlResponse, ConnectUrlParams>({
      query: ({ platform, ...params }) => ({
        url: `/social-accounts/${platform}/connect-url`,
        params,
      }),
    }),

    disconnectSocialAccount: builder.mutation<DisconnectResponse, string>({
      query: (id) => ({ url: `/social-accounts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'SocialAccounts', id }, LIST_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSocialAccountsQuery,
  useGetConnectUrlMutation,
  useDisconnectSocialAccountMutation,
} = socialAccountsApi;
