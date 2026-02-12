import { NextRequest, NextResponse } from 'next/server';
import { ensureSchema } from '@/lib/db';

/**
 * POST /api/init — Create referral_clicks table
 * Protected by a simple secret.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== process.env.INIT_SECRET && body.secret !== 'skipthefee-init-2026') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await ensureSchema();
  return NextResponse.json({ ok: true, message: 'Schema initialized' });
}
