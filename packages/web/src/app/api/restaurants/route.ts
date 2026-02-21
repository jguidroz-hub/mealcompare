import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl } from '@/lib/restaurants';

/**
 * GET /api/restaurants?metro=austin
 * 
 * Returns top restaurants for a metro with their direct ordering URLs.
 * Now backed by Postgres — adding restaurants is just an INSERT.
 */
export async function GET(req: NextRequest) {
  const metro = req.nextUrl.searchParams.get('metro') ?? 'austin';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '1000'), 1000);
  const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase();
  const cat = req.nextUrl.searchParams.get('category');
  const directOnly = req.nextUrl.searchParams.get('direct') === '1';

  let restaurants = await getRestaurantsForMetro(metro);
  const total = restaurants.length;

  // Filter
  if (q) restaurants = restaurants.filter(r => r.name.toLowerCase().includes(q));
  if (cat && cat !== 'All') restaurants = restaurants.filter(r => r.category === cat);

  const result = restaurants.map(r => ({
    name: r.name,
    category: r.category,
    directUrl: getDirectOrderUrl(r),
    hasToast: !!r.toastUrl,
    hasSquare: !!r.squareUrl,
    hasWebsite: !!r.websiteOrderUrl,
  }));

  // Sort: direct ordering first
  result.sort((a, b) => (b.directUrl ? 1 : 0) - (a.directUrl ? 1 : 0));

  const filtered = directOnly ? result.filter(r => r.directUrl) : result;
  const page = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    metro,
    total,
    count: filtered.length,
    offset,
    limit,
    hasMore: offset + limit < filtered.length,
    restaurants: page,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
