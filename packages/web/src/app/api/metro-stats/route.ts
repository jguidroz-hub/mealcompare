import { NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl } from '@mealcompare/engine';

const METROS = [
  'nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta',
  'seattle','denver','philly','nashville','nola','dallas','phoenix','portland',
  'detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh',
  'columbus','indianapolis','milwaukee','raleigh','baltimore',
];

let cache: { data: any; expiry: number } | null = null;

export async function GET() {
  if (cache && cache.expiry > Date.now()) {
    return NextResponse.json(cache.data);
  }

  const stats: Record<string, { total: number; direct: number }> = {};
  let totalAll = 0;
  let directAll = 0;

  for (const metro of METROS) {
    const restaurants = getRestaurantsForMetro(metro);
    const direct = restaurants.filter(r => getDirectOrderUrl(r)).length;
    stats[metro] = { total: restaurants.length, direct };
    totalAll += restaurants.length;
    directAll += direct;
  }

  const data = { stats, totalRestaurants: totalAll, totalDirect: directAll, metros: METROS.length };
  cache = { data, expiry: Date.now() + 10 * 60 * 1000 }; // 10 min cache
  return NextResponse.json(data);
}
