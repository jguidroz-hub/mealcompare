import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * POST /api/track — Log a referral click
 * 
 * Body: { restaurant, slug, metro, source, directUrl }
 * 
 * This is our proof-of-value for future affiliate negotiations.
 * Every click = evidence we drive orders to restaurants.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurant, slug, metro, source, directUrl } = body;

    if (!restaurant || !slug || !metro) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      INSERT INTO referral_clicks (restaurant_name, restaurant_slug, metro, source, direct_url)
      VALUES (${restaurant}, ${slug}, ${metro}, ${source || 'pwa'}, ${directUrl || null})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Don't let tracking failures break the user experience
    console.error('[track] Error:', err);
    return NextResponse.json({ ok: true }); // Silent success — tracking is best-effort
  }
}

/**
 * GET /api/track?slug=chipotle — Get click stats for a restaurant
 * GET /api/track?summary=true — Get overall summary
 */
export async function GET(req: NextRequest) {
  try {
    const sql = getDb();
    const slug = req.nextUrl.searchParams.get('slug');
    const summary = req.nextUrl.searchParams.get('summary');

    if (slug) {
      const clicks = await sql`
        SELECT 
          restaurant_name,
          restaurant_slug,
          metro,
          COUNT(*) as total_clicks,
          COUNT(DISTINCT DATE(created_at)) as active_days,
          MIN(created_at) as first_click,
          MAX(created_at) as last_click
        FROM referral_clicks 
        WHERE restaurant_slug = ${slug}
        GROUP BY restaurant_name, restaurant_slug, metro
      `;

      const daily = await sql`
        SELECT DATE(created_at) as date, COUNT(*) as clicks
        FROM referral_clicks 
        WHERE restaurant_slug = ${slug}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `;

      return NextResponse.json({
        restaurant: clicks[0] || null,
        daily,
        estimatedRevenue: clicks[0] ? Number(clicks[0].total_clicks) * 35 : 0, // $35 avg order
      });
    }

    if (summary) {
      const stats = await sql`
        SELECT 
          COUNT(*) as total_clicks,
          COUNT(DISTINCT restaurant_slug) as unique_restaurants,
          COUNT(DISTINCT metro) as metros,
          COUNT(DISTINCT DATE(created_at)) as active_days
        FROM referral_clicks
      `;

      const topRestaurants = await sql`
        SELECT restaurant_name, restaurant_slug, metro, COUNT(*) as clicks
        FROM referral_clicks
        GROUP BY restaurant_name, restaurant_slug, metro
        ORDER BY clicks DESC
        LIMIT 20
      `;

      const byMetro = await sql`
        SELECT metro, COUNT(*) as clicks
        FROM referral_clicks
        GROUP BY metro
        ORDER BY clicks DESC
      `;

      return NextResponse.json({
        ...stats[0],
        estimatedRevenueDriven: stats[0] ? Number(stats[0].total_clicks) * 35 : 0,
        topRestaurants,
        byMetro,
      });
    }

    return NextResponse.json({ error: 'Pass ?slug=X or ?summary=true' }, { status: 400 });
  } catch (err) {
    console.error('[track] GET error:', err);
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }
}
