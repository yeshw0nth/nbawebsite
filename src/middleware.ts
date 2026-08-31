import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('site_access_token');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // If user is logged in and tries to access login, redirect to home
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If missing token and not on login page, redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, if any public ones are added)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
