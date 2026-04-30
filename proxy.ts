import { auth } from '@/lib/auth/config';
import { NextResponse } from 'next/server';

// ============================================
// Middleware de proteção de rotas
// - /dashboard/* → apenas ADMIN
// - /minha-conta/* → qualquer usuário autenticado
// - /auth/* → redireciona se já logado
// ============================================
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';

  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isMinhaContaRoute = nextUrl.pathname.startsWith('/minha-conta');
  const isAuthRoute = nextUrl.pathname.startsWith('/auth');

  // Rota do dashboard: apenas ADMIN
  if (isDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=/dashboard', nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // Rota do cliente: autenticado
  if (isMinhaContaRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
    }
    return NextResponse.next();
  }

  // Rotas de auth: redireciona se já logado
  if (isAuthRoute && isLoggedIn) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.redirect(new URL('/minha-conta', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Aplica middleware nestas rotas
  matcher: [
    '/dashboard/:path*',
    '/minha-conta/:path*',
    '/auth/:path*',
  ],
};
