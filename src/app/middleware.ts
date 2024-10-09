// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
//eslint-disable-next-line
export function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = [
    '/login',
    '/signup',
    '/forget',
    '/reset',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/forget',
    '/api/auth/reset',
    '/api/auth/currentUser',
    '/api/auth/logout',
  ];

  // Allow public routes without authentication
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get the JWT from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token is present
    const url = request.nextUrl.clone();
    url.pathname = url.push('/login');
    return NextResponse.redirect(url);
  }

  try {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }
    // Verify the token
    jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Redirect to login if token is invalid or expired
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!api/auth/login|api/auth/signup|api/auth/forget|api/auth/reset|api/auth/currentUser|api/auth/logout|login|signup|forget|reset).*)',
  ],
};
