// src/app/api/auth/reset.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { token, password } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Find the user by reset token and ensure it's not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid or expired token.',
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return NextResponse.json({
      status: 200,
      message: 'Password successfully reset!',
    }, { status: 200 });
  } 
   //eslint-disable-next-line
  catch (err: any) {
    console.error('Error while resetting password:', err);
    return NextResponse.json({
      status: 500,
      message: 'An error occurred while processing your request.',
      error: err.message,
    }, { status: 500 });
  }
}
