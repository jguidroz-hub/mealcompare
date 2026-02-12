#!/usr/bin/env npx tsx
/**
 * Test restaurant coverage: check which popular restaurants are searchable
 * and have menu data on Uber Eats.
 */

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

const AUSTIN_RESTAURANTS = [
  'Chipotle', 'Whataburger', 'Chick-fil-A', 'McDonald\'s', 'Taco Bell',
  'Raising Cane\'s', 'Wingstop', 'Panda Express', 'Five Guys', 'Torchy\'s Tacos',
  'P. Terry\'s', 'Popeyes', 'Wendy\'s', 'Shake Shack', 'In-N-Out Burger',
  'Mod Pizza', 'Jersey Mike\'s', 'Jimmy John\'s', 'Subway', 'Panera Bread',
];

const DC_RESTAURANTS = [
  'Chipotle', 'Sweetgreen', 'CAVA', 'Shake Shack', 'Five Guys',
  'Nando\'s Peri-Peri', 'Chick-fil-A', 'Wingstop', 'McDonald\'s', 'Panera Bread',
  'Founding Farmers', 'Ben\'s Chili Bowl', 'Busboys and Poets', 'Cane', 'Popeyes',
];

async function testRestaurant(name: string, lat: number, lng: number): Promise<{ name: string; found: boolean; menuItems: number; uuid?: string }> {
  try {
    // Rate limit
    await new Promise(r => setTimeout(r, 500));

    const searchRes = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({
        userQuery: name,
        vertical: 'ALL',
        searchSource: 'SEARCH_SUGGESTION',
        userLocation: { latitude: lat, longitude: lng },
      }),
    });

    if (!searchRes.ok) return { name, found: false, menuItems: 0 };

    const data = await searchRes.json();
    const store = (data?.data ?? []).find((s: any) => s.type === 'store')?.store;
    if (!store?.uuid) return { name, found: false, menuItems: 0 };

    // Get menu
    const menuRes = await fetch(`${UE_API}/getStoreV1?storeUuid=${store.uuid}`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({ storeUuid: store.uuid, sfNuggetCount: 0 }),
    });

    if (!menuRes.ok) return { name, found: true, menuItems: 0, uuid: store.uuid };

    const menuData = await menuRes.json();
    let count = 0;
    const sections = menuData?.data?.catalogSectionsMap ?? {};
    for (const rows of Object.values(sections)) {
      for (const row of (rows as any[]) ?? []) {
        count += (row?.payload?.standardItemsPayload?.catalogItems ?? []).length;
      }
    }

    return { name, found: true, menuItems: count, uuid: store.uuid };
  } catch {
    return { name, found: false, menuItems: 0 };
  }
}

async function main() {
  const metro = process.argv[2] || 'austin';
  const restaurants = metro === 'dc' ? DC_RESTAURANTS : AUSTIN_RESTAURANTS;
  const coords = metro === 'dc' ? { lat: 38.9072, lng: -77.0369 } : { lat: 30.2672, lng: -97.7431 };

  console.log(`\n🔍 Testing ${restaurants.length} restaurants in ${metro.toUpperCase()} on Uber Eats...\n`);

  let found = 0;
  let withMenu = 0;

  for (const name of restaurants) {
    const result = await testRestaurant(name, coords.lat, coords.lng);
    const status = result.found
      ? result.menuItems > 0
        ? `✅ ${result.menuItems} items`
        : '⚠️  Found, no menu'
      : '❌ Not found';

    console.log(`  ${status.padEnd(22)} ${name}`);

    if (result.found) found++;
    if (result.menuItems > 0) withMenu++;
  }

  console.log(`\n📊 Results: ${found}/${restaurants.length} found, ${withMenu}/${restaurants.length} with menu data`);
  console.log(`   Coverage: ${(withMenu / restaurants.length * 100).toFixed(0)}%\n`);
}

main().catch(console.error);
