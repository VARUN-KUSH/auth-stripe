import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request): Promise<any> {
  try {
    const reqBody = await request.json();
    console.log("data",reqBody);
    // 1. Destructure the request body
    const { fullName, email, password } = reqBody;

    // 2. Connect to the database
    await connectToDatabase();

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user already exists, return an error
      return NextResponse.json({
        status: 400,
        message: 'User already exists with this email',
        data: null,
      });
    }

    // 4. Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        hashedPassword
    })

    return NextResponse.json({
      status: 201,
      message: 'User registered successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error:any) {
    console.error('Error in registration handler:', error);

    // 8. Handle any errors and return a server error response
    return NextResponse.json({
      status: 500,
      message: 'An error occurred during user registration',
      error: error.message,
    });
  }
}
