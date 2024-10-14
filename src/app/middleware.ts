// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that do not require authentication
  const publicPaths = [
    '/login',
    '/signup',
    '/forget',
    '/reset',
    '/cancel',
    '/success',
    '/favicon.ico',
    '/api/auth/forget',
    '/api/auth/reset',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/stripe/webhook', // Webhook should be accessible without auth
  ];

  // Allow requests for public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token is present
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // Continue with the request if token is valid
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);
    // Redirect to login if token is invalid or expired
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

// Specify the paths you want the middleware to run on
export const config = {
  matcher: ['/((?!api/auth/forget|api/auth/reset|api/auth/login|api/auth/signup|api/stripe/webhook|_next/static|favicon.ico).*)'],
};
