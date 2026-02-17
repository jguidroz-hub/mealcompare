import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * POST /api/events — Log analytics events
 * 
 * Body: { event, props, sessionId, referrer, ua, path }
 * 
 * Events:
 * - page_view: user visited a page
 * - search: user searched for something
 * - category_filter: user filtered by category
 * - metro_select: user selected a city
 * - order_click: user clicked "Order Direct" (also logged in /api/track)
 * - extension_install: user started extension install flow
 * - calculator_use: user interacted with savings calculator
 * - claim_view: restaurant owner viewed claim page
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, props, sessionId, referrer, path } = body;

    if (!event) {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 });
    }

    const sql = getDb();
    const ua = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '';
    const isMobile = /mobile|android|iphone/i.test(ua);

    await sql`
      INSERT INTO analytics_events (event, props, session_id, referrer, path, user_agent, ip_hash, is_mobile)
      VALUES (
        ${event}, 
        ${JSON.stringify(props || {})}, 
        ${sessionId || null}, 
        ${referrer || null}, 
        ${path || null},
        ${ua.slice(0, 200)},
        ${ip ? ip.split('.').slice(0, 2).join('.') + '.x.x' : null},
        ${isMobile}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[events] Error:', err);
    return NextResponse.json({ ok: true }); // Silent — don't break UX
  }
}

/**
 * GET /api/events?summary=true — Analytics dashboard data
 */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getDb();

    const totals = await sql`
      SELECT event, COUNT(*) as count 
      FROM analytics_events 
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY event ORDER BY count DESC
    `;

    const daily = await sql`
      SELECT DATE(created_at) as date, COUNT(*) as events, COUNT(DISTINCT session_id) as sessions
      FROM analytics_events 
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date DESC
    `;

    const topSearches = await sql`
      SELECT props->>'query' as query, COUNT(*) as count
      FROM analytics_events 
      WHERE event = 'search' AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY props->>'query' ORDER BY count DESC LIMIT 20
    `;

    const topMetros = await sql`
      SELECT props->>'metro' as metro, COUNT(*) as count
      FROM analytics_events 
      WHERE event = 'metro_select' AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY props->>'metro' ORDER BY count DESC
    `;

    const deviceSplit = await sql`
      SELECT is_mobile, COUNT(*) as count
      FROM analytics_events 
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY is_mobile
    `;

    return NextResponse.json({ totals, daily, topSearches, topMetros, deviceSplit });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
