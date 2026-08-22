import { cookies } from 'next/headers';

export async function getServerCookieHeader(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();

  if (all.length === 0) {
    return undefined;
  }

  return all.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
}

/** @deprecated Use getServerCookieHeader — tokens are httpOnly and not read as Bearer. */
export async function getServerAuthToken(): Promise<string | undefined> {
  return getServerCookieHeader();
}
