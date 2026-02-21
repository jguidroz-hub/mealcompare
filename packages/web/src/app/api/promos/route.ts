import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/promos?platform=doordash — Get active promo codes for a platform
 * POST /api/promos — Add promo codes (admin)
 */

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform');
  const pool = getPool();

  const query = platform
    ? 'SELECT * FROM promo_codes WHERE is_active = true AND platform = $1 AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY discount_cents DESC NULLS LAST'
    : 'SELECT * FROM promo_codes WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY platform, discount_cents DESC NULLS LAST';

  const { rows } = platform
    ? await pool.query(query, [platform])
    : await pool.query(query);

  return NextResponse.json({
    promos: rows.map((r: any) => ({
      platform: r.platform,
      code: r.code,
      description: r.description,
      discountType: r.discount_type,
      discountCents: r.discount_cents,
      discountPercent: r.discount_percent ? parseFloat(r.discount_percent) : null,
      minOrderCents: r.min_order_cents,
      maxDiscountCents: r.max_discount_cents,
      firstOrderOnly: r.first_order_only,
      expiresAt: r.expires_at,
      verifiedAt: r.verified_at,
    })),
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=300' },
  });
}

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const promos = Array.isArray(body.promos) ? body.promos : [body];
    const pool = getPool();
    let added = 0;

    for (const p of promos) {
      if (!p.platform || !p.code) continue;
      await pool.query(
        `INSERT INTO promo_codes (platform, code, description, discount_type, discount_cents, discount_percent, min_order_cents, max_discount_cents, first_order_only, expires_at, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT DO NOTHING`,
        [
          p.platform, p.code, p.description || null,
          p.discountType || 'fixed', p.discountCents || null, p.discountPercent || null,
          p.minOrderCents || 0, p.maxDiscountCents || null,
          p.firstOrderOnly || false, p.expiresAt || null, p.source || 'manual',
        ]
      );
      added++;
    }

    return NextResponse.json({ ok: true, added });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
