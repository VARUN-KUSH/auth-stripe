// src/app/api/auth/signup.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { fullName, email, password } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        status: 400,
        message: 'User already exists with this email',
      }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      fullName,
      email,
      hashedPassword,
    });

    return NextResponse.json({
      status: 201,
      message: 'User registered successfully',
      data: {
        fullName: user.fullName,
        email: user.email,
      },
    }, { status: 201 });
  } 
   //eslint-disable-next-line
  catch (error: any) {
    console.error('Error in Signup handler:', error);
    return NextResponse.json({
      status: 500,
      message: 'An error occurred during user registration',
      error: error.message,
    }, { status: 500 });
  }
}
