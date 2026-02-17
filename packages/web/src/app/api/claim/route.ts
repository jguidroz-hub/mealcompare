import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * POST /api/claim — Restaurant owner claims their listing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurant, city, url, email } = body;

    if (!restaurant || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Restaurant name and valid email required' }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      INSERT INTO restaurant_claims (restaurant_name, city, direct_url, email, status)
      VALUES (${restaurant}, ${city || null}, ${url || null}, ${email}, 'pending')
    `;

    return NextResponse.json({ ok: true, message: 'Claim submitted! We\'ll verify and reach out within 24 hours.' });
  } catch (err) {
    console.error('[claim] Error:', err);
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}

/**
 * GET /api/claim — List claims (admin)
 */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sql = getDb();
    const claims = await sql`SELECT * FROM restaurant_claims ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ claims });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
