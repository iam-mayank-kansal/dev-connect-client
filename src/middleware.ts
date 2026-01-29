import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - they're proxied to backend
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('devconnect-auth-token')?.value;
  console.log(`PATH: ${pathname} | TOKEN: ${token ? 'FOUND' : 'MISSING'}`);

  const protectedRoutes = [
    '/chat',
    '/connections',
    '/create-blog',
    '/profile',
    '/settings',
  ];

  const authRoutes = [
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/new-password',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Case 1: Trying to access protected route without token -> Login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Trying to access login/signup while already logged in -> Home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Middleware passed for path:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
