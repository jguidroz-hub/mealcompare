import { NextResponse } from 'next/server';
import { ALL_RESTAURANTS, getDirectOrderUrl } from '@mealcompare/engine/src/data/top-restaurants';

/**
 * Public stats API — aggregate data for partnership pitches and public pages.
 * GET /api/stats
 */
export async function GET() {
  const total = ALL_RESTAURANTS.length;
  const withDirect = ALL_RESTAURANTS.filter(r => getDirectOrderUrl(r)).length;
  const toastCount = ALL_RESTAURANTS.filter(r => r.toastUrl).length;
  const squareCount = ALL_RESTAURANTS.filter(r => r.squareUrl).length;
  const websiteCount = ALL_RESTAURANTS.filter(r => r.websiteOrderUrl && !r.toastUrl && !r.squareUrl).length;

  // Metro breakdown
  const metroSet = new Set<string>();
  ALL_RESTAURANTS.forEach(r => r.metros.forEach(m => metroSet.add(m)));
  const metros = Array.from(metroSet).sort().map(metro => {
    const restaurants = ALL_RESTAURANTS.filter(r => r.metros.includes(metro));
    const direct = restaurants.filter(r => getDirectOrderUrl(r));
    return {
      metro,
      total: restaurants.length,
      directOrdering: direct.length,
      coverage: Math.round((direct.length / restaurants.length) * 100),
      toast: restaurants.filter(r => r.toastUrl).length,
    };
  });

  return NextResponse.json({
    totalRestaurants: total,
    directOrderingUrls: withDirect,
    platforms: { toast: toastCount, square: squareCount, website: websiteCount },
    metroCount: metros.length,
    metros,
    lastUpdated: '2026-03-07',
  });
}
