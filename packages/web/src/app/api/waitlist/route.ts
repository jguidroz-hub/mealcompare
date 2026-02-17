import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * POST /api/waitlist — Collect email addresses
 */
export async function POST(req: NextRequest) {
  try {
    const { email, metro, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      INSERT INTO waitlist (email, metro, source)
      VALUES (${email}, ${metro || null}, ${source || 'web'})
      ON CONFLICT (email) DO NOTHING
    `;

    return NextResponse.json({ ok: true, message: "You're on the list!" });
  } catch (err) {
    console.error('[waitlist] Error:', err);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
