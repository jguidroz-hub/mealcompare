import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * POST /api/webhooks/stripe — Handle Stripe subscription events
 */
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const pool = getPool();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const restaurantName = session.metadata?.restaurantName || '';
      const email = session.metadata?.email || '';
      const claimId = session.metadata?.claimId;

      if (claimId) {
        await pool.query(
          `UPDATE restaurant_claims SET status = 'verified' WHERE id = $1`,
          [parseInt(claimId)]
        );
      } else if (email) {
        // Mark by email if no claimId
        await pool.query(
          `UPDATE restaurant_claims SET status = 'verified' WHERE email = $1 AND restaurant_name = $2`,
          [email, restaurantName]
        );
      }

      console.log(`[stripe-webhook] Verified listing for: ${restaurantName} (${email})`);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const email = sub.metadata?.email;
      const restaurantName = sub.metadata?.restaurantName;

      if (email && restaurantName) {
        await pool.query(
          `UPDATE restaurant_claims SET status = 'expired' WHERE email = $1 AND restaurant_name = $2`,
          [email, restaurantName]
        );
        console.log(`[stripe-webhook] Expired listing for: ${restaurantName} (${email})`);
      }
    }
  } catch (err) {
    console.error('[stripe-webhook] DB error:', err);
    // Return 200 to avoid Stripe retrying — log and investigate manually
  }

  return NextResponse.json({ received: true });
}
