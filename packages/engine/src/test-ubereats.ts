#!/usr/bin/env npx tsx
/**
 * Quick test: Search Uber Eats for a restaurant and get menu prices.
 * Run: npx tsx packages/engine/src/test-ubereats.ts
 */

const UE_API = 'https://www.ubereats.com/api';
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

async function searchRestaurant(name: string, lat: number, lng: number) {
  const res = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      userQuery: name,
      vertical: 'ALL',
      searchSource: 'SEARCH_SUGGESTION',
      userLocation: { latitude: lat, longitude: lng },
    }),
  });

  const data = await res.json();
  const stores = (data?.data ?? [])
    .filter((s: any) => s.type === 'store')
    .map((s: any) => ({
      name: s.store?.title,
      uuid: s.store?.uuid,
      slug: s.store?.slug,
    }));

  return stores;
}

async function getMenu(storeUuid: string) {
  const res = await fetch(`${UE_API}/getStoreV1?storeUuid=${storeUuid}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ storeUuid, sfNuggetCount: 0 }),
  });

  const data = await res.json();
  const items: Array<{ name: string; price: number; category: string }> = [];

  const sections = data?.data?.catalogSectionsMap ?? {};
  for (const [sectionId, rows] of Object.entries(sections)) {
    for (const row of (rows as any[]) ?? []) {
      const sectionTitle = row?.payload?.standardItemsPayload?.title?.title ?? sectionId;
      for (const item of row?.payload?.standardItemsPayload?.catalogItems ?? []) {
        if (item.title && item.price != null) {
          items.push({
            name: item.title,
            price: item.price,
            category: sectionTitle,
          });
        }
      }
    }
  }

  return items;
}

async function main() {
  const restaurant = process.argv[2] || 'Chipotle';
  const metro = process.argv[3] || 'austin';
  
  const coords = metro === 'dc' 
    ? { lat: 38.9072, lng: -77.0369 }
    : { lat: 30.2672, lng: -97.7431 };

  console.log(`\n🔍 Searching Uber Eats for "${restaurant}" in ${metro}...\n`);
  
  const stores = await searchRestaurant(restaurant, coords.lat, coords.lng);
  
  if (stores.length === 0) {
    console.log('No stores found.');
    return;
  }

  console.log(`Found ${stores.length} store(s):`);
  for (const s of stores) {
    console.log(`  📍 ${s.name} (${s.uuid})`);
  }

  const store = stores[0];
  console.log(`\n📋 Fetching menu for ${store.name}...\n`);

  const items = await getMenu(store.uuid);
  
  let currentCat = '';
  for (const item of items.slice(0, 30)) {
    if (item.category !== currentCat) {
      currentCat = item.category;
      console.log(`\n  --- ${currentCat} ---`);
    }
    console.log(`  ${item.name}: $${(item.price / 100).toFixed(2)}`);
  }

  console.log(`\n✅ Total menu items: ${items.length}`);
}

main().catch(console.error);
