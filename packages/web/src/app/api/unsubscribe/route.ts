import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    await pool.query(
      `INSERT INTO email_unsubscribes (email, source)
       VALUES ($1, 'email_campaign')
       ON CONFLICT (email) DO NOTHING`,
      [normalized]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Also support GET for one-click unsubscribe links
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    await pool.query(
      `INSERT INTO email_unsubscribes (email, source)
       VALUES ($1, 'email_campaign')
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim()]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
