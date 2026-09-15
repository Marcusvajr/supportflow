import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

const clerkProxy = clerkMiddleware();

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // Health e ícone não dependem do provedor de identidade.
  if (['/api/health', '/icon.svg'].includes(request.nextUrl.pathname)) return NextResponse.next();

  // Sem configuração Clerk, o proxy continua neutro. As rotas privadas são
  // protegidas no próprio layout de servidor, que falha de forma fechada.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return NextResponse.next();

  return clerkProxy(request, event);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
