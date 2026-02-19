import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Permitir todas las rutas por ahora
  // El middleware se ejecutará en Vercel para manejar rutas dinámicamente si es necesario
  return NextResponse.next();
}

// Configuración del middleware para ejecutarse en rutas específicas
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
};
