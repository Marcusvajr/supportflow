import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/api/health', '/icon.svg']);
const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) await auth.protect();
}, { signInUrl: '/sign-in' });

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (['/api/health', '/icon.svg'].includes(request.nextUrl.pathname)) return NextResponse.next();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    // Ausência de configuração nunca libera conteúdo privado.
    return isPublicRoute(request) ? NextResponse.next() : NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return clerkProxy(request, event);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
