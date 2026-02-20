import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * POST /api/checkout — Create Stripe checkout session for Verified Listing
 * Body: { restaurantName, email, claimId? }
 */
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
  });

  try {
    const { restaurantName, email, claimId } = await req.json();

    if (!restaurantName || !email) {
      return NextResponse.json({ error: 'Restaurant name and email required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_VERIFIED_LISTING_PRICE_ID || 'price_1T2tQCHS7pkl2UJIs6V2ia7x',
          quantity: 1,
        },
      ],
      metadata: {
        restaurantName,
        email,
        claimId: claimId || '',
      },
      subscription_data: {
        metadata: { restaurantName, email },
      },
      success_url: `${baseUrl}/for-restaurants?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/for-restaurants?canceled=true`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('[checkout] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
