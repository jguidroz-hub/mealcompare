import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * POST /api/restaurants/admin — Add or update restaurants
 * Protected by ADMIN_KEY header.
 * 
 * Body: { restaurants: [{ name, slug, category, metros, toastUrl?, squareUrl?, websiteOrderUrl?, ... }] }
 * or single: { name, slug, category, metros, ... }
 */
export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const items = Array.isArray(body.restaurants) ? body.restaurants : [body];
    const pool = getPool();
    let inserted = 0;
    let updated = 0;

    for (const r of items) {
      if (!r.name || !r.slug || !r.metros?.length) {
        continue; // skip invalid
      }

      // Upsert by slug + metros overlap
      const existing = await pool.query(
        'SELECT id FROM restaurants WHERE slug = $1 LIMIT 1',
        [r.slug]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE restaurants SET 
            name = $1, category = $2, metros = $3::text[],
            toast_url = $4, square_url = $5, website_order_url = $6,
            ubereats_slug = $7, doordash_slug = $8, is_chain = $9,
            updated_at = NOW()
          WHERE id = $10`,
          [
            r.name, r.category || 'restaurant', r.metros,
            r.toastUrl || null, r.squareUrl || null, r.websiteOrderUrl || null,
            r.ubereatsSlug || null, r.doordashSlug || null,
            r.isChain || r.metros.length >= 5,
            existing.rows[0].id,
          ]
        );
        updated++;
      } else {
        await pool.query(
          `INSERT INTO restaurants (name, slug, category, metros, toast_url, square_url, website_order_url, ubereats_slug, doordash_slug, is_chain)
           VALUES ($1, $2, $3, $4::text[], $5, $6, $7, $8, $9, $10)`,
          [
            r.name, r.slug, r.category || 'restaurant', r.metros,
            r.toastUrl || null, r.squareUrl || null, r.websiteOrderUrl || null,
            r.ubereatsSlug || null, r.doordashSlug || null,
            r.isChain || r.metros.length >= 5,
          ]
        );
        inserted++;
      }
    }

    const { rows } = await pool.query('SELECT COUNT(*) as count FROM restaurants');

    return NextResponse.json({
      ok: true,
      inserted,
      updated,
      skipped: items.length - inserted - updated,
      totalRestaurants: parseInt(rows[0].count),
    });
  } catch (err: any) {
    console.error('[admin/restaurants] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** DELETE /api/restaurants/admin?slug=chipotlemexicangrill */
export async function DELETE(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug parameter required' }, { status: 400 });
  }

  const pool = getPool();
  const result = await pool.query('DELETE FROM restaurants WHERE slug = $1', [slug]);

  return NextResponse.json({
    ok: true,
    deleted: result.rowCount,
  });
}
