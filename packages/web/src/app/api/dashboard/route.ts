import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/dashboard?token=<dashboard_token> — Restaurant dashboard data
 * Shows: comparison impressions, direct ordering clicks, estimated savings for the restaurant
 */

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const slug = req.nextUrl.searchParams.get('slug');

  // Public aggregate stats (no auth needed) for /for-restaurants page
  if (!token && !slug) {
    return getAggregateStats();
  }

  // Restaurant-specific dashboard (needs token OR admin key)
  const adminKey = req.headers.get('x-admin-key');
  const pool = getPool();

  let restaurantSlug: string | null = null;

  if (token) {
    const { rows } = await pool.query(
      'SELECT restaurant_name FROM restaurant_claims WHERE dashboard_token = $1 AND verified = true',
      [token]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or unverified token' }, { status: 401 });
    }
    restaurantSlug = rows[0].restaurant_name.toLowerCase().replace(/[^a-z0-9]/g, '');
  } else if (slug && adminKey === process.env.ADMIN_KEY) {
    restaurantSlug = slug;
  } else {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Get comparison data for this restaurant
  const { rows: comparisons } = await pool.query(
    `SELECT 
       COUNT(*) as total_comparisons,
       COUNT(CASE WHEN best_platform = 'direct' THEN 1 END) as direct_wins,
       COALESCE(AVG(savings_cents), 0) as avg_savings,
       COUNT(DISTINCT metro) as metros_seen
     FROM price_comparisons
     WHERE restaurant_slug = $1 AND created_at > NOW() - INTERVAL '30 days'`,
    [restaurantSlug]
  );

  // Get referral clicks
  const { rows: clicks } = await pool.query(
    `SELECT COUNT(*) as total_clicks
     FROM referral_clicks
     WHERE restaurant_slug = $1 AND created_at > NOW() - INTERVAL '30 days'`,
    [restaurantSlug]
  );

  // Daily trend (last 30 days)
  const { rows: dailyTrend } = await pool.query(
    `SELECT 
       date_trunc('day', created_at)::date as day,
       COUNT(*) as comparisons
     FROM price_comparisons
     WHERE restaurant_slug = $1 AND created_at > NOW() - INTERVAL '30 days'
     GROUP BY day ORDER BY day`,
    [restaurantSlug]
  );

  const stats = comparisons[0];
  const directClicks = parseInt(clicks[0]?.total_clicks ?? '0');
  // Average platform commission is ~25% — direct ordering saves the restaurant that
  const estimatedCommissionSaved = Math.round(directClicks * 25 * 0.25); // avg $25 order * 25% commission

  return NextResponse.json({
    restaurant: restaurantSlug,
    period: 'last_30_days',
    totalComparisons: parseInt(stats.total_comparisons),
    directOrderWins: parseInt(stats.direct_wins),
    directOrderClicks: directClicks,
    estimatedCommissionSavedCents: estimatedCommissionSaved,
    avgSavingsForCustomerCents: Math.round(parseFloat(stats.avg_savings)),
    metrosActive: parseInt(stats.metros_seen),
    dailyTrend: dailyTrend.map((d: any) => ({ day: d.day, comparisons: parseInt(d.comparisons) })),
  });
}

async function getAggregateStats() {
  const pool = getPool();

  const { rows: totals } = await pool.query(`
    SELECT 
      COUNT(*) as total_comparisons,
      COUNT(DISTINCT restaurant_slug) as unique_restaurants,
      COALESCE(SUM(savings_cents), 0) as total_savings,
      COUNT(DISTINCT metro) as metros_active
    FROM price_comparisons
    WHERE created_at > NOW() - INTERVAL '30 days'
  `);

  const { rows: topRestaurants } = await pool.query(`
    SELECT restaurant_name, restaurant_slug, COUNT(*) as comparisons
    FROM price_comparisons
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY restaurant_name, restaurant_slug
    ORDER BY comparisons DESC
    LIMIT 10
  `);

  const stats = totals[0];
  return NextResponse.json({
    period: 'last_30_days',
    totalComparisons: parseInt(stats.total_comparisons),
    uniqueRestaurants: parseInt(stats.unique_restaurants),
    totalSavingsCents: parseInt(stats.total_savings),
    metrosActive: parseInt(stats.metros_active),
    topRestaurants: topRestaurants.map((r: any) => ({
      name: r.restaurant_name,
      comparisons: parseInt(r.comparisons),
    })),
  });
}
