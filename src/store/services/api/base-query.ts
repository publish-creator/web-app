import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { REDIRECT_SIGN_OUT_ROUTE } from '@/config/public-routes';
import { env } from '@/env';
import { AuthRefreshManager } from '@/lib/auth/auth-refresh';
import { RequestMutex } from '@/lib/auth/request-mutex';

import type { ApiExtraOptions } from './types';

const mutex = new RequestMutex();

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function resolveBaseUrl(): string {
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return `${appUrl}/api`;
  }

  return '/api';
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: resolveBaseUrl(),
  credentials: 'include',
  prepareHeaders: (headers, { extraOptions }) => {
    const options = extraOptions as ApiExtraOptions | undefined;

    if (options?.workspaceId) {
      headers.set('X-Workspace-Id', options.workspaceId);
    }

    if (typeof window !== 'undefined') {
      headers.set('accept-language', navigator.language);
    }

    return headers;
  },
});

async function retryAfterRefresh(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: ApiExtraOptions | undefined,
) {
  const refreshSuccess = await AuthRefreshManager.refresh();

  if (refreshSuccess) {
    return rawBaseQuery(args, api, extraOptions ?? {});
  }

  const { resetAppState } = await import('@/store/reset-app-state');

  resetAppState(api.dispatch);

  if (typeof window !== 'undefined') {
    window.location.href = REDIRECT_SIGN_OUT_ROUTE;
  }

  return { error: { status: 401, data: 'Session expired' } as FetchBaseQueryError };
}

/**
 * Same contract as the working Astron client:
 * cookies via `credentials: "include"`, no Bearer token, refresh on 401.
 * Extra custom headers are avoided — they fail CORS on this API.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ApiExtraOptions
> = async (args, api, extraOptions) => {
  const options = extraOptions as ApiExtraOptions | undefined;

  if (options?.skipAuth) {
    return rawBaseQuery(args, api, extraOptions ?? {});
  }

  await mutex.waitForUnlock();

  if (AuthRefreshManager.lastRefreshFailed) {
    return { error: { status: 401, data: 'Session expired' } as FetchBaseQueryError };
  }

  let result = await rawBaseQuery(args, api, extraOptions ?? {});

  if (!(result.error && result.error.status === 401)) {
    return result;
  }

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      result = await retryAfterRefresh(args, api, options);
    } finally {
      release();
    }

    return result;
  }

  await mutex.waitForUnlock();

  if (!AuthRefreshManager.lastRefreshFailed) {
    result = await rawBaseQuery(args, api, extraOptions ?? {});
  }

  return result;
};

export { generateRequestId, resolveBaseUrl };
