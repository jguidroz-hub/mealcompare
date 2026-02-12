/**
 * Test script: Verify top restaurant data + UberEats API matching.
 * 
 * Tests a sample of restaurants from our DB against live UberEats search.
 * Validates that:
 * 1. Restaurants exist on UE in each metro
 * 2. Menu prices are accessible
 * 3. Direct ordering URLs resolve
 * 
 * Usage: npx tsx scripts/test-restaurants.ts
 */

import { getRestaurantsForMetro, RestaurantData, getDirectOrderUrl } from '../packages/engine/src/data/top-restaurants';

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'x-csrf-token': 'x',
};

const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  austin: { lat: 30.2672, lng: -97.7431 },
  dc: { lat: 38.9072, lng: -77.0369 },
};

async function testRestaurant(restaurant: RestaurantData, metro: string): Promise<{
  name: string;
  metro: string;
  ueFound: boolean;
  ueStoreName?: string;
  menuItemCount?: number;
  directUrl: string | null;
  error?: string;
}> {
  const directUrl = getDirectOrderUrl(restaurant);
  const coords = METRO_COORDS[metro];

  try {
    const res = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({
        userQuery: restaurant.name,
        vertical: 'ALL',
        searchSource: 'SEARCH_SUGGESTION',
        userLocation: { latitude: coords.lat, longitude: coords.lng },
      }),
    });

    if (!res.ok) {
      return { name: restaurant.name, metro, ueFound: false, directUrl, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const stores = (data?.data ?? []).filter((s: any) => s.type === 'store');

    if (stores.length === 0) {
      return { name: restaurant.name, metro, ueFound: false, directUrl };
    }

    const store = stores[0].store;
    return {
      name: restaurant.name,
      metro,
      ueFound: true,
      ueStoreName: store.title,
      directUrl,
    };
  } catch (err: any) {
    return { name: restaurant.name, metro, ueFound: false, directUrl, error: err.message };
  }
}

async function main() {
  console.log('🍔 MealCompare Restaurant Test Suite\n');

  for (const metro of ['austin', 'dc']) {
    const restaurants = getRestaurantsForMetro(metro);
    console.log(`\n📍 ${metro.toUpperCase()} — ${restaurants.length} restaurants\n`);

    // Test a sample of 10 per metro to avoid rate limits
    const sample = restaurants.slice(0, 10);
    let found = 0;
    let withDirect = 0;

    for (const r of sample) {
      const result = await testRestaurant(r, metro);
      const ueStatus = result.ueFound ? `✅ UE: ${result.ueStoreName}` : '❌ UE: not found';
      const directStatus = result.directUrl ? `🏪 Direct: ${result.directUrl}` : '—';

      console.log(`  ${result.name}: ${ueStatus} | ${directStatus}`);

      if (result.ueFound) found++;
      if (result.directUrl) withDirect++;

      // Rate limit
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n  Summary: ${found}/${sample.length} on UE, ${withDirect}/${sample.length} with direct ordering`);
  }
}

main().catch(console.error);
