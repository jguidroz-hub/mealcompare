import { NextRequest, NextResponse } from 'next/server';
import {
  Platform,
  CartItem,
  PlatformQuote,
  ComparisonResult,
  FeeBreakdown,
  normalizeMenuItemName,
  calculateSavings,
} from '@mealcompare/shared';

/**
 * POST /api/compare
 * 
 * Takes a cart from one platform and returns price comparison across others.
 * 
 * Server-side capabilities:
 * - Uber Eats: FULL (search + menu + real prices)
 * - DoorDash: Estimates only (Cloudflare blocks server-side)
 * - Grubhub: Estimates only (auth required)
 * 
 * The Chrome extension supplements with client-side scraping for DD/GH.
 */

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

const METRO_COORDS: Record<string, { lat: number; lng: number; taxRate: number }> = {
  austin: { lat: 30.2672, lng: -97.7431, taxRate: 0.0825 },
  dc: { lat: 38.9072, lng: -77.0369, taxRate: 0.10 },
};

interface CompareBody {
  sourcePlatform: Platform;
  restaurantName: string;
  items: CartItem[];
  deliveryAddress?: string;
  metro?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CompareBody = await req.json();
    const { sourcePlatform, restaurantName, items, metro = 'austin' } = body;

    if (!restaurantName || !items?.length) {
      return NextResponse.json({ error: 'Missing restaurantName or items' }, { status: 400 });
    }

    const coords = METRO_COORDS[metro] ?? METRO_COORDS.austin;
    const quotes: PlatformQuote[] = [];

    // Always try Uber Eats (unless that's the source platform)
    if (sourcePlatform !== 'ubereats') {
      const ueQuote = await getUberEatsQuote(restaurantName, items, coords);
      if (ueQuote) quotes.push(ueQuote);
    }

    // DoorDash estimate (server-side can't get real prices)
    if (sourcePlatform !== 'doordash') {
      quotes.push(estimateDoorDashQuote(restaurantName, items, coords));
    }

    // Grubhub estimate
    if (sourcePlatform !== 'grubhub') {
      quotes.push(estimateGrubhubQuote(restaurantName, items, coords));
    }

    // Direct ordering estimate (always include — this is MealCompare's key value)
    quotes.push(estimateDirectQuote(restaurantName, items, coords));

    // Sort by total ascending
    quotes.sort((a, b) => a.fees.total - b.fees.total);

    const result: ComparisonResult = {
      restaurantName,
      address: body.deliveryAddress ?? '',
      items,
      quotes,
      bestDeal: quotes.find(q => q.available) ?? null,
      savings: calculateSavings(quotes),
      comparedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[compare] Error:', err);
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
  }
}

// ─── Uber Eats (Real Prices) ──────────────────────────────────

async function getUberEatsQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): Promise<PlatformQuote | null> {
  try {
    // 1. Search
    const searchRes = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({
        userQuery: restaurantName,
        vertical: 'ALL',
        searchSource: 'SEARCH_SUGGESTION',
        userLocation: { latitude: coords.lat, longitude: coords.lng },
      }),
    });

    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const stores = (searchData?.data ?? []).filter((s: any) => s.type === 'store');
    if (stores.length === 0) return null;

    const store = stores[0].store;
    const storeUuid = store?.uuid;
    if (!storeUuid) return null;

    // 2. Get menu
    const menuRes = await fetch(`${UE_API}/getStoreV1?storeUuid=${storeUuid}`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({ storeUuid, sfNuggetCount: 0 }),
    });

    if (!menuRes.ok) return null;

    const menuData = await menuRes.json();

    // 3. Extract all menu items
    const menuItems: Array<{ name: string; normalizedName: string; price: number }> = [];
    const sections = menuData?.data?.catalogSectionsMap ?? {};
    for (const rows of Object.values(sections)) {
      for (const row of (rows as any[]) ?? []) {
        for (const item of row?.payload?.standardItemsPayload?.catalogItems ?? []) {
          if (item.title && item.price != null) {
            menuItems.push({
              name: item.title,
              normalizedName: normalizeMenuItemName(item.title),
              price: item.price, // Already in cents
            });
          }
        }
      }
    }

    // 4. Match cart items to UE menu
    let subtotal = 0;
    let matchedCount = 0;

    for (const cartItem of items) {
      const match = findBestMatch(cartItem, menuItems);
      if (match) {
        subtotal += match.price * cartItem.quantity;
        matchedCount++;
      } else {
        // Use source price as fallback
        subtotal += cartItem.price * cartItem.quantity;
      }
    }

    const confidence = items.length > 0 ? matchedCount / items.length : 0;

    // 5. Estimate fees
    const serviceFee = Math.min(Math.round(subtotal * 0.15), 800);
    const deliveryFee = 499; // Default UE delivery fee
    const smallOrderFee = subtotal < 1000 ? 200 : 0;
    const tax = Math.round(subtotal * coords.taxRate);
    const sourceSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const total = subtotal + serviceFee + deliveryFee + smallOrderFee + tax;

    return {
      platform: 'ubereats',
      restaurant: {
        name: store.title ?? restaurantName,
        platformId: storeUuid,
        platformUrl: `https://www.ubereats.com/store/${store.slug}/${storeUuid}`,
      },
      fees: {
        subtotal,
        platformMarkup: subtotal - sourceSubtotal,
        serviceFee,
        deliveryFee,
        smallOrderFee,
        tax,
        tip: 0,
        discount: 0,
        total,
      },
      estimatedMinutes: null,
      available: true,
      deepLink: `https://www.ubereats.com/store/${store.slug}/${storeUuid}`,
      confidence,
      capturedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[UberEats] Quote failed:', err);
    return null;
  }
}

// ─── DoorDash (Estimate Only) ─────────────────────────────────

function estimateDoorDashQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  // Use source prices + DoorDash's known fee structure
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  // DoorDash typically marks up 10-15% vs direct
  const markup = Math.round(subtotal * 0.12);
  const adjustedSubtotal = subtotal + markup;

  const serviceFee = Math.min(Math.round(adjustedSubtotal * 0.15), 800);
  const deliveryFee = 399;
  const smallOrderFee = adjustedSubtotal < 1200 ? 250 : 0;
  const tax = Math.round(adjustedSubtotal * coords.taxRate);
  const total = adjustedSubtotal + serviceFee + deliveryFee + smallOrderFee + tax;

  return {
    platform: 'doordash',
    restaurant: {
      name: restaurantName,
      platformUrl: `https://www.doordash.com/search/store/${encodeURIComponent(restaurantName)}/`,
    },
    fees: {
      subtotal: adjustedSubtotal,
      platformMarkup: markup,
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax,
      tip: 0,
      discount: 0,
      total,
    },
    estimatedMinutes: null,
    available: true,
    unavailableReason: undefined,
    deepLink: `https://www.doordash.com/search/store/${encodeURIComponent(restaurantName)}/`,
    confidence: 0.3, // Low — estimate only
    capturedAt: new Date().toISOString(),
  };
}

// ─── Grubhub (Estimate Only) ──────────────────────────────────

function estimateGrubhubQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const markup = Math.round(subtotal * 0.10);
  const adjustedSubtotal = subtotal + markup;

  const serviceFee = Math.round(adjustedSubtotal * 0.12);
  const deliveryFee = 499;
  const smallOrderFee = adjustedSubtotal < 1200 ? 200 : 0;
  const tax = Math.round(adjustedSubtotal * coords.taxRate);
  const total = adjustedSubtotal + serviceFee + deliveryFee + smallOrderFee + tax;

  return {
    platform: 'grubhub',
    restaurant: {
      name: restaurantName,
      platformUrl: `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(restaurantName)}`,
    },
    fees: {
      subtotal: adjustedSubtotal,
      platformMarkup: markup,
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax,
      tip: 0,
      discount: 0,
      total,
    },
    estimatedMinutes: null,
    available: true,
    deepLink: `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(restaurantName)}`,
    confidence: 0.3,
    capturedAt: new Date().toISOString(),
  };
}

// ─── Direct Ordering via Toast/Square (Key Value Prop) ─────────

function estimateDirectQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  // Direct ordering = no platform markup, no service fee
  // Menu prices are typically 10-15% lower than DD/UE/GH because
  // restaurants don't need to offset the 28-33% platform commission
  const platformSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Estimate direct menu prices (12% lower than platform prices on average)
  const directSubtotal = Math.round(platformSubtotal * 0.88);
  const platformMarkup = directSubtotal - platformSubtotal; // Negative = savings

  const tax = Math.round(directSubtotal * coords.taxRate);
  const deliveryFee = 499; // Toast/Square flat ~$4.99

  // Build Toast URL (best guess)
  const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const toastUrl = `https://order.toasttab.com/online/${slug}`;

  return {
    platform: 'direct',
    restaurant: {
      name: `${restaurantName} (Direct Order)`,
      platformUrl: toastUrl,
    },
    fees: {
      subtotal: directSubtotal,
      platformMarkup,        // Negative = no markup, actually cheaper
      serviceFee: 0,         // $0 service fee (vs $2-8 on platforms)
      deliveryFee,           // Flat rate (vs demand-priced on platforms)
      smallOrderFee: 0,      // No small order fee
      tax,
      tip: 0,
      discount: 0,
      total: directSubtotal + deliveryFee + tax,
    },
    estimatedMinutes: null,
    available: true,
    deepLink: `https://www.google.com/search?q=${encodeURIComponent(restaurantName + ' order online direct')}`,
    confidence: 0.6, // Higher than DD/GH estimates — direct pricing pattern is reliable
    capturedAt: new Date().toISOString(),
  };
}

// ─── Matching ──────────────────────────────────────────────────

function findBestMatch(
  cartItem: CartItem,
  menuItems: Array<{ name: string; normalizedName: string; price: number }>
): { name: string; price: number } | null {
  const target = cartItem.normalizedName;
  let best: { name: string; price: number; score: number } | null = null;

  for (const menuItem of menuItems) {
    const score = similarity(target, menuItem.normalizedName);
    if (score > 0.55 && (!best || score > best.score)) {
      best = { name: menuItem.name, price: menuItem.price, score };
    }
  }

  return best;
}

function similarity(a: string, b: string): number {
  if (a === b) return 1.0;
  const tokensA = new Set(a.split(/\s+/));
  const tokensB = new Set(b.split(/\s+/));
  const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
  const union = new Set([...tokensA, ...tokensB]);
  return union.size > 0 ? intersection.size / union.size : 0;
}
