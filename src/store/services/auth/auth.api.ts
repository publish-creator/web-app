import { AuthRefreshManager } from '@/lib/auth/auth-refresh';

import { api } from '../api/base-api';
import type {
  AuthUser,
  DeviceSession,
  MagicLinkConsumeDto,
  MfaConfirmDto,
  MfaConfirmResponse,
  MfaRecoverDto,
  MfaSetupResponse,
  MfaVerifyDto,
  Session,
  SetPasswordDto,
  SetPasswordResponse,
  SignInDto,
  SignInResponse,
  SignUpDto,
  TermsAcceptDto,
  TermsCurrent,
  VerifyEmailConfirmDto,
  VerifyEmailRequestDto,
  VerifyPhoneConfirmDto,
  VerifyPhoneRequestDto,
} from './auth.types';

const SESSION_TAG = { type: 'Auth' as const, id: 'SESSION' };

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Who is signed in and what they still owe. Every mutation that can change one of those answers
     * invalidates this, so the routing never runs on a stale list.
     */
    getSession: builder.query<Session, void>({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      providesTags: [SESSION_TAG],
    }),

    signIn: builder.mutation<SignInResponse, SignInDto>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          /**
           * `mfaRequired` means no session exists yet — only a challenge cookie. Fetching the
           * session here would 401 and send the caller back to sign-in, undoing the half of the
           * login that just succeeded. The MFA screen takes it from here.
           */
          if (data.mfaRequired) return;

          AuthRefreshManager.reset();
        } catch {
          // The rejected mutation already carries the error; the caller renders it.
        }
      },
    }),

    /** Registration is invite-only: `code` is the invite, and the API refuses without a usable one. */
    signUp: builder.mutation<{ success: boolean }, SignUpDto>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      extraOptions: { skipAuth: true },
    }),

    magicLinkRequest: builder.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({ url: '/auth/magic-link', method: 'POST', body }),
      extraOptions: { skipAuth: true },
    }),

    magicLinkConsume: builder.mutation<
      { mfaRequired: boolean; mustSetPassword: boolean },
      MagicLinkConsumeDto
    >({
      query: (body) => ({ url: '/auth/magic-link/consume', method: 'POST', body }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (!data.mfaRequired) AuthRefreshManager.reset();
        } catch {}
      },
    }),

    verifyEmailRequest: builder.mutation<{ success: boolean }, VerifyEmailRequestDto>({
      query: (body) => ({ url: '/auth/verify/email/request', method: 'POST', body }),
      extraOptions: { skipAuth: true },
    }),

    verifyEmailConfirm: builder.mutation<{ verified: boolean }, VerifyEmailConfirmDto>({
      query: (body) => ({ url: '/auth/verify/email/confirm', method: 'POST', body }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
    }),

    verifyPhoneRequest: builder.mutation<{ success: boolean }, VerifyPhoneRequestDto>({
      query: (body) => ({ url: '/auth/verify/phone/request', method: 'POST', body }),
    }),

    verifyPhoneConfirm: builder.mutation<{ verified: boolean }, VerifyPhoneConfirmDto>({
      query: (body) => ({ url: '/auth/verify/phone/confirm', method: 'POST', body }),
      invalidatesTags: [SESSION_TAG],
    }),

    setPassword: builder.mutation<SetPasswordResponse, SetPasswordDto>({
      query: ({ password, currentPassword }) => ({
        url: '/auth/password',
        method: 'POST',
        body: { newPassword: password, ...(currentPassword ? { currentPassword } : {}) },
      }),
      invalidatesTags: [SESSION_TAG],
    }),

    /** Hands back the secret and the otpauth URL the QR code is drawn from. Enrolling needs a session. */
    mfaSetup: builder.mutation<MfaSetupResponse, void>({
      query: () => ({ url: '/auth/mfa/setup', method: 'POST' }),
    }),

    /** The recovery codes come back exactly once, here. Nothing can show them again. */
    mfaConfirm: builder.mutation<MfaConfirmResponse, MfaConfirmDto>({
      query: (body) => ({ url: '/auth/mfa/confirm', method: 'POST', body }),
      invalidatesTags: [SESSION_TAG],
    }),

    /**
     * The second half of signing in. There is no session yet — the challenge cookie set by
     * `/auth/login` is the credential — so this skips the refresh-on-401 path, which would be
     * refreshing a session that does not exist.
     */
    mfaVerify: builder.mutation<{ verified: boolean; user: AuthUser | null }, MfaVerifyDto>({
      query: (body) => ({ url: '/auth/mfa/verify', method: 'POST', body }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          AuthRefreshManager.reset();
        } catch {}
      },
    }),

    mfaRecover: builder.mutation<
      { verified: boolean; remainingRecoveryCodes: number },
      MfaRecoverDto
    >({
      query: ({ code }) => ({
        url: '/auth/mfa/recover',
        method: 'POST',
        body: { recoveryCode: code },
      }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          AuthRefreshManager.reset();
        } catch {}
      },
    }),

    termsCurrent: builder.query<TermsCurrent, void>({
      query: () => ({ url: '/auth/terms/current', method: 'GET' }),
      providesTags: [{ type: 'Auth', id: 'TERMS' }],
    }),

    termsAccept: builder.mutation<{ accepted: boolean }, TermsAcceptDto>({
      query: (body) => ({ url: '/auth/terms/accept', method: 'POST', body }),
      invalidatesTags: [SESSION_TAG, { type: 'Auth', id: 'TERMS' }],
    }),

    devicesList: builder.query<{ data: DeviceSession[] }, void>({
      query: () => ({ url: '/auth/sessions', method: 'GET' }),
      providesTags: [{ type: 'Auth', id: 'DEVICES' }],
    }),

    deviceRevoke: builder.mutation<{ revoked: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/auth/sessions/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Auth', id: 'DEVICES' }],
    }),

    /** Ends every session everywhere by bumping the credential version, this one included. */
    devicesRevokeAll: builder.mutation<{ revoked: number }, void>({
      query: () => ({ url: '/auth/sessions', method: 'DELETE' }),
      invalidatesTags: [SESSION_TAG, { type: 'Auth', id: 'DEVICES' }],
    }),

    signOut: builder.mutation<void, void>({
      query: () => ({ url: '/auth/sign-out', method: 'POST' }),
      extraOptions: { skipAuth: true },
      invalidatesTags: [SESSION_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSignInMutation,
  useSignUpMutation,
  useMagicLinkRequestMutation,
  useMagicLinkConsumeMutation,
  useVerifyEmailRequestMutation,
  useVerifyEmailConfirmMutation,
  useVerifyPhoneRequestMutation,
  useVerifyPhoneConfirmMutation,
  useSetPasswordMutation,
  useMfaSetupMutation,
  useMfaConfirmMutation,
  useMfaVerifyMutation,
  useMfaRecoverMutation,
  useTermsCurrentQuery,
  useTermsAcceptMutation,
  useDevicesListQuery,
  useDeviceRevokeMutation,
  useDevicesRevokeAllMutation,
  useSignOutMutation,
} = authApi;
