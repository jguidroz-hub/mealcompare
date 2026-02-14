import { NextResponse } from 'next/server';

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
};

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();
    const priceId = PRICE_IDS[planId];
    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
