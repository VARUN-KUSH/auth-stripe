// src/app/api/stripe/webhook/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/model/dbconnection';
import User from '@/model/models/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

// Disable body parsing to receive raw body

export async function POST(request: Request): Promise<NextResponse> {
  const sig = request.headers.get('stripe-signature') || '';
  const buf = await request.arrayBuffer();
  const body = Buffer.from(buf);

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
    }

    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } 
   //eslint-disable-next-line
  catch (err: any) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { status: 400, message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract userId from metadata
    const userId = session.metadata?.userId as string;

    if (userId) {
      try {
        await connectToDatabase();
        const user = await User.findById(userId);
        if (user) {
          user.subscription = true;
          await user.save();
          console.log(`User ${user.email} subscription updated to true.`);
        } else {
          console.error(`User with ID ${userId} not found.`);
        }
      } 
       //eslint-disable-next-line
      catch (dbError) {
        console.error('Database update failed:', dbError);
        // Optionally, handle retries or alerting here
      }
    } else {
      console.error('No userId found in session metadata.');
    }
  }

  // Acknowledge the event
  return NextResponse.json(
    { status: 200, message: 'Webhook handled successfully'},
    { status: 200 }
  );
}
