import { NextResponse } from 'next/server';
import type { NextRequest, ProxyConfig } from 'next/server';

/**
 * Auth cookies are httpOnly and owned by the API origin, so they are not
 * visible here on a cross-origin Next request. Session is resolved on the
 * client via `/auth/sessions` + cookie credentials.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
