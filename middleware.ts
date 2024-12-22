import { getToken } from 'next-auth/jwt';

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (pathname.startsWith('/admin') && token.role !== 'ADMINISTRADOR') {
        return new Response('Acceso denegado', { status: 403 });
    }

    if (pathname.startsWith('/cliente') && token.role !== 'CLIENTE') {
        return new Response('Acceso denegado', { status: 403 });
    }
}

export const config = {
    matcher: ['/admin/:path*', '/cliente/:path*'], // Rutas protegidas
};
