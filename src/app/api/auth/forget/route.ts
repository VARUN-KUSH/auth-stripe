// src/app/api/auth/forget.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email } = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: 'User not found.',
      }, { status: 404 });
    }

    // Generate reset token and set expiration (1 hour)
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour in ms

    // Update the user with the reset token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiry;
    await user.save();

    // Create a transporter using Ethereal for testing or use your SMTP service
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Replace with your SMTP host
      port: 587, // Replace with your SMTP port
      secure: false, // true for 465, false for other ports
      auth: {
        user: "randy53@ethereal.email", // Ethereal email user
        pass: "9w3nzG3PsgP6RpANdr",         // Ethereal email password
      },
    });

    // Generate the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset?token=${resetToken}`;

    // Send the reset email
    await transporter.sendMail({
      from: "randy53@ethereal.email", // Ensure this is a valid email
      to: email,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    return NextResponse.json({
      status: 200,
      message: 'Password reset link sent to your email.',
    }, { status: 200 });
  } 
   //eslint-disable-next-line
  catch (err: any) {
    console.error('Error generating reset token:', err);
    return NextResponse.json({
      status: 500,
      message: 'An error occurred while processing your request.',
      error: err.message,
    }, { status: 500 });
  }
}
