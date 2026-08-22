import { env } from '@/env';

function resolveRefreshUrl(): string {
  const base = (env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
  const path = '/auth/refresh';

  if (base) {
    return `${base}${path}`;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api${path}`;
  }

  return `/api${path}`;
}

export class AuthRefreshManager {
  private static refreshPromise: Promise<boolean> | null = null;
  private static _lastRefreshFailed = false;

  public static get lastRefreshFailed(): boolean {
    return this._lastRefreshFailed;
  }

  public static reset(): void {
    this._lastRefreshFailed = false;
    this.refreshPromise = null;
  }

  public static async refresh(): Promise<boolean> {
    if (this._lastRefreshFailed) return false;

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(resolveRefreshUrl(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) this._lastRefreshFailed = true;
        return res.ok;
      })
      .catch((err: unknown) => {
        console.error('[AuthRefresh] Erro de rede ao renovar token:', err);
        return false;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }
}
