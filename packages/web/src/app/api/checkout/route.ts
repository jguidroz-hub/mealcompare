import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * POST /api/checkout — Create Stripe checkout session for Verified Listing
 * Body: { restaurantName, email, claimId? }
 */
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const { restaurantName, email, claimId, tier } = await req.json();

    if (!restaurantName || !email) {
      return NextResponse.json({ error: 'Restaurant name and email required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    // Tier routing: standard ($29/mo) or premium ($99/mo)
    const priceId = tier === 'premium'
      ? (process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1T2uywHS7pkl2UJIPZN2Aiuu')
      : (process.env.STRIPE_STANDARD_PRICE_ID || 'price_1T2uyvHS7pkl2UJI8P3vPk7p');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        restaurantName,
        email,
        claimId: claimId || '',
        tier: tier || 'standard',
      },
      subscription_data: {
        metadata: { restaurantName, email, tier: tier || 'standard' },
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
