// src/app/api/auth/login.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({
        status: 404,
        message: 'User not found',
      }, { status: 404 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, existingUser.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({
        status: 401,
        message: 'Incorrect password. Please try again.',
      }, { status: 401 });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set token in HTTP-only cookie
    const response = NextResponse.json({
      status: 200,
      message: 'User authenticated successfully',
      data: {
        name: existingUser.username,
        subscription: existingUser.subscription,
      },
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  }
   //eslint-disable-next-line
  catch (error: any) {
    console.error('Error in Login handler:', error);
    return NextResponse.json({
      status: 500,
      message: 'An error occurred during login',
      error: error.message,
    }, { status: 500 });
  }
}
