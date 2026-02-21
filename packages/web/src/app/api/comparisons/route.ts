import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/comparisons?restaurant=chipotle&metro=austin — Price history for a restaurant
 * Used for price tracking charts and "best time to order" insights.
 */
export async function GET(req: NextRequest) {
  const restaurant = req.nextUrl.searchParams.get('restaurant');
  const metro = req.nextUrl.searchParams.get('metro');
  const days = Math.min(parseInt(req.nextUrl.searchParams.get('days') || '30'), 90);

  if (!restaurant) {
    return NextResponse.json({ error: 'restaurant parameter required' }, { status: 400 });
  }

  const pool = getPool();
  const slug = restaurant.toLowerCase().replace(/[^a-z0-9]/g, '');

  const conditions = ['restaurant_slug = $1', 'created_at > NOW() - $2::interval'];
  const params: any[] = [slug, `${days} days`];

  if (metro) {
    conditions.push('metro = $3');
    params.push(metro);
  }

  const { rows } = await pool.query(
    `SELECT quotes, savings_cents, source_platform, is_real_price, created_at
     FROM price_comparisons
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT 100`,
    params
  );

  // Aggregate: average total per platform over time
  const platformTotals: Record<string, number[]> = {};
  for (const row of rows) {
    const quotes = typeof row.quotes === 'string' ? JSON.parse(row.quotes) : row.quotes;
    for (const q of quotes) {
      if (!platformTotals[q.platform]) platformTotals[q.platform] = [];
      platformTotals[q.platform].push(q.total);
    }
  }

  const platformAvg: Record<string, number> = {};
  for (const [platform, totals] of Object.entries(platformTotals)) {
    platformAvg[platform] = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
  }

  return NextResponse.json({
    restaurant: slug,
    metro: metro ?? 'all',
    period: `${days}_days`,
    totalComparisons: rows.length,
    platformAverages: platformAvg,
    avgSavingsCents: rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + r.savings_cents, 0) / rows.length)
      : 0,
    history: rows.slice(0, 20).map((r: any) => ({
      quotes: r.quotes,
      savings: r.savings_cents,
      sourcePlatform: r.source_platform,
      isRealPrice: r.is_real_price,
      date: r.created_at,
    })),
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  });
}
