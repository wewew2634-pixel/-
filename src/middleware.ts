/**
 * Middleware - Cache Invalidation for Design Review
 * 
 * Prevents caching on design review routes (/splash, /onboarding)
 * to ensure immediate visual updates during development
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply cache prevention to design review routes
  const shouldPreventCache = 
    pathname.startsWith('/splash') || 
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/creator/home') ||
    pathname.startsWith('/api/live-hash');

  if (shouldPreventCache) {
    const response = NextResponse.next();
    
    // Strong cache prevention headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    '/splash/:path*',
    '/onboarding/:path*',
    '/creator/home/:path*',
    '/api/live-hash',
  ],
};
