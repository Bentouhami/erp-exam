// path: src/middleware.ts
// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
//
// export async function middleware(req: NextRequest) {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//
//     // Allow public access to static files and assets
//     const publicPaths = ['/api/auth/signin', '/auth', '/public'];
//     const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));
//     const isStaticAsset = req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/static');
//
//     if (!token && !isPublicPath && !isStaticAsset) {
//         // Redirect to login if no token and not on a public or static asset path
//         const loginUrl = new URL('/auth/login', req.url);
//         loginUrl.searchParams.set('callbackUrl', req.url); // Preserve the original URL for redirect after login
//         return NextResponse.redirect(loginUrl);
//     }
//
//     return NextResponse.next();
// }
//
// export const config = {
//     matcher: '/((?!_next|static|favicon.ico).*)', // Apply middleware to all routes except static assets
// };

export { auth as middleware } from "@/auth/auth"
