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
 * Uber Eats = real prices (server-side API access)
 * DoorDash/Grubhub = estimates (blocked server-side)
 * Direct = estimated savings model (no markup, no service fee)
 */

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS: Record<string, string> = {
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
  // Extension can provide pre-scraped data from other platforms
  clientData?: {
    platform: Platform;
    menuItems: Array<{ name: string; price: number }>;
  }[];
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

    // Always try Uber Eats with real prices (unless that's the source)
    if (sourcePlatform !== 'ubereats') {
      const ueQuote = await getUberEatsQuote(restaurantName, items, coords);
      if (ueQuote) quotes.push(ueQuote);
    }

    // DoorDash estimate (or use client-scraped data if provided)
    if (sourcePlatform !== 'doordash') {
      const clientDD = body.clientData?.find(d => d.platform === 'doordash');
      if (clientDD) {
        quotes.push(buildQuoteFromClientData('doordash', restaurantName, items, clientDD.menuItems, coords));
      } else {
        quotes.push(estimatePlatformQuote('doordash', restaurantName, items, coords, 0.12, 0.15, 399));
      }
    }

    // Grubhub estimate (or use client-scraped data)
    if (sourcePlatform !== 'grubhub') {
      const clientGH = body.clientData?.find(d => d.platform === 'grubhub');
      if (clientGH) {
        quotes.push(buildQuoteFromClientData('grubhub', restaurantName, items, clientGH.menuItems, coords));
      } else {
        quotes.push(estimatePlatformQuote('grubhub', restaurantName, items, coords, 0.10, 0.12, 499));
      }
    }

    // Direct ordering (always include)
    quotes.push(estimateDirectQuote(restaurantName, items, coords));

    // Pickup option (always cheapest if available)
    quotes.push(estimatePickupQuote(restaurantName, items, coords));

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
    // Search
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
    if (!store?.uuid) return null;

    // Get menu
    const menuRes = await fetch(`${UE_API}/getStoreV1?storeUuid=${store.uuid}`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({ storeUuid: store.uuid, sfNuggetCount: 0 }),
    });

    if (!menuRes.ok) return null;
    const menuData = await menuRes.json();

    // Extract menu items
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

    // Match cart items
    let subtotal = 0;
    let matchedCount = 0;
    for (const cartItem of items) {
      const match = findBestMatch(cartItem, menuItems);
      if (match) {
        subtotal += match.price * cartItem.quantity;
        matchedCount++;
      } else {
        subtotal += cartItem.price * cartItem.quantity;
      }
    }

    const confidence = items.length > 0 ? matchedCount / items.length : 0;
    const serviceFee = Math.min(Math.round(subtotal * 0.15), 800);
    const deliveryFee = 499;
    const smallOrderFee = subtotal < 1000 ? 200 : 0;
    const tax = Math.round(subtotal * coords.taxRate);
    const sourceSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = subtotal + serviceFee + deliveryFee + smallOrderFee + tax;

    return {
      platform: 'ubereats',
      restaurant: {
        name: store.title ?? restaurantName,
        platformId: store.uuid,
        platformUrl: `https://www.ubereats.com/store/${store.slug}/${store.uuid}`,
      },
      fees: { subtotal, platformMarkup: subtotal - sourceSubtotal, serviceFee, deliveryFee, smallOrderFee, tax, tip: 0, discount: 0, total },
      estimatedMinutes: null,
      available: true,
      deepLink: `https://www.ubereats.com/store/${store.slug}/${store.uuid}`,
      confidence,
      capturedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[UberEats] Quote failed:', err);
    return null;
  }
}

// ─── Platform Estimates ────────────────────────────────────────

function estimatePlatformQuote(
  platform: Platform,
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number },
  markupRate: number,
  serviceFeeRate: number,
  baseDeliveryFee: number
): PlatformQuote {
  const sourceSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const markup = Math.round(sourceSubtotal * markupRate);
  const subtotal = sourceSubtotal + markup;
  const serviceFee = Math.min(Math.round(subtotal * serviceFeeRate), 800);
  const smallOrderFee = subtotal < 1200 ? 250 : 0;
  const tax = Math.round(subtotal * coords.taxRate);
  const total = subtotal + serviceFee + baseDeliveryFee + smallOrderFee + tax;

  const urls: Record<string, string> = {
    doordash: `https://www.doordash.com/search/store/${encodeURIComponent(restaurantName)}/`,
    grubhub: `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(restaurantName)}`,
  };

  return {
    platform,
    restaurant: { name: restaurantName, platformUrl: urls[platform] },
    fees: { subtotal, platformMarkup: markup, serviceFee, deliveryFee: baseDeliveryFee, smallOrderFee, tax, tip: 0, discount: 0, total },
    estimatedMinutes: null,
    available: true,
    deepLink: urls[platform] ?? '',
    confidence: 0.3,
    capturedAt: new Date().toISOString(),
  };
}

// ─── Client-Scraped Data Quote ─────────────────────────────────

function buildQuoteFromClientData(
  platform: Platform,
  restaurantName: string,
  items: CartItem[],
  menuItems: Array<{ name: string; price: number }>,
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  let subtotal = 0;
  let matchedCount = 0;
  const normalizedMenu = menuItems.map(m => ({ ...m, normalizedName: normalizeMenuItemName(m.name) }));

  for (const cartItem of items) {
    const match = findBestMatch(cartItem, normalizedMenu);
    if (match) {
      subtotal += match.price * cartItem.quantity;
      matchedCount++;
    } else {
      subtotal += cartItem.price * cartItem.quantity;
    }
  }

  const sourceSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const serviceFeeRate = platform === 'doordash' ? 0.15 : 0.12;
  const serviceFee = Math.min(Math.round(subtotal * serviceFeeRate), 800);
  const deliveryFee = platform === 'doordash' ? 399 : 499;
  const smallOrderFee = subtotal < 1200 ? 250 : 0;
  const tax = Math.round(subtotal * coords.taxRate);
  const total = subtotal + serviceFee + deliveryFee + smallOrderFee + tax;

  return {
    platform,
    restaurant: { name: restaurantName },
    fees: { subtotal, platformMarkup: subtotal - sourceSubtotal, serviceFee, deliveryFee, smallOrderFee, tax, tip: 0, discount: 0, total },
    estimatedMinutes: null,
    available: true,
    deepLink: '',
    confidence: items.length > 0 ? matchedCount / items.length : 0,
    capturedAt: new Date().toISOString(),
  };
}

// ─── Direct Ordering ───────────────────────────────────────────

function estimateDirectQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  const platformSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const directSubtotal = Math.round(platformSubtotal * 0.88); // ~12% lower (no commission markup)
  const tax = Math.round(directSubtotal * coords.taxRate);
  const deliveryFee = 499;
  const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    platform: 'direct',
    restaurant: { name: `${restaurantName} (Direct)`, platformUrl: `https://order.toasttab.com/online/${slug}` },
    fees: { subtotal: directSubtotal, platformMarkup: directSubtotal - platformSubtotal, serviceFee: 0, deliveryFee, smallOrderFee: 0, tax, tip: 0, discount: 0, total: directSubtotal + deliveryFee + tax },
    estimatedMinutes: null,
    available: true,
    deepLink: `https://www.google.com/search?q=${encodeURIComponent(restaurantName + ' order online direct')}`,
    confidence: 0.6,
    capturedAt: new Date().toISOString(),
  };
}

// ─── Pickup ────────────────────────────────────────────────────

function estimatePickupQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number }
): PlatformQuote {
  const platformSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const directSubtotal = Math.round(platformSubtotal * 0.88);
  const tax = Math.round(directSubtotal * coords.taxRate);

  return {
    platform: 'pickup',
    restaurant: { name: `${restaurantName} (Pickup)` },
    fees: { subtotal: directSubtotal, platformMarkup: directSubtotal - platformSubtotal, serviceFee: 0, deliveryFee: 0, smallOrderFee: 0, tax, tip: 0, discount: 0, total: directSubtotal + tax },
    estimatedMinutes: null,
    available: true,
    deepLink: `https://www.google.com/maps/search/${encodeURIComponent(restaurantName)}`,
    confidence: 0.7,
    capturedAt: new Date().toISOString(),
  };
}

// ─── Matching ──────────────────────────────────────────────────

function findBestMatch(
  cartItem: CartItem,
  menuItems: Array<{ name: string; price: number; normalizedName?: string }>
): { name: string; price: number } | null {
  const target = cartItem.normalizedName;
  let best: { name: string; price: number; score: number } | null = null;

  for (const menuItem of menuItems) {
    const menuNorm = menuItem.normalizedName ?? normalizeMenuItemName(menuItem.name);
    const score = similarity(target, menuNorm);
    if (score > 0.50 && (!best || score > best.score)) {
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
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;

  // Containment bonus
  if (a.length >= 3 && b.includes(a)) return Math.max(jaccard, 0.8);
  if (b.length >= 3 && a.includes(b)) return Math.max(jaccard, 0.8);

  // Numbered item match (#1, #2)
  const numA = a.match(/^#(\d+)/);
  const numB = b.match(/^#(\d+)/);
  if (numA && numB && numA[1] === numB[1]) return Math.max(jaccard, 0.75);

  return jaccard;
}
