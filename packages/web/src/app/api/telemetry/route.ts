import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * POST /api/telemetry — Unified telemetry endpoint
 * 
 * Events: install, heartbeat, overlay_shown, no_match, likely_order
 * 
 * This is the data that sells Eddy:
 * - installs + refs = ambassador ROI
 * - heartbeats = DAU/WAU/MAU
 * - overlay_shown = proof we're active
 * - no_match = restaurants that NEED direct ordering (Toast pitch)
 * - likely_order = estimated conversion
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, ...props } = body;

    if (!event) {
      return NextResponse.json({ error: 'event required' }, { status: 400 });
    }

    const sql = getDb();

    // Store all events in a unified telemetry table
    await sql`
      INSERT INTO telemetry_events (event, session_id, ref, metro, campus, props)
      VALUES (
        ${event},
        ${props.sessionId || null},
        ${props.ref || null},
        ${props.metro || null},
        ${props.campus || null},
        ${JSON.stringify(props)}::jsonb
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[telemetry] Error:', err);
    return NextResponse.json({ ok: true }); // Never fail — telemetry is best-effort
  }
}

/**
 * GET /api/telemetry?key=ADMIN_KEY — Telemetry summary
 * GET /api/telemetry?key=ADMIN_KEY&event=no_match — Filter by event type
 * GET /api/telemetry?key=ADMIN_KEY&campus=ut-austin — Filter by campus
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sql = getDb();
  const eventFilter = req.nextUrl.searchParams.get('event');
  const campusFilter = req.nextUrl.searchParams.get('campus');
  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');

  // Active users (DAU/WAU/MAU)
  const activeUsers = await sql`
    SELECT 
      COUNT(DISTINCT CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN session_id END) as dau,
      COUNT(DISTINCT CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN session_id END) as wau,
      COUNT(DISTINCT CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN session_id END) as mau
    FROM telemetry_events
    WHERE event = 'heartbeat'
  `;

  // Total installs
  const installs = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT ref) as unique_refs,
      COUNT(CASE WHEN ref IS NOT NULL THEN 1 END) as attributed
    FROM telemetry_events
    WHERE event = 'install'
  `;

  // Installs by ref (ambassador attribution)
  const installsByRef = await sql`
    SELECT ref, COUNT(*) as installs
    FROM telemetry_events
    WHERE event = 'install' AND ref IS NOT NULL
    GROUP BY ref
    ORDER BY installs DESC
    LIMIT 20
  `;

  // No-match restaurants (Toast/ChowNow pitch data)
  const noMatchRestaurants = await sql`
    SELECT 
      props->>'restaurant' as restaurant,
      props->>'metro' as metro,
      COUNT(*) as searches,
      COUNT(DISTINCT session_id) as unique_users
    FROM telemetry_events
    WHERE event = 'no_match'
      AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY props->>'restaurant', props->>'metro'
    ORDER BY searches DESC
    LIMIT 30
  `;

  // Overlay shown (match found) — top restaurants
  const topMatches = await sql`
    SELECT 
      props->>'restaurant' as restaurant,
      COUNT(*) as impressions,
      COUNT(DISTINCT session_id) as unique_users
    FROM telemetry_events
    WHERE event = 'overlay_shown'
      AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY props->>'restaurant'
    ORDER BY impressions DESC
    LIMIT 20
  `;

  // Likely orders (conversion tracking)
  const likelyOrders = await sql`
    SELECT 
      COUNT(*) as total_likely_orders,
      COUNT(DISTINCT session_id) as unique_converters,
      COUNT(DISTINCT props->>'restaurant') as unique_restaurants
    FROM telemetry_events
    WHERE event = 'likely_order'
      AND created_at > NOW() - INTERVAL '30 days'
  `;

  // Daily activity (last N days)
  const dailyActivity = await sql`
    SELECT 
      DATE(created_at) as day,
      COUNT(DISTINCT CASE WHEN event = 'heartbeat' THEN session_id END) as active_users,
      COUNT(CASE WHEN event = 'overlay_shown' THEN 1 END) as overlays,
      COUNT(CASE WHEN event = 'no_match' THEN 1 END) as no_matches,
      COUNT(CASE WHEN event = 'likely_order' THEN 1 END) as likely_orders,
      COUNT(CASE WHEN event = 'install' THEN 1 END) as installs
    FROM telemetry_events
    WHERE created_at > NOW() - (${days} || ' days')::INTERVAL
    GROUP BY DATE(created_at)
    ORDER BY day DESC
  `;

  // Campus breakdown
  const byCampus = await sql`
    SELECT 
      campus,
      COUNT(DISTINCT session_id) as users,
      COUNT(*) as events
    FROM telemetry_events
    WHERE campus IS NOT NULL AND campus != ''
      AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY campus
    ORDER BY users DESC
  `;

  // Referral click totals (from existing referral_clicks table)
  const referralClicks = await sql`
    SELECT 
      COUNT(*) as total_clicks,
      COUNT(DISTINCT restaurant_slug) as unique_restaurants
    FROM referral_clicks
    WHERE created_at > NOW() - INTERVAL '30 days'
  `;

  return NextResponse.json({
    period: `last_${days}_days`,
    activeUsers: activeUsers[0],
    installs: {
      ...installs[0],
      byRef: installsByRef,
    },
    engagement: {
      topMatches,
      likelyOrders: likelyOrders[0],
      referralClicks: referralClicks[0],
    },
    gaps: {
      noMatchRestaurants,
      noMatchCount: noMatchRestaurants.reduce((sum: number, r: any) => sum + Number(r.searches), 0),
    },
    byCampus,
    dailyActivity,
  });
}
