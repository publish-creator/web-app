import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

import { getServerAuthToken, getServerCookieHeader } from './server-auth-cookie';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('getServerCookieHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should serialize every request cookie so the API can authenticate via httpOnly', async () => {
    const mockGetAll = vi.fn().mockReturnValue([
      { name: 'accessToken', value: 'server-side-resolved-jwt' },
      { name: 'refreshToken', value: 'refresh-jwt' },
    ]);
    vi.mocked(cookies).mockResolvedValue({
      getAll: mockGetAll,
    } as unknown as ReadonlyRequestCookies);

    const result = await getServerCookieHeader();

    expect(cookies).toHaveBeenCalled();
    expect(mockGetAll).toHaveBeenCalled();
    expect(result).toBe('accessToken=server-side-resolved-jwt; refreshToken=refresh-jwt');
  });

  it('should return undefined when no cookies are present', async () => {
    const mockGetAll = vi.fn().mockReturnValue([]);
    vi.mocked(cookies).mockResolvedValue({
      getAll: mockGetAll,
    } as unknown as ReadonlyRequestCookies);

    const result = await getServerCookieHeader();

    expect(result).toBeUndefined();
  });

  it('should keep getServerAuthToken as a cookie-header alias', async () => {
    const mockGetAll = vi.fn().mockReturnValue([{ name: 'token', value: 'jwt' }]);
    vi.mocked(cookies).mockResolvedValue({
      getAll: mockGetAll,
    } as unknown as ReadonlyRequestCookies);

    await expect(getServerAuthToken()).resolves.toBe('token=jwt');
  });
});
