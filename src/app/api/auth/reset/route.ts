import User from '@/model/models/users';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
//eslint-disable-next-line
export async function POST(req:Request):Promise<any> {
    try {
        const reqBody = await req.json();
         const { token, password } = reqBody;

         const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });

         if (!user) {
            return NextResponse.json({
                status: 400, // Corrected status code
                message: "Invalid or expired token.",
                data: null,
              });
          
         }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.hashedPassword = hashedPassword;
    user.resetToken = undefined; // Clear reset token
    user.resetTokenExpiration = undefined; // Clear expiration
    await user.save();
    return NextResponse.json({
        status: 200, // Corrected status code
        message: "Password successfully reset!",
        data: null,
      });

  } 
  //eslint-disable-next-line
  catch (err:any) {
    console.error("Error while reseting password:", err);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
}
