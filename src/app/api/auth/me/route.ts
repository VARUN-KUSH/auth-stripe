// src/app/api/auth/me.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get token from cookies
    const cookie = request.headers.get('cookie');
    if (!cookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const token = tokenMatch[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {userId: string;email: string };

    // Connect to the database
    await connectToDatabase();

    // Find the user by ID
    const user = await User.findById(decoded.userId).select('-hashedPassword -resetToken -resetTokenExpiration');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        subscription: user.subscription,
      },
    }, { status: 200 });
  } 
   //eslint-disable-next-line
  catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
