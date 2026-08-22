import { env } from '@/env';
import { getServerCookieHeader } from '@/lib/auth/server-auth-cookie';
import type { UsersListParams, UsersListResponse } from '@/store/services/users/users.types';

export async function fetchUsersServer(params: UsersListParams): Promise<UsersListResponse> {
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const cookieHeader = await getServerCookieHeader();
  const url = new URL('/users', apiUrl);

  if (params.page != null) {
    url.searchParams.set('page', String(params.page));
  }

  if (params.pageSize != null) {
    url.searchParams.set('pageSize', String(params.pageSize));
  }

  if (params.filter) {
    url.searchParams.set('filter', params.filter);
  }

  if (params.status) {
    url.searchParams.set('status', params.status);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users (${response.status})`);
  }

  return response.json() as Promise<UsersListResponse>;
}
