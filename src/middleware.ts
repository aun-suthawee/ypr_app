import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip hydration-related paths, API routes, and static files
  if (request.nextUrl.pathname.startsWith('/_next/') || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow all routes except dashboard without authentication
  // Dashboard routes will be protected client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
