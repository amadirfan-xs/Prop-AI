import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES, APP_ROUTES } from './constants/auth';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = Object.values(AUTH_ROUTES).some(route => pathname.startsWith(route));
    const isChangeTempPassword = pathname.startsWith(AUTH_ROUTES.CHANGE_TEMP_PASSWORD);

    if (token && isAuthRoute && !isChangeTempPassword) {
        return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
    }

    const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next');
    const isPaymentRoute = pathname.startsWith('/payment/');
    const isPublicViewRoute = pathname.startsWith('/publicView/');

    if (!token && !isAuthRoute && !isPublicFile && !isPaymentRoute && !isPublicViewRoute) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
