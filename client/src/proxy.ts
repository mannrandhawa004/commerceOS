import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAMES } from '@/config/app.config';

/** Cheap session-presence guard before a protected route is rendered. */
export function proxy(request: NextRequest) {
  const hasSession = Boolean(
    request.cookies.get(COOKIE_NAMES.accessToken)?.value ||
      request.cookies.get(COOKIE_NAMES.refreshToken)?.value,
  );

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
