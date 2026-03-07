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
import { findRestaurantData, getDirectOrderUrl } from '@/lib/restaurants';

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
  nyc: { lat: 40.7128, lng: -74.0060, taxRate: 0.08875 },
  chicago: { lat: 41.8781, lng: -87.6298, taxRate: 0.1025 },
  la: { lat: 34.0522, lng: -118.2437, taxRate: 0.095 },
  sf: { lat: 37.7749, lng: -122.4194, taxRate: 0.08625 },
  boston: { lat: 42.3601, lng: -71.0589, taxRate: 0.0625 },
  miami: { lat: 25.7617, lng: -80.1918, taxRate: 0.07 },
  dc: { lat: 38.9072, lng: -77.0369, taxRate: 0.10 },
  houston: { lat: 29.7604, lng: -95.3698, taxRate: 0.0825 },
  atlanta: { lat: 33.7490, lng: -84.3880, taxRate: 0.089 },
  seattle: { lat: 47.6062, lng: -122.3321, taxRate: 0.1025 },
  denver: { lat: 39.7392, lng: -104.9903, taxRate: 0.0877 },
  philly: { lat: 39.9526, lng: -75.1652, taxRate: 0.08 },
  nashville: { lat: 36.1627, lng: -86.7816, taxRate: 0.0975 },
  nola: { lat: 29.9511, lng: -90.0715, taxRate: 0.0945 },
  dallas: { lat: 32.7767, lng: -96.7970, taxRate: 0.0825 },
  phoenix: { lat: 33.4484, lng: -112.0740, taxRate: 0.086 },
  portland: { lat: 45.5152, lng: -122.6784, taxRate: 0.0 },
  detroit: { lat: 42.3314, lng: -83.0458, taxRate: 0.06 },
  minneapolis: { lat: 44.9778, lng: -93.2650, taxRate: 0.08025 },
  charlotte: { lat: 35.2271, lng: -80.8431, taxRate: 0.0725 },
  tampa: { lat: 27.9506, lng: -82.4572, taxRate: 0.075 },
  sandiego: { lat: 32.7157, lng: -117.1611, taxRate: 0.0775 },
  stlouis: { lat: 38.6270, lng: -90.1994, taxRate: 0.09679 },
  pittsburgh: { lat: 40.4406, lng: -79.9959, taxRate: 0.07 },
  columbus: { lat: 39.9612, lng: -82.9988, taxRate: 0.075 },
  indianapolis: { lat: 39.7684, lng: -86.1581, taxRate: 0.09 },
  milwaukee: { lat: 43.0389, lng: -87.9065, taxRate: 0.056 },
  raleigh: { lat: 35.7796, lng: -78.6382, taxRate: 0.0725 },
  baltimore: { lat: 39.2904, lng: -76.6122, taxRate: 0.06 },
};

interface CompareBody {
  sourcePlatform: Platform;
  restaurantName: string;
  items: CartItem[];
  deliveryAddress?: string;
  metro?: string;
  sessionId?: string;
  // Extension can provide pre-scraped data from other platforms
  clientData?: {
    platform: Platform;
    menuItems: Array<{ name: string; price: number }>;
  }[];
  // #1: Real fees scraped from the page by the extension
  realFees?: {
    subtotal: number;      // cents
    serviceFee: number;
    deliveryFee: number;
    tax: number;
    total: number;
    smallOrderFee?: number;
    promoDiscount?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: CompareBody = await req.json();
    const { sourcePlatform, restaurantName, metro = 'austin' } = body;

    if (!restaurantName || !body.items?.length) {
      return NextResponse.json({ error: 'Missing restaurantName or items' }, { status: 400 });
    }

    // Normalize all item prices to cents (extension sends dollars, UE API sends cents)
    // Heuristic: if max price < 100, it's dollars; otherwise already cents
    const maxPrice = Math.max(...body.items.map(i => i.price));
    const isCents = maxPrice >= 100;
    const items = body.items.map(i => ({
      ...i,
      price: isCents ? i.price : Math.round(i.price * 100),
    }));

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

    // Direct ordering — only include if we have a verified URL
    const directQuote = await estimateDirectQuote(restaurantName, items, coords, metro);
    if (directQuote) quotes.push(directQuote);

    // Pickup option (always cheapest if available)
    quotes.push(estimatePickupQuote(restaurantName, items, coords));

    // #1: If extension sent real fees, add the source platform with ACTUAL prices
    if (body.realFees) {
      const rf = body.realFees;
      quotes.push({
        platform: sourcePlatform,
        restaurant: { name: restaurantName },
        fees: {
          subtotal: rf.subtotal,
          platformMarkup: 0,
          serviceFee: rf.serviceFee,
          deliveryFee: rf.deliveryFee,
          smallOrderFee: rf.smallOrderFee ?? 0,
          tax: rf.tax,
          tip: 0,
          discount: rf.promoDiscount ?? 0,
          total: rf.total,
        },
        estimatedMinutes: null,
        available: true,
        deepLink: '',
        confidence: 1.0, // Real price = 100% confidence
        capturedAt: new Date().toISOString(),
      });
    }

    // Sort by total ascending
    quotes.sort((a, b) => a.fees.total - b.fees.total);

    // #4: Apply any known promo codes
    const promosApplied = await applyPromoCodes(quotes, metro);

    const result: ComparisonResult = {
      restaurantName,
      address: body.deliveryAddress ?? '',
      items,
      quotes,
      bestDeal: quotes.find(q => q.available) ?? null,
      savings: calculateSavings(quotes),
      comparedAt: new Date().toISOString(),
      ...(promosApplied.length > 0 ? { promoCodes: promosApplied } : {}),
    };

    // #7: Log comparison to price_comparisons table (non-blocking)
    logComparison(result, metro, sourcePlatform, body.sessionId, !!body.realFees).catch(() => {});

    // #3: Wrap deep links with affiliate parameters where available
    wrapAffiliateLinks(result.quotes);

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

    // Find the best name match — don't blindly take the first result
    const normalizedQuery = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let bestStore = null;
    let bestScore = 0;
    for (const s of stores) {
      const storeName = (s.store?.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      // Check if one contains the other, or significant overlap
      const score = storeName.includes(normalizedQuery) ? 1.0
        : normalizedQuery.includes(storeName) ? 0.9
        : normalizedQuery.split('').filter((c: string) => storeName.includes(c)).length / Math.max(normalizedQuery.length, 1);
      if (score > bestScore) {
        bestScore = score;
        bestStore = s.store;
      }
    }
    // Require at least 60% character overlap to avoid wrong-restaurant matches
    if (!bestStore || bestScore < 0.6) return null;

    const store = bestStore;
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

async function estimateDirectQuote(
  restaurantName: string,
  items: CartItem[],
  coords: { lat: number; lng: number; taxRate: number },
  metro?: string
): Promise<PlatformQuote | null> {
  // Only return a direct quote if we have a VERIFIED ordering URL
  const knownRestaurant = await findRestaurantData(restaurantName, metro);
  const directUrl = knownRestaurant ? getDirectOrderUrl(knownRestaurant) : null;
  
  if (!directUrl) return null; // Don't show fake "direct" options

  const platformSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const directSubtotal = Math.round(platformSubtotal * 0.88); // ~12% lower (no commission markup)
  const tax = Math.round(directSubtotal * coords.taxRate);
  const deliveryFee = 299; // Direct ordering typically has lower delivery fees

  return {
    platform: 'direct',
    restaurant: { name: `${restaurantName} (Direct)`, platformUrl: directUrl },
    fees: { subtotal: directSubtotal, platformMarkup: directSubtotal - platformSubtotal, serviceFee: 0, deliveryFee, smallOrderFee: 0, tax, tip: 0, discount: 0, total: directSubtotal + deliveryFee + tax },
    estimatedMinutes: null,
    available: true,
    deepLink: directUrl,
    confidence: 0.85,
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

// ─── #7: Price Comparison Logging ──────────────────────────────

import { getPool } from '@/lib/db';

async function logComparison(
  result: ComparisonResult,
  metro: string,
  sourcePlatform: string,
  sessionId?: string,
  isRealPrice?: boolean
): Promise<void> {
  const pool = getPool();
  const slug = result.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '');
  await pool.query(
    `INSERT INTO price_comparisons 
     (restaurant_name, restaurant_slug, metro, source_platform, quotes, best_platform, savings_cents, item_count, subtotal_cents, is_real_price, session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      result.restaurantName,
      slug,
      metro,
      sourcePlatform,
      JSON.stringify(result.quotes.map(q => ({ platform: q.platform, total: q.fees.total, confidence: q.confidence }))),
      result.bestDeal?.platform ?? null,
      result.savings,
      result.items.length,
      result.items.reduce((s, i) => s + i.price * i.quantity, 0),
      isRealPrice ?? false,
      sessionId ?? null,
    ]
  );
}

// ─── #3: Affiliate Link Wrapping ──────────────────────────────

const AFFILIATE_PARAMS: Record<string, string> = {
  // These get populated when Jon signs up for affiliate programs
  // doordash: 'ref=eddy&utm_source=eddy&utm_medium=extension',
  // ubereats: 'utm_source=eddy&utm_medium=extension',
  // grubhub: 'utm_source=eddy&utm_medium=extension',
};

function wrapAffiliateLinks(quotes: PlatformQuote[]): void {
  for (const quote of quotes) {
    const params = AFFILIATE_PARAMS[quote.platform];
    if (params && quote.deepLink) {
      const sep = quote.deepLink.includes('?') ? '&' : '?';
      quote.deepLink = `${quote.deepLink}${sep}${params}`;
    }
    // Always add UTM tracking
    if (quote.deepLink && !quote.deepLink.includes('utm_source')) {
      const sep = quote.deepLink.includes('?') ? '&' : '?';
      quote.deepLink = `${quote.deepLink}${sep}utm_source=eddy&utm_medium=extension`;
    }
  }
}

// ─── #4: Promo Code Application ───────────────────────────────

async function applyPromoCodes(
  quotes: PlatformQuote[],
  metro: string
): Promise<Array<{ platform: string; code: string; description: string; savingsCents: number }>> {
  const applied: Array<{ platform: string; code: string; description: string; savingsCents: number }> = [];
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM promo_codes 
       WHERE is_active = true AND first_order_only = false AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY discount_cents DESC NULLS LAST, discount_percent DESC NULLS LAST`
    );

    // Find the BEST single promo per platform (don't stack)
    const bestPerPlatform = new Map<string, { promo: typeof rows[0]; discount: number }>();
    for (const promo of rows) {
      const quote = quotes.find(q => q.platform === promo.platform && q.available);
      if (!quote) continue;
      if (promo.min_order_cents && quote.fees.subtotal < promo.min_order_cents) continue;

      let discount = 0;
      if (promo.discount_type === 'fixed' && promo.discount_cents) {
        discount = promo.discount_cents;
      } else if (promo.discount_type === 'percent' && promo.discount_percent) {
        discount = Math.round(quote.fees.subtotal * (promo.discount_percent / 100));
      }
      if (promo.max_discount_cents) discount = Math.min(discount, promo.max_discount_cents);
      // Cap discount at subtotal (can't go negative)
      discount = Math.min(discount, quote.fees.subtotal);

      const existing = bestPerPlatform.get(promo.platform);
      if (discount > 0 && (!existing || discount > existing.discount)) {
        bestPerPlatform.set(promo.platform, { promo, discount });
      }
    }

    // Apply best promo per platform
    for (const [platform, { promo, discount }] of bestPerPlatform) {
      const quote = quotes.find(q => q.platform === platform)!;
      quote.fees.discount = discount;
      quote.fees.total -= discount;
      applied.push({
        platform,
        code: promo.code,
        description: promo.description ?? `Save ${promo.discount_type === 'percent' ? promo.discount_percent + '%' : '$' + (promo.discount_cents / 100).toFixed(2)}`,
        savingsCents: discount,
      });
    }

    // Re-sort after applying promos
    quotes.sort((a, b) => a.fees.total - b.fees.total);
  } catch {
    // Non-critical — don't break comparisons if promo lookup fails
  }
  return applied;
}
