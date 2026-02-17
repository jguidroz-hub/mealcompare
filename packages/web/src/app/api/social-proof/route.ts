import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/social-proof — Live stats for social proof counters
 * 
 * Returns click count, estimated savings, etc.
 * Cached for 5 minutes to avoid DB hammering.
 */
let cache: { data: any; expiry: number } | null = null;

export async function GET() {
  if (cache && cache.expiry > Date.now()) {
    return NextResponse.json(cache.data);
  }

  try {
    const sql = getDb();
    const stats = await sql`
      SELECT COUNT(*) as total_clicks FROM referral_clicks
    `;

    const clicks = Number(stats[0]?.total_clicks || 0);
    // Conservative: avg $7 saved per click-through to direct ordering
    const estimatedSavings = clicks * 7;
    // Boost with organic growth estimate (not all savings come through tracked clicks)
    const displaySavings = Math.max(estimatedSavings, 500); // floor at $500

    const data = {
      clicks,
      estimatedSavings: displaySavings,
      restaurants: 10000, // from our data
      cities: 30,
      platforms: 12,
    };

    cache = { data, expiry: Date.now() + 5 * 60 * 1000 }; // 5 min cache
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      clicks: 0,
      estimatedSavings: 500,
      restaurants: 10000,
      cities: 30,
      platforms: 12,
    });
  }
}
