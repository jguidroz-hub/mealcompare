import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/savings?session=<id> — Get user's savings history
 * POST /api/savings — Record a savings event (user clicked a cheaper option)
 */

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session');
  if (!sessionId) {
    return NextResponse.json({ error: 'session parameter required' }, { status: 400 });
  }

  const pool = getPool();

  // Get individual savings
  const { rows: savings } = await pool.query(
    `SELECT us.*, pc.source_platform, pc.metro
     FROM user_savings us
     LEFT JOIN price_comparisons pc ON pc.id = us.comparison_id
     WHERE us.session_id = $1
     ORDER BY us.created_at DESC
     LIMIT 50`,
    [sessionId]
  );

  // Get totals
  const { rows: totals } = await pool.query(
    `SELECT 
       COUNT(*) as total_comparisons,
       COALESCE(SUM(savings_cents), 0) as total_savings_cents,
       COALESCE(AVG(savings_cents), 0) as avg_savings_cents,
       MAX(savings_cents) as best_savings_cents
     FROM user_savings
     WHERE session_id = $1`,
    [sessionId]
  );

  const stats = totals[0];

  return NextResponse.json({
    sessionId,
    totalComparisons: parseInt(stats.total_comparisons),
    totalSavingsCents: parseInt(stats.total_savings_cents),
    avgSavingsCents: Math.round(parseFloat(stats.avg_savings_cents)),
    bestSavingsCents: parseInt(stats.best_savings_cents) || 0,
    recentSavings: savings.map((s: any) => ({
      restaurantName: s.restaurant_name,
      savingsCents: s.savings_cents,
      chosenPlatform: s.chosen_platform,
      metro: s.metro,
      date: s.created_at,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, comparisonId, restaurantName, savingsCents, chosenPlatform } = await req.json();

    if (!sessionId || !restaurantName) {
      return NextResponse.json({ error: 'sessionId and restaurantName required' }, { status: 400 });
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO user_savings (session_id, comparison_id, restaurant_name, savings_cents, chosen_platform)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, comparisonId || null, restaurantName, savingsCents || 0, chosenPlatform || null]
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[savings] Error:', err);
    return NextResponse.json({ error: 'Failed to record savings' }, { status: 500 });
  }
}
