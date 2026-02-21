import { NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl, getAllMetros } from '@/lib/restaurants';

/**
 * GET /api/stats — Landing page stats (from Postgres)
 * Counts per-metro (a chain in 30 metros = counted 30 times)
 * for consistency with how the homepage displays coverage.
 */
export async function GET() {
  const metros = await getAllMetros();
  let total = 0;
  let directOrder = 0;

  for (const metro of metros) {
    const restaurants = await getRestaurantsForMetro(metro);
    total += restaurants.length;
    directOrder += restaurants.filter(r => getDirectOrderUrl(r)).length;
  }

  return NextResponse.json({
    totalRestaurants: total,
    directOrderRestaurants: directOrder,
    metros,
    metroCount: metros.length,
    avgSavingsPercent: 18,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
