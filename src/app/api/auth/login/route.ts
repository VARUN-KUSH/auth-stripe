// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '../../../lib/dbconnection';
import User from '../../../models/User'; // This will be the user model

export async function GET(request: Request) {
  
}