import { getToken } from 'next-auth/jwt';

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

    console.log('Middleware activo en ruta:', req.nextUrl.pathname);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    console.log('Token no encontrado, redirigiendo al login.');
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    const { pathname } = req.nextUrl;
    
    console.log('Middleware activo en ruta:',pathname);
    // Restringir acceso basado en roles
    if (pathname.startsWith('/admin') && token.role !== 'ADMINISTRADOR') {
        return NextResponse.redirect(new URL('/cliente/dashboard', req.url));
    }

    if (pathname.startsWith('/cliente') && token.role !== 'CLIENTE') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/cliente/:path*'],
};

// export const config = {
//     matcher: ['/:path*'], // Aplica a todas las rutas
//     runtime: 'nodejs', // Temporalmente usa Node.js para debug
// };

