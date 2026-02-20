import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * POST /api/track-platform — Log when a restaurant owner clicks a platform CTA
 *
 * This data proves traffic value when applying to affiliate programs.
 * "We sent 500 restaurant owners to Toast's pricing page last month."
 */
export async function POST(req: NextRequest) {
  try {
    const { platform, source, metro } = await req.json();

    if (!platform) {
      return NextResponse.json({ ok: true }); // Silent fail
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO analytics_events (event, props, path, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [
        'platform_click',
        JSON.stringify({ platform, source: source || 'get-direct-ordering', metro: metro || null }),
        '/get-direct-ordering',
      ]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never break UX for tracking
  }
}

/**
 * GET /api/track-platform?summary=true — Platform click summary (admin)
 * Use this when applying to affiliate programs as proof of traffic value.
 */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    const result = await pool.query(`
      SELECT
        props->>'platform' as platform,
        COUNT(*) as clicks,
        COUNT(DISTINCT DATE(created_at)) as active_days,
        MIN(created_at) as first_click,
        MAX(created_at) as last_click
      FROM analytics_events
      WHERE event = 'platform_click'
      GROUP BY props->>'platform'
      ORDER BY clicks DESC
    `);

    const daily = await pool.query(`
      SELECT
        DATE(created_at) as date,
        props->>'platform' as platform,
        COUNT(*) as clicks
      FROM analytics_events
      WHERE event = 'platform_click'
        AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at), props->>'platform'
      ORDER BY date DESC
    `);

    return NextResponse.json({
      summary: result.rows,
      daily: daily.rows,
      affiliateNarrative: result.rows.map((r: any) =>
        `${r.platform}: ${r.clicks} restaurant owner clicks over ${r.active_days} days (first: ${r.first_click?.toISOString?.()?.split('T')[0]})`
      ),
    });
  } catch (err) {
    console.error('[track-platform] GET error:', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
