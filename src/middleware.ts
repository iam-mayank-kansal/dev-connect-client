import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('devconnect-auth-token')?.value;

  console.log('\n════════════════════════════════════════════════════════');
  console.log('🔍 MIDDLEWARE EXECUTION START');
  console.log('════════════════════════════════════════════════════════');

  // Detailed request info
  console.log('[REQUEST] URL Info:', {
    pathname,
    hostname: request.nextUrl.hostname,
    fullUrl: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  // Cookie debugging
  console.log('[COOKIES] Cookie Details:', {
    hasAuthToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token
      ? `${token.substring(0, 20)}...${token.substring(token.length - 10)}`
      : 'none',
    allCookieNames: request.cookies.getAll().map((c) => c.name),
    totalCookies: request.cookies.getAll().length,
  });

  // Headers debugging
  console.log('[HEADERS] Relevant Headers:', {
    'user-agent': request.headers.get('user-agent')?.substring(0, 60) || 'none',
    origin: request.headers.get('origin') || 'none',
    referer: request.headers.get('referer') || 'none',
    'x-forwarded-for': request.headers.get('x-forwarded-for') || 'none',
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

  // Route classification debugging
  console.log('[ROUTE] Classification:', {
    isProtectedRoute,
    isAuthRoute,
    matchedProtectedRoute: isProtectedRoute
      ? protectedRoutes.find((route) => pathname.startsWith(route))
      : null,
    matchedAuthRoute: isAuthRoute
      ? authRoutes.find((route) => pathname.startsWith(route))
      : null,
  });

  // Skip middleware check for public routes and API routes
  if (
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    console.log('[DECISION] ✅ PUBLIC/STATIC ROUTE');
    console.log('[ACTION] Allowing request to proceed without auth check');
    console.log('════════════════════════════════════════════════════════\n');
    return NextResponse.next();
  }

  // Case 1: Trying to access protected route without token -> Login
  if (isProtectedRoute && !token) {
    console.warn('[DECISION] ❌ PROTECTED ROUTE WITHOUT TOKEN');
    console.log('[DETAILS]', {
      route: pathname,
      hasToken: false,
      reason: 'User not authenticated',
    });

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);

    console.log('[ACTION] Redirecting to login page');
    console.log('[REDIRECT] From:', pathname);
    console.log('[REDIRECT] To:', loginUrl.toString());
    console.log('[REDIRECT] ReturnUrl:', pathname);
    console.log('════════════════════════════════════════════════════════\n');

    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Auth route with token
  if (isAuthRoute && token) {
    console.log('[DECISION] ⚠️  USER ALREADY AUTHENTICATED ON AUTH PAGE');
    console.log('[DETAILS]', {
      currentAuthPage: pathname,
      hasToken: true,
      reason: 'User should be on protected routes, not auth pages',
    });

    const homeUrl = new URL('/', request.url);

    console.log('[ACTION] Redirecting authenticated user away from auth page');
    console.log('[REDIRECT] From:', pathname);
    console.log('[REDIRECT] To:', homeUrl.toString());
    console.log('════════════════════════════════════════════════════════\n');

    return NextResponse.redirect(homeUrl);
  }

  // Allow request to continue
  const allowReason = isProtectedRoute
    ? 'Protected route with valid token'
    : isAuthRoute
      ? 'Auth route without token (unauthenticated user)'
      : 'Public route';

  console.log('[DECISION] ✅ ALLOWED');
  console.log('[DETAILS]', {
    action: 'ALLOW',
    reason: allowReason,
    route: pathname,
    authenticated: !!token,
  });
  console.log('[ACTION] Proceeding with request');
  console.log('════════════════════════════════════════════════════════\n');

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
