import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function POST(request: Request): Promise<any> {
  try {
    const reqBody = await request.json();
    
    // 1. Connect to the database
    await connectToDatabase();

    // 2. Check if user exists in the database
    const existingUser = await User.findOne({ email: reqBody.email });
    console.log("existingUser",existingUser);
    if (!existingUser) {
        return NextResponse.json({
            status: 404,
            message: 'User not found',
            data: null,
          });
    }
    const passwordMatch = await bcrypt.compare(reqBody.password, existingUser.hashedPassword);
    if (!passwordMatch) {
        // If the password doesn't match, return an error
        return NextResponse.json({
          status: 401,
          message: 'Incorrect password. Please try again.',
          data: null,
        });
      }
    return NextResponse.json({
        status: 200,
        message: 'User found successfully',
        data: {
          name: existingUser.username,
          subscription: existingUser.subscription
        },
      });
    
  } catch (error:any) {
    // Error handling
    console.error('Error in Post handler:', error);
    return NextResponse.json({
      status: 500,
      message: 'An error occurred during login',
      error: error.message,
    });
  }
}
