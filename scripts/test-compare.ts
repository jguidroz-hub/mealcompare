#!/usr/bin/env npx tsx
/**
 * End-to-end comparison test.
 * Simulates: "User is on DoorDash ordering Whataburger in Austin.
 *             What would the same order cost on Uber Eats?"
 * 
 * Run: npx tsx scripts/test-compare.ts
 */

import { normalizeMenuItemName, formatCents } from '../packages/shared/src/index';

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

// Simulated DoorDash cart (prices from DD menu)
const DOORDASH_CART = {
  platform: 'doordash' as const,
  restaurantName: 'Whataburger',
  items: [
    { name: '#1 Whataburger', normalizedName: normalizeMenuItemName('#1 Whataburger'), price: 729, quantity: 1 },
    { name: 'French Fries - Medium', normalizedName: normalizeMenuItemName('French Fries - Medium'), price: 349, quantity: 1 },
    { name: 'Coca-Cola Medium', normalizedName: normalizeMenuItemName('Coca-Cola Medium'), price: 279, quantity: 1 },
  ],
  metro: 'austin',
};

async function main() {
  console.log('🍔 MealCompare E2E Test');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log(`📱 User is on DoorDash ordering from ${DOORDASH_CART.restaurantName}`);
  console.log(`📍 Metro: ${DOORDASH_CART.metro}\n`);
  
  console.log('🛒 DoorDash Cart:');
  let ddTotal = 0;
  for (const item of DOORDASH_CART.items) {
    console.log(`   ${item.name}: ${formatCents(item.price)} x${item.quantity}`);
    ddTotal += item.price * item.quantity;
  }
  console.log(`   Subtotal: ${formatCents(ddTotal)}\n`);

  // Search Uber Eats
  console.log('🔍 Searching Uber Eats for Whataburger in Austin...');
  const searchRes = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
    method: 'POST',
    headers: UE_HEADERS,
    body: JSON.stringify({
      userQuery: DOORDASH_CART.restaurantName,
      vertical: 'ALL',
      searchSource: 'SEARCH_SUGGESTION',
      userLocation: { latitude: 30.2672, longitude: -97.7431 },
    }),
  });

  const searchData = await searchRes.json();
  const store = (searchData?.data ?? []).find((s: any) => s.type === 'store')?.store;
  
  if (!store) {
    console.log('❌ Restaurant not found on Uber Eats');
    return;
  }

  console.log(`   Found: ${store.title} (${store.uuid})\n`);

  // Get menu
  console.log('📋 Fetching Uber Eats menu...');
  const menuRes = await fetch(`${UE_API}/getStoreV1?storeUuid=${store.uuid}`, {
    method: 'POST',
    headers: UE_HEADERS,
    body: JSON.stringify({ storeUuid: store.uuid, sfNuggetCount: 0 }),
  });

  const menuData = await menuRes.json();
  const menuItems: Array<{ name: string; normalizedName: string; price: number }> = [];
  
  const sections = menuData?.data?.catalogSectionsMap ?? {};
  for (const rows of Object.values(sections)) {
    for (const row of (rows as any[]) ?? []) {
      for (const item of row?.payload?.standardItemsPayload?.catalogItems ?? []) {
        if (item.title && item.price != null) {
          menuItems.push({
            name: item.title,
            normalizedName: normalizeMenuItemName(item.title),
            price: item.price,
          });
        }
      }
    }
  }

  console.log(`   Found ${menuItems.length} menu items\n`);

  // Match cart items
  console.log('🔄 Matching cart items to Uber Eats menu:');
  let ueSubtotal = 0;
  let matches = 0;

  for (const cartItem of DOORDASH_CART.items) {
    let bestMatch: { name: string; price: number; score: number } | null = null;

    for (const menuItem of menuItems) {
      const score = jaccard(cartItem.normalizedName, menuItem.normalizedName);
      if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { name: menuItem.name, price: menuItem.price, score };
      }
    }

    if (bestMatch) {
      const diff = bestMatch.price - cartItem.price;
      const symbol = diff > 0 ? '↑' : diff < 0 ? '↓' : '=';
      console.log(`   "${cartItem.name}" → "${bestMatch.name}"`);
      console.log(`     DD: ${formatCents(cartItem.price)} → UE: ${formatCents(bestMatch.price)} (${symbol}${formatCents(Math.abs(diff))}) [match: ${(bestMatch.score * 100).toFixed(0)}%]`);
      ueSubtotal += bestMatch.price * cartItem.quantity;
      matches++;
    } else {
      console.log(`   "${cartItem.name}" → ❌ No match (using DD price)`);
      ueSubtotal += cartItem.price * cartItem.quantity;
    }
  }

  console.log(`\n   Matched: ${matches}/${DOORDASH_CART.items.length} items\n`);

  // Fee comparison
  const ddFees = {
    subtotal: ddTotal,
    serviceFee: Math.min(Math.round(ddTotal * 0.15), 800),
    deliveryFee: 399,
    smallOrderFee: ddTotal < 1200 ? 250 : 0,
    tax: Math.round(ddTotal * 0.0825),
  };
  const ddGrandTotal = ddFees.subtotal + ddFees.serviceFee + ddFees.deliveryFee + ddFees.smallOrderFee + ddFees.tax;

  const ueFees = {
    subtotal: ueSubtotal,
    serviceFee: Math.min(Math.round(ueSubtotal * 0.15), 800),
    deliveryFee: 499,
    smallOrderFee: ueSubtotal < 1000 ? 200 : 0,
    tax: Math.round(ueSubtotal * 0.0825),
  };
  const ueGrandTotal = ueFees.subtotal + ueFees.serviceFee + ueFees.deliveryFee + ueFees.smallOrderFee + ueFees.tax;

  // Direct ordering estimate
  const directTotal = ddTotal + Math.round(ddTotal * 0.0825) + 499; // No markup, no service fee

  console.log('═══════════════════════════════════════════════════════');
  console.log('💰 PRICE COMPARISON');
  console.log('═══════════════════════════════════════════════════════\n');

  const platforms = [
    { name: 'DoorDash (current)', total: ddGrandTotal, fees: ddFees, real: false },
    { name: 'Uber Eats', total: ueGrandTotal, fees: ueFees, real: true },
    { name: 'Direct Order (est)', total: directTotal, fees: null, real: false },
  ].sort((a, b) => a.total - b.total);

  for (const p of platforms) {
    const isBest = p === platforms[0];
    const tag = isBest ? ' ← BEST PRICE' : '';
    const star = p.real ? '✅' : '📊';
    console.log(`${star} ${p.name}: ${formatCents(p.total)}${tag}`);
    if (p.fees) {
      console.log(`    Items: ${formatCents(p.fees.subtotal)} | Service: ${formatCents(p.fees.serviceFee)} | Delivery: ${formatCents(p.fees.deliveryFee)} | Tax: ${formatCents(p.fees.tax)}`);
    }
  }

  const savings = Math.max(...platforms.map(p => p.total)) - Math.min(...platforms.map(p => p.total));
  console.log(`\n🎯 Potential savings: ${formatCents(savings)}`);
  console.log('═══════════════════════════════════════════════════════\n');
}

function jaccard(a: string, b: string): number {
  const ta = new Set(a.split(/\s+/));
  const tb = new Set(b.split(/\s+/));
  const inter = new Set([...ta].filter(t => tb.has(t)));
  const union = new Set([...ta, ...tb]);
  return union.size > 0 ? inter.size / union.size : 0;
}

main().catch(console.error);
