// src/app/api/stripe/checkout/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = await request.json();

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { status: 400, message: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: 404, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID as string, // Replace with your price ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(), // Ensure this is the ObjectId
      },
    });

    return NextResponse.json(
      { status: 200, url: session.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { status: 500, message: 'Failed to create Stripe session.', error: error.message },
      { status: 500 }
    );
  }
}
