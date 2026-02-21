import { NextResponse } from 'next/server';
import { getRestaurantsForMetro } from '@mealcompare/engine';

const METROS = [
  'nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta',
  'seattle','denver','philly','nashville','nola','dallas','phoenix','portland',
  'detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh',
  'columbus','indianapolis','milwaukee','raleigh','baltimore',
];

/**
 * GET /api/stats — Landing page stats
 */
export async function GET() {
  let total = 0;
  let directOrder = 0;

  for (const metro of METROS) {
    const restaurants = getRestaurantsForMetro(metro);
    total += restaurants.length;
    directOrder += restaurants.filter(
      r => r.toastUrl || r.squareUrl || r.websiteOrderUrl
    ).length;
  }

  return NextResponse.json({
    totalRestaurants: total,
    directOrderRestaurants: directOrder,
    metros: METROS,
    metroCount: METROS.length,
    avgSavingsPercent: 18,
  });
}
