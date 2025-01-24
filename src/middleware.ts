// path: src/middleware.ts
// import type {NextRequest} from 'next/server';
// import {NextResponse} from 'next/server';
// import {getToken} from 'next-auth/jwt';
// import {DOMAIN} from "@/lib/utils/constants";
//
// export async function middleware(req: NextRequest) {
//     const token = await getToken({req, secret: process.env.AUTH_SECRET});
//
//     // Allow public access to static files and assets
//     const publicPaths = ['/api/auth/signin', '/auth', '/public'];
//     const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));
//     const isStaticAsset = req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/static');
//
//     if (!token && !isPublicPath && !isStaticAsset) {
//         // Redirect to login if no token and not on a public or static asset path
//         const loginUrl = new URL(`${DOMAIN}/auth`, req.url);
//         loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
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
