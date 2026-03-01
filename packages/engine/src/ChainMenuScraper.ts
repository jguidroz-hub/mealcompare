/**
 * Chain Menu Scraper — Phase 2
 * 
 * Fetches live menu prices from delivery platforms for known chains,
 * matches against canonical items, and calculates markup percentages.
 */

import { normalizeMenuItemName } from '@mealcompare/shared';
import { findChain, getChainMenuItems, ChainMenu } from './data/chain-menus';

export interface PlatformPrice {
  platform: string;
  itemName: string;       // Platform's name for the item
  price: number;          // In cents
  matchConfidence: number; // 0-1
}

export interface ChainPriceComparison {
  chainName: string;
  canonicalName: string;
  category: string;
  basePrice: number; // In-store/direct price (cents)
  platformPrices: PlatformPrice[];
  bestPlatform: string | null;
  bestPrice: number | null;
  worstMarkup: number | null; // Percentage markup vs base (e.g. 0.15 = 15%)
  fetchedAt: string;
}

export interface ChainComparisonResult {
  chain: string;
  metro: string;
  items: ChainPriceComparison[];
  totalBasket: {
    baseTotal: number;
    platformTotals: Record<string, number>;
    bestPlatform: string;
    bestTotal: number;
    savings: number; // vs worst platform
  };
  fetchedAt: string;
}

const UE_API = 'https://www.ubereats.com/api';
const UE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  austin: { lat: 30.2672, lng: -97.7431 },
  dc: { lat: 38.9072, lng: -77.0369 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  houston: { lat: 29.7604, lng: -95.3698 },
  dallas: { lat: 32.7767, lng: -96.7970 },
  atlanta: { lat: 33.7490, lng: -84.3880 },
  miami: { lat: 25.7617, lng: -80.1918 },
  denver: { lat: 39.7392, lng: -104.9903 },
  phoenix: { lat: 33.4484, lng: -112.0740 },
  seattle: { lat: 47.6062, lng: -122.3321 },
  boston: { lat: 42.3601, lng: -71.0589 },
  nyc: { lat: 40.7128, lng: -74.0060 },
  la: { lat: 34.0522, lng: -118.2437 },
  sf: { lat: 37.7749, lng: -122.4194 },
  portland: { lat: 45.5155, lng: -122.6789 },
  nashville: { lat: 36.1627, lng: -86.7816 },
  philly: { lat: 39.9526, lng: -75.1652 },
  sanantonio: { lat: 29.4241, lng: -98.4936 },
  charlotte: { lat: 35.2271, lng: -80.8431 },
  minneapolis: { lat: 44.9778, lng: -93.2650 },
};

/**
 * Fetch UberEats menu for a chain in a specific metro.
 * Returns raw menu items with prices.
 */
async function fetchUberEatsMenu(
  chainName: string,
  metro: string
): Promise<Array<{ name: string; normalizedName: string; price: number }> | null> {
  const coords = METRO_COORDS[metro];
  if (!coords) return null;

  try {
    // Search for the chain
    const searchRes = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({
        userQuery: chainName,
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

    // Fetch menu
    const menuRes = await fetch(`${UE_API}/getStoreV1?storeUuid=${store.uuid}`, {
      method: 'POST',
      headers: UE_HEADERS,
      body: JSON.stringify({ storeUuid: store.uuid, sfNuggetCount: 0 }),
    });

    if (!menuRes.ok) return null;
    const menuData = await menuRes.json();

    // Extract all menu items
    const items: Array<{ name: string; normalizedName: string; price: number }> = [];
    const sections = menuData?.data?.catalogSectionsMap ?? {};
    for (const rows of Object.values(sections)) {
      for (const row of (rows as any[]) ?? []) {
        for (const item of row?.payload?.standardItemsPayload?.catalogItems ?? []) {
          if (item.title && item.price != null) {
            items.push({
              name: item.title,
              normalizedName: normalizeMenuItemName(item.title),
              price: item.price, // UE prices are in cents
            });
          }
        }
      }
    }

    return items;
  } catch (err) {
    console.error(`[ChainMenuScraper] UberEats fetch failed for ${chainName} in ${metro}:`, err);
    return null;
  }
}

/**
 * Match platform menu items against canonical chain items.
 */
function matchMenuItems(
  chain: ChainMenu,
  platformItems: Array<{ name: string; normalizedName: string; price: number }>,
  platform: string
): ChainPriceComparison[] {
  const canonicalItems = getChainMenuItems(chain);
  const results: ChainPriceComparison[] = [];

  for (const canonical of canonicalItems) {
    if (canonical.basePrice === 0) continue; // Skip add-on items

    let bestMatch: { name: string; price: number; confidence: number } | null = null;

    for (const platformItem of platformItems) {
      const confidence = matchConfidence(canonical.matchNames, platformItem.normalizedName, canonical.name);
      if (confidence > 0.5 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { name: platformItem.name, price: platformItem.price, confidence };
      }
    }

    const platformPrices: PlatformPrice[] = [];
    if (bestMatch) {
      platformPrices.push({
        platform,
        itemName: bestMatch.name,
        price: bestMatch.price,
        matchConfidence: bestMatch.confidence,
      });
    }

    results.push({
      chainName: chain.chainName,
      canonicalName: canonical.name,
      category: canonical.category,
      basePrice: canonical.basePrice,
      platformPrices,
      bestPlatform: bestMatch ? platform : null,
      bestPrice: bestMatch?.price ?? null,
      worstMarkup: bestMatch ? (bestMatch.price - canonical.basePrice) / canonical.basePrice : null,
      fetchedAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Calculate match confidence between canonical names and a platform item name.
 */
function matchConfidence(
  canonicalNames: string[],
  platformNormalized: string,
  displayName: string
): number {
  let best = 0;

  for (const canonical of canonicalNames) {
    const normalizedCanonical = normalizeMenuItemName(canonical);
    
    // Exact match
    if (normalizedCanonical === platformNormalized) return 1.0;
    
    // Containment
    if (platformNormalized.includes(normalizedCanonical) || normalizedCanonical.includes(platformNormalized)) {
      const lenRatio = Math.min(normalizedCanonical.length, platformNormalized.length) / 
                       Math.max(normalizedCanonical.length, platformNormalized.length);
      best = Math.max(best, 0.6 + lenRatio * 0.3);
      continue;
    }

    // Token overlap (Jaccard)
    const tokensA = new Set(normalizedCanonical.split(/\s+/));
    const tokensB = new Set(platformNormalized.split(/\s+/));
    const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);
    const jaccard = union.size > 0 ? intersection.size / union.size : 0;
    best = Math.max(best, jaccard);
  }

  return best;
}

/**
 * Compare a chain's menu across platforms for a given metro.
 */
export async function compareChainPrices(
  chainName: string,
  metro: string = 'austin'
): Promise<ChainComparisonResult | null> {
  const chain = findChain(chainName);
  if (!chain) return null;

  // Fetch from UberEats
  const ueItems = await fetchUberEatsMenu(chain.chainName, metro);
  
  let items: ChainPriceComparison[] = [];
  if (ueItems && ueItems.length > 0) {
    items = matchMenuItems(chain, ueItems, 'ubereats');
  } else {
    // Return baseline prices only
    const canonicalItems = getChainMenuItems(chain);
    items = canonicalItems
      .filter(c => c.basePrice > 0)
      .map(c => ({
        chainName: chain.chainName,
        canonicalName: c.name,
        category: c.category,
        basePrice: c.basePrice,
        platformPrices: [],
        bestPlatform: null,
        bestPrice: null,
        worstMarkup: null,
        fetchedAt: new Date().toISOString(),
      }));
  }

  // Calculate basket totals
  const baseTotal = items.reduce((sum, i) => sum + i.basePrice, 0);
  const platformTotals: Record<string, number> = {};
  
  for (const item of items) {
    for (const pp of item.platformPrices) {
      platformTotals[pp.platform] = (platformTotals[pp.platform] ?? 0) + pp.price;
    }
  }

  const platforms = Object.entries(platformTotals);
  const bestEntry = platforms.sort((a, b) => a[1] - b[1])[0];
  const worstEntry = platforms.sort((a, b) => b[1] - a[1])[0];

  return {
    chain: chain.chainName,
    metro,
    items,
    totalBasket: {
      baseTotal,
      platformTotals,
      bestPlatform: bestEntry?.[0] ?? 'direct',
      bestTotal: bestEntry?.[1] ?? baseTotal,
      savings: worstEntry && bestEntry ? worstEntry[1] - bestEntry[1] : 0,
    },
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Batch compare all chains for a metro.
 * Rate-limited to avoid UberEats throttling.
 */
export async function batchCompareChains(
  metro: string = 'austin',
  limit: number = 50,
  delayMs: number = 2000
): Promise<ChainComparisonResult[]> {
  const { ACTIVE_CHAINS } = await import('./data/chain-menus');
  const results: ChainComparisonResult[] = [];
  
  const chains = ACTIVE_CHAINS.slice(0, limit);
  
  for (const chain of chains) {
    try {
      const result = await compareChainPrices(chain.chainName, metro);
      if (result) results.push(result);
    } catch (err) {
      console.error(`[ChainMenuScraper] Failed for ${chain.chainName}:`, err);
    }
    
    // Rate limit
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

export { findChain, ACTIVE_CHAINS } from './data/chain-menus';
