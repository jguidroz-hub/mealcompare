import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl } from '@mealcompare/engine';

/**
 * GET /api/restaurants?metro=austin
 * 
 * Returns top restaurants for a metro with their direct ordering URLs.
 * Used by the extension to show "order direct" suggestions.
 */
export async function GET(req: NextRequest) {
  const metro = req.nextUrl.searchParams.get('metro') ?? 'austin';
  const restaurants = getRestaurantsForMetro(metro);

  const result = restaurants.map(r => ({
    name: r.name,
    category: r.category,
    directUrl: getDirectOrderUrl(r),
    hasToast: !!r.toastUrl,
    hasSquare: !!r.squareUrl,
    hasWebsite: !!r.websiteOrderUrl,
  }));

  return NextResponse.json({
    metro,
    count: result.length,
    restaurants: result,
  });
}
