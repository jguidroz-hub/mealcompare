import { NextResponse } from 'next/server';
import { getRestaurantsForMetro } from '@mealcompare/engine';

/**
 * GET /api/stats — Landing page stats
 */
export async function GET() {
  const dc = getRestaurantsForMetro('dc');
  const austin = getRestaurantsForMetro('austin');
  const all = [...dc, ...austin];
  // Deduplicate by slug
  const unique = [...new Map(all.map(r => [r.slug, r])).values()];

  const directOrderCount = unique.filter(
    r => r.toastUrl || r.squareUrl || r.websiteOrderUrl
  ).length;

  return NextResponse.json({
    totalRestaurants: unique.length,
    directOrderRestaurants: directOrderCount,
    dcRestaurants: dc.length,
    austinRestaurants: austin.length,
    metros: ['dc', 'austin'],
    avgSavingsPercent: 18,
  });
}
