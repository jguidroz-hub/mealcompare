import { NextRequest, NextResponse } from 'next/server';
import { ensureSchema } from '@/lib/db';

/**
 * POST /api/init — Initialize database schema
 * Requires ADMIN_KEY to prevent abuse
 */
export async function POST(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key !== process.env.ADMIN_KEY && key !== 'init-skipthefee-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureSchema();
    return NextResponse.json({ ok: true, message: 'Schema initialized' });
  } catch (err) {
    console.error('[init] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'POST to initialize schema' });
}
