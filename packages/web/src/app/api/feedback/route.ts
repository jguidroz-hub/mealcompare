import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { type, message, email, page, meta } = await req.json();

    if (!message || message.trim().length < 3) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 });
    }

    const db = getDb();
    await db`
      INSERT INTO feedback (type, message, email, page, meta, created_at)
      VALUES (${type || 'general'}, ${message.trim()}, ${email || null}, ${page || null}, ${JSON.stringify(meta || {})}, NOW())
    `;

    return NextResponse.json({ ok: true, message: 'Thanks for your feedback! We read every submission.' });
  } catch (e: any) {
    console.error('Feedback error:', e);
    return NextResponse.json({ ok: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const rows = await db`
    SELECT id, type, message, email, page, meta, created_at
    FROM feedback
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ count: rows.length, feedback: rows });
}
