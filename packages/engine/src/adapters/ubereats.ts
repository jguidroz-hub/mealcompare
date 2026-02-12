import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * Uber Eats adapter.
 * 
 * DATA ACCESS STRATEGY:
 * 1. Search: GET https://www.ubereats.com/api/getSearchSuggestionsV1?q={query}
 * 2. Menu: GET store page → parse DOM (data-testid selectors)
 *    - Menu items: li[data-testid^="store-item-"]
 *    - Item name/price: span[data-testid="rich-text"] (first = name, second = price)
 * 3. Uber Eats requires JS rendering for menu pages — 
 *    v0: Use server-side fetch for search API (returns JSON), 
 *    headless browser for menu scraping
 * 4. Fallback: Use public feed API endpoint
 */

const UE_API = 'https://www.ubereats.com/api';

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'x-csrf-token': 'x',
};

const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  austin: { lat: 30.2672, lng: -97.7431 },
  dc: { lat: 38.9072, lng: -77.0369 },
};

export class UberEatsAdapter implements PlatformAdapter {
  platform: Platform = 'ubereats';

  async findRestaurant(
    name: string,
    address?: string,
    metro?: string
  ): Promise<RestaurantMatch[]> {
    const coords = METRO_COORDS[metro ?? 'austin'];

    try {
      // Uber Eats search suggestions endpoint
      const res = await fetch(`${UE_API}/getSearchSuggestionsV1?localeCode=en-US`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          userQuery: name,
          date: '',
          startTime: 0,
          endTime: 0,
          vertical: 'ALL',
          searchSource: 'SEARCH_SUGGESTION',
          userLocation: {
            latitude: coords.lat,
            longitude: coords.lng,
          },
        }),
      });

      if (!res.ok) return this.fallbackSearch(name);

      const data = await res.json();
      const suggestions = data?.data?.suggestions ?? [];

      return suggestions
        .filter((s: any) => s.type === 'STORE')
        .slice(0, 5)
        .map((s: any) => ({
          name: s.store?.title ?? s.text ?? name,
          platformId: s.store?.storeUuid,
          platformUrl: s.store?.storeUuid
            ? `https://www.ubereats.com/store/${s.store.slug}/${s.store.storeUuid}`
            : undefined,
        }));
    } catch (err) {
      console.error('[UberEats] Search failed:', err);
      return this.fallbackSearch(name);
    }
  }

  private fallbackSearch(name: string): RestaurantMatch[] {
    return [{
      name,
      platformUrl: `https://www.ubereats.com/search?q=${encodeURIComponent(name)}`,
    }];
  }

  async getMenuPrices(
    restaurant: RestaurantMatch,
    items: CartItem[]
  ): Promise<Map<string, number | null>> {
    const prices = new Map<string, number | null>();

    if (!restaurant.platformId) {
      for (const item of items) prices.set(item.normalizedName, null);
      return prices;
    }

    try {
      // Uber Eats store feed endpoint — returns menu data as JSON
      const res = await fetch(`${UE_API}/getStoreV1?storeUuid=${restaurant.platformId}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          storeUuid: restaurant.platformId,
          sfNuggetCount: 0,
        }),
      });

      if (!res.ok) {
        for (const item of items) prices.set(item.normalizedName, null);
        return prices;
      }

      const data = await res.json();

      // Extract menu items from the store response
      const allMenuItems: Array<{ name: string; price: number }> = [];
      const sections = data?.data?.catalogSectionsMap ?? {};

      for (const sectionId of Object.keys(sections)) {
        const section = sections[sectionId];
        for (const row of section ?? []) {
          for (const item of row?.payload?.standardItemsPayload?.catalogItems ?? []) {
            const price = item.price;
            if (item.title && price != null) {
              allMenuItems.push({
                name: item.title,
                price: Math.round(price), // Already in cents from API
              });
            }
          }
        }
      }

      const { MenuNormalizer } = await import('../MenuNormalizer');
      const normalizer = new MenuNormalizer();

      for (const item of items) {
        const match = normalizer.findBestMatch(item, allMenuItems);
        prices.set(item.normalizedName, match?.price ?? null);
      }
    } catch (err) {
      console.error('[UberEats] Menu fetch failed:', err);
      for (const item of items) prices.set(item.normalizedName, null);
    }

    return prices;
  }

  async estimateFees(
    restaurant: RestaurantMatch,
    subtotal: number,
    deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>> {
    // Uber Eats fee structure:
    // Service fee: 15% (capped ~$8)
    // Delivery fee: $0.49-7.99
    // Small order fee: $2 if < $10
    const serviceFee = Math.min(Math.round(subtotal * 0.15), 800);
    const deliveryFee = estimateDeliveryFee(restaurant.distance);
    const smallOrderFee = subtotal < 1000 ? 200 : 0;

    return {
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax: Math.round(subtotal * 0.0825), // Will be metro-specific
      tip: 0,
      discount: 0,
    };
  }

  buildDeepLink(restaurant: RestaurantMatch, _items?: CartItem[]): string {
    if (restaurant.platformUrl) return restaurant.platformUrl;
    return `https://www.ubereats.com/search?q=${encodeURIComponent(restaurant.name)}`;
  }

  async estimateDeliveryTime(): Promise<number | null> {
    return null; // TODO: parse from store response etaRange
  }
}

function estimateDeliveryFee(distance?: number): number {
  if (!distance) return 499;
  if (distance < 1) return 49; // $0.49 nearby
  if (distance < 3) return 299;
  if (distance < 5) return 499;
  return 799;
}
