import { NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl, getAllMetros } from '@/lib/restaurants';

let cache: { data: any; expiry: number } | null = null;

export async function GET() {
  if (cache && cache.expiry > Date.now()) {
    return NextResponse.json(cache.data);
  }

  const metros = await getAllMetros();
  const stats: Record<string, { total: number; direct: number }> = {};
  let totalAll = 0;
  let directAll = 0;

  for (const metro of metros) {
    const restaurants = await getRestaurantsForMetro(metro);
    const direct = restaurants.filter(r => getDirectOrderUrl(r)).length;
    stats[metro] = { total: restaurants.length, direct };
    totalAll += restaurants.length;
    directAll += direct;
  }

  const data = { stats, totalRestaurants: totalAll, totalDirect: directAll, metros: metros.length };
  cache = { data, expiry: Date.now() + 10 * 60 * 1000 }; // 10 min cache
  return NextResponse.json(data);
}
