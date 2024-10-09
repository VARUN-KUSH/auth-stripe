// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';
import jwt from 'jsonwebtoken';
//eslint-disable-next-line
export async function POST(request: Request): Promise<any> {
  try {
    const reqBody = await request.json();
    
    // 1. Connect to the database
    await connectToDatabase();

    // 2. Check if user exists in the database
    const existingUser = await User.findOne({ email: reqBody.email });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return NextResponse.json(
        {
          status: 404,
          message: 'User not found',
          data: null,
        },
        { status: 404 }
      );
    }

    // 3. Verify password
    const passwordMatch = await bcrypt.compare(reqBody.password, existingUser.hashedPassword);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          status: 401,
          message: 'Incorrect password. Please try again.',
          data: null,
        },
        { status: 401 }
      );
    }
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }
    // 4. Generate JWT
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Set JWT in HTTP-only cookie
    const response = NextResponse.json(
      {
        status: 200,
        message: 'User authenticated successfully',
        data: {
          name: existingUser.username,
          subscription: existingUser.subscription,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
    
  }
  //eslint-disable-next-line
  catch (error:any) {
    console.error('Error in Login API:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred during login',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
