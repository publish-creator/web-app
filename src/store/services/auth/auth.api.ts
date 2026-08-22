import { AuthRefreshManager } from '@/lib/auth/auth-refresh';

import { api } from '../api/base-api';
import type { Session, SignInDto, SignInResponse } from './auth.types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSession: builder.query<Session, void>({
      query: () => ({
        url: '/auth/sessions',
        method: 'POST',
      }),
      providesTags: [{ type: 'Auth', id: 'SESSION' }],
    }),
    signIn: builder.mutation<SignInResponse, SignInDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      extraOptions: { skipAuth: true },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.needTwoFactor) {
            return;
          }

          AuthRefreshManager.reset();
          await dispatch(
            authApi.endpoints.getSession.initiate(undefined, { forceRefetch: true }),
          ).unwrap();
          window.location.href = '/';
        } catch {}
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [{ type: 'Auth', id: 'SESSION' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSessionQuery, useLazyGetSessionQuery, useSignInMutation, useSignOutMutation } =
  authApi;
