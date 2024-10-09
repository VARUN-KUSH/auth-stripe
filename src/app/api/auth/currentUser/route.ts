// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
//eslint-disable-next-line
export async function GET(request:any) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
       if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }
    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET) as JwtPayload;
    return NextResponse.json(
      {
        user: {
          email: decoded.email as string,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
