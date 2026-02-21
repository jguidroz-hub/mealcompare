import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'eddy.delivery';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  // 301 redirect non-canonical domains to eddy.delivery
  // Covers: skipthefee.app, eddie.delivery, www.eddy.delivery, www.eddie.delivery
  if (
    host &&
    host !== CANONICAL_HOST &&
    !host.includes('localhost') &&
    !host.includes('sslip.io') &&
    !host.includes('127.0.0.1')
  ) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url.toString(), 301);
  }

  // CORS for Chrome extension on API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json).*)'],
};
