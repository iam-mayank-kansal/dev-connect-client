import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('devconnect-auth-token')?.value;

  console.log('=== MIDDLEWARE START ===');
  console.log('[Middleware] Request details:', {
    path: pathname,
    method: request.method,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent')?.substring(0, 50),
  });

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

  console.log('[Middleware] Route classification:', {
    isProtectedRoute,
    isAuthRoute,
    matchedProtectedRoute: isProtectedRoute
      ? protectedRoutes.find((route) => pathname.startsWith(route))
      : null,
    matchedAuthRoute: isAuthRoute
      ? authRoutes.find((route) => pathname.startsWith(route))
      : null,
  });

  // Case 1: Trying to access protected route without token -> Login
  if (isProtectedRoute && !token) {
    console.warn('[Middleware] ACCESS DENIED - Protected route without token');
    console.log('[Middleware] Redirecting to login with return URL:', pathname);

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);

    console.log('[Middleware] Redirect URL:', loginUrl.toString());
    console.log('=== MIDDLEWARE END (REDIRECT TO LOGIN) ===\n');

    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Auth route with token
  if (isAuthRoute && token) {
    console.log(
      '[Middleware] User already authenticated, redirecting from auth page to home'
    );

    console.log('[Middleware] Current auth page:', pathname);

    const homeUrl = new URL('/', request.url);
    console.log('[Middleware] Redirect URL:', homeUrl.toString());
    console.log('=== MIDDLEWARE END (REDIRECT TO HOME) ===\n');

    return NextResponse.redirect(homeUrl);
  }

  // Allow request to continue
  console.log('[Middleware] ✓ Request allowed to proceed');
  console.log('[Middleware] Decision:', {
    action: 'ALLOW',
    reason: isProtectedRoute
      ? 'Protected route with valid token'
      : isAuthRoute
        ? 'Auth route without token (unauthenticated user)'
        : 'Public route',
  });
  console.log('=== MIDDLEWARE END (ALLOW) ===\n');

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
