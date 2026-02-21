import { NextResponse } from 'next/server';
import { countRestaurants, getAllMetros } from '@/lib/restaurants';

/**
 * GET /api/stats — Landing page stats (now from Postgres)
 */
export async function GET() {
  const { total, withDirect } = await countRestaurants();
  const metros = await getAllMetros();

  return NextResponse.json({
    totalRestaurants: total,
    directOrderRestaurants: withDirect,
    metros,
    metroCount: metros.length,
    avgSavingsPercent: 18,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
