import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * POST /api/community — Submit a direct ordering URL for a restaurant
 * Called from the extension when no match is found.
 */
export async function POST(req: NextRequest) {
  try {
    const { restaurantName, metro, directUrl, platformUrl, submittedBy } = await req.json();

    if (!restaurantName || !directUrl) {
      return NextResponse.json({ error: 'restaurantName and directUrl required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(directUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const pool = getPool();

    // Check for duplicate
    const existing = await pool.query(
      'SELECT id FROM community_submissions WHERE lower(restaurant_name) = lower($1) AND metro = $2 AND status != $3 LIMIT 1',
      [restaurantName, metro || 'unknown', 'rejected']
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already submitted — thank you!' });
    }

    await pool.query(
      `INSERT INTO community_submissions (restaurant_name, metro, direct_url, platform_url, submitted_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [restaurantName, metro || 'unknown', directUrl, platformUrl || null, submittedBy || null]
    );

    return NextResponse.json({ ok: true, message: 'Thanks! We\'ll verify and add this restaurant.' });
  } catch (err: any) {
    console.error('[community] Error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}

/**
 * GET /api/community — List pending submissions (admin)
 */
export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = getPool();
  const status = req.nextUrl.searchParams.get('status') ?? 'pending';
  const { rows } = await pool.query(
    'SELECT * FROM community_submissions WHERE status = $1 ORDER BY created_at DESC LIMIT 100',
    [status]
  );

  return NextResponse.json({ submissions: rows });
}

/**
 * PATCH /api/community — Approve/reject a submission (admin)
 * Approved submissions get auto-added to the restaurants table.
 */
export async function PATCH(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'id and action (approve/reject) required' }, { status: 400 });
    }

    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM community_submissions WHERE id = $1', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const sub = rows[0];

    if (action === 'approve') {
      // Add to restaurants table
      const slug = sub.restaurant_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      await pool.query(
        `INSERT INTO restaurants (name, slug, category, metros, website_order_url)
         VALUES ($1, $2, 'restaurant', $3::text[], $4)
         ON CONFLICT DO NOTHING`,
        [sub.restaurant_name, slug, [sub.metro], sub.direct_url]
      );
    }

    await pool.query(
      'UPDATE community_submissions SET status = $1, reviewed_at = NOW() WHERE id = $2',
      [action === 'approve' ? 'approved' : 'rejected', id]
    );

    return NextResponse.json({ ok: true, status: action === 'approve' ? 'approved' : 'rejected' });
  } catch (err: any) {
    console.error('[community] PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
