import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/featured — Create Stripe checkout for featured listing
 * 
 * Featured restaurants get:
 * - Priority placement in search results
 * - "Featured" badge on their listing
 * - Analytics dashboard access
 * - $29/month or $249/year
 */
export async function POST(req: NextRequest) {
  try {
    const { restaurant, email, plan } = await req.json();
    
    if (!restaurant || !email) {
      return NextResponse.json({ error: 'Restaurant and email required' }, { status: 400 });
    }

    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_KEY) {
      return NextResponse.json({ error: 'Payments not configured yet — contact hello@eddy.delivery' }, { status: 503 });
    }

    // Create Stripe Checkout session
    const priceId = plan === 'yearly' 
      ? process.env.STRIPE_PRICE_YEARLY  // $249/yr
      : process.env.STRIPE_PRICE_MONTHLY; // $29/mo

    if (!priceId) {
      return NextResponse.json({ error: 'Pricing not configured' }, { status: 503 });
    }

    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'customer_email': email,
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'success_url': `${process.env.NEXT_PUBLIC_URL || 'https://eddy.delivery'}/for-restaurants?success=true`,
        'cancel_url': `${process.env.NEXT_PUBLIC_URL || 'https://eddy.delivery'}/for-restaurants`,
        'metadata[restaurant]': restaurant,
        'metadata[email]': email,
      }),
    }).then(r => r.json());

    if (session.url) {
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  } catch (err) {
    console.error('[featured] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
