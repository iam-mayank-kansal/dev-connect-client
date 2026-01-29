import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, href } = request.nextUrl;

  console.log('================ MIDDLEWARE START ================');
  console.log('Request URL:', href);
  console.log('Pathname:', pathname);

  // Cookies
  const allCookies = request.cookies.getAll();
  const token = request.cookies.get('devconnect-auth-token')?.value;

  console.log(
    'Cookies present:',
    allCookies.map((c) => c.name)
  );
  console.log('Auth token:', token ? 'FOUND' : 'MISSING');

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

  console.log('Route checks:', {
    isProtectedRoute,
    isAuthRoute,
  });

  // Case 1: Protected route without token
  if (isProtectedRoute && !token) {
    console.log('ACTION: Redirect → /login (no token on protected route)');

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);

    console.log('Redirect URL:', loginUrl.toString());
    console.log('================ MIDDLEWARE END ================');

    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Auth route with token
  if (isAuthRoute && token) {
    console.log('ACTION: Redirect → / (token present on auth route)');

    console.log('================ MIDDLEWARE END ================');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('ACTION: Allow request to continue');
  console.log('================ MIDDLEWARE END ================');

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
