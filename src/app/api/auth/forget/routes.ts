import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import User from "@/model/models/users";

export default async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { email } = reqBody.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = uuidv4();

    const expirationTime = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiration = expirationTime;

    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "gabriella91@ethereal.email",
        pass: "RCWcepV1XFhTJdKrVf",
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
    return NextResponse.json({
      status: 401,
      message: "Password reset link sent to your email.",
      data: null,
    });
  } catch (err) {
    console.error("Error generating reset token:", err);
    throw err;
  }
}
