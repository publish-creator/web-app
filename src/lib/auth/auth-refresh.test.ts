import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthRefreshManager } from './auth-refresh';

vi.mock('@/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
  },
}));

describe('AuthRefreshManager', () => {
  beforeEach(() => {
    AuthRefreshManager.reset();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    AuthRefreshManager.reset();
  });

  it('should renew the session cookie with credentials included', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const success = await AuthRefreshManager.refresh();

    expect(success).toBe(true);
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(AuthRefreshManager.lastRefreshFailed).toBe(false);
  });

  it('should share a single in-flight refresh across concurrent callers', async () => {
    let resolveFetch: (value: Response) => void = () => {};
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const first = AuthRefreshManager.refresh();
    const second = AuthRefreshManager.refresh();

    resolveFetch({ ok: true } as Response);

    await expect(Promise.all([first, second])).resolves.toEqual([true, true]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should stop retrying after the refresh endpoint rejects the cookie', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(AuthRefreshManager.refresh()).resolves.toBe(false);
    await expect(AuthRefreshManager.refresh()).resolves.toBe(false);

    expect(AuthRefreshManager.lastRefreshFailed).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should treat network failures as a failed refresh without locking the session forever', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(AuthRefreshManager.refresh()).resolves.toBe(false);

    expect(AuthRefreshManager.lastRefreshFailed).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});
