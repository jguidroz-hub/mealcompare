import { NextRequest, NextResponse } from 'next/server';
import { ALL_RESTAURANTS, getDirectOrderUrl, type RestaurantData } from '@mealcompare/engine/src/data/top-restaurants';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim();
  const metro = req.nextUrl.searchParams.get('metro')?.toLowerCase().trim();
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 50);

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  let pool = ALL_RESTAURANTS;
  if (metro) {
    pool = pool.filter(r => r.metros.includes(metro));
  }

  const qNorm = q.replace(/[^a-z0-9\s]/g, '');
  const results = pool
    .filter(r => {
      const name = r.name.toLowerCase();
      return name.includes(q) || r.slug.includes(qNorm.replace(/\s/g, ''));
    })
    .slice(0, limit)
    .map(r => ({
      name: r.name,
      slug: r.slug,
      category: r.category,
      metros: r.metros,
      directUrl: getDirectOrderUrl(r),
      platform: r.toastUrl ? 'toast' : r.squareUrl ? 'square' : r.websiteOrderUrl ? 'direct' : null,
    }));

  return NextResponse.json({ results, total: results.length, query: q, metro: metro || null });
}
