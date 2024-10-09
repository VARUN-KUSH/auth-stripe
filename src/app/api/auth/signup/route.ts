// app/api/auth/signup/route.js
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//eslint-disable-next-line
export async function POST(request: Request): Promise<any> {
  try {
    const reqBody = await request.json();
    console.log("Signup data:", reqBody);
    const { fullName, email, password } = reqBody;

    // 1. Connect to the database
    await connectToDatabase();

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          status: 400,
          message: 'User already exists with this email',
          data: null,
        },
        { status: 400 }
      );
    }

    // 3. Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user
    const user = await User.create({
      fullName,
      email,
      hashedPassword,
    });
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }
    // 5. Generate JWT (optional: auto-login after signup)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Set JWT in HTTP-only cookie
    const response = NextResponse.json(
      {
        status: 201,
        message: 'User registered successfully',
        data: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 201 }
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
    console.error('Error in Signup API:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred during user registration',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
