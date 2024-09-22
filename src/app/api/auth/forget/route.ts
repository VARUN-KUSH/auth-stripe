import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import User from "@/model/models/users";
import { connectToDatabase } from "@/model/dbconnection";

export async function POST(req: Request): Promise<any>  {
    console.log("here hello");
  try {
    const reqBody = await req.json();
    const { email } = reqBody; // Correctly destructure the email from the body
    await connectToDatabase();
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found." });
    }

    // Generate reset token and set expiration
    const resetToken = uuidv4();
    const expirationTime = Date.now() + 3600000; // 1 hour from now

    // Update the user with the reset token and expiration time
    user.resetToken = resetToken;
    user.resetTokenExpiration = expirationTime;
    await user.save();

    // Create a transporter to send email via Ethereal
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: "gabriella91@ethereal.email", // Ethereal email user
        pass: "RCWcepV1XFhTJdKrVf",         // Ethereal email password
      },
    });

    // Generate the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset?token=${resetToken}`;
    // Send the reset email
    await transporter.sendMail({
      from: "gabriella91@ethereal.email", // Ensure this is a valid email
      to: email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    // Return a success response
    return NextResponse.json({
      status: 200, // Corrected status code
      message: "Password reset link sent to your email.",
      data: null,
    });
  } catch (err:any) {
    console.error("Error generating reset token:", err);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
}
