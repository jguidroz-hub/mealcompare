import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * Grubhub adapter.
 * 
 * DATA ACCESS STRATEGY:
 * Grubhub has the most accessible API of the big 3.
 * 1. Search: GET https://api-gtm.grubhub.com/restaurants/search
 * 2. Menu: GET https://api-gtm.grubhub.com/restaurants/{id}?hideChoiceCategories=true
 * 3. Most endpoints return JSON without heavy anti-bot (Grubhub's investment in this lags DD/UE)
 * 4. Rate limit conservatively — they can and will block aggressive scrapers
 */

const GH_API = 'https://api-gtm.grubhub.com';

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Origin': 'https://www.grubhub.com',
  'Referer': 'https://www.grubhub.com/',
};

const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  austin: { lat: 30.2672, lng: -97.7431 },
  dc: { lat: 38.9072, lng: -77.0369 },
};

export class GrubhubAdapter implements PlatformAdapter {
  platform: Platform = 'grubhub';

  async findRestaurant(
    name: string,
    address?: string,
    metro?: string
  ): Promise<RestaurantMatch[]> {
    const coords = METRO_COORDS[metro ?? 'austin'];

    try {
      const params = new URLSearchParams({
        orderMethod: 'delivery',
        locationMode: 'DELIVERY',
        facetSet: 'umamiV6',
        pageSize: '5',
        hideHat498: 'true',
        searchTerms: name,
        latitude: coords.lat.toString(),
        longitude: coords.lng.toString(),
        preciseLocation: 'true',
      });

      const res = await fetch(`${GH_API}/restaurants/search?${params}`, {
        headers: HEADERS,
      });

      if (!res.ok) return this.fallbackSearch(name);

      const data = await res.json();
      const results = data?.search_result?.results ?? [];

      return results
        .filter((r: any) => r.type === 'RESTAURANT')
        .slice(0, 5)
        .map((r: any) => ({
          name: r.name ?? name,
          address: r.address?.street_address,
          platformId: r.restaurant_id?.toString(),
          platformUrl: r.restaurant_id
            ? `https://www.grubhub.com/restaurant/${r.slug ?? r.restaurant_id}`
            : undefined,
          distance: r.distance_from_consumer,
        }));
    } catch (err) {
      console.error('[Grubhub] Search failed:', err);
      return this.fallbackSearch(name);
    }
  }

  private fallbackSearch(name: string): RestaurantMatch[] {
    return [{
      name,
      platformUrl: `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(name)}`,
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
      const res = await fetch(
        `${GH_API}/restaurants/${restaurant.platformId}?hideChoiceCategories=true&version=4&variationId=default&orderType=standard`,
        { headers: HEADERS }
      );

      if (!res.ok) {
        for (const item of items) prices.set(item.normalizedName, null);
        return prices;
      }

      const data = await res.json();
      const allMenuItems: Array<{ name: string; price: number }> = [];

      // Grubhub menu structure: restaurant.menu_category_list[].menu_item_list[]
      const categories = data?.restaurant?.menu_category_list ?? [];
      for (const cat of categories) {
        for (const menuItem of cat.menu_item_list ?? []) {
          if (menuItem.name && menuItem.price?.amount != null) {
            allMenuItems.push({
              name: menuItem.name,
              price: Math.round(menuItem.price.amount), // In cents
            });
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
      console.error('[Grubhub] Menu fetch failed:', err);
      for (const item of items) prices.set(item.normalizedName, null);
    }

    return prices;
  }

  async estimateFees(
    restaurant: RestaurantMatch,
    subtotal: number,
    deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>> {
    // Grubhub fee structure:
    // Service fee: ~10-15%
    // Delivery fee: $0-6.99
    // Small order fee: varies ($2 if < $12)
    const serviceFee = Math.round(subtotal * 0.12);
    const deliveryFee = estimateDeliveryFee(restaurant.distance);
    const smallOrderFee = subtotal < 1200 ? 200 : 0;

    return {
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax: Math.round(subtotal * 0.0825),
      tip: 0,
      discount: 0,
    };
  }

  buildDeepLink(restaurant: RestaurantMatch, _items?: CartItem[]): string {
    if (restaurant.platformUrl) return restaurant.platformUrl;
    return `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(restaurant.name)}`;
  }

  async estimateDeliveryTime(): Promise<number | null> {
    return null;
  }
}

function estimateDeliveryFee(distance?: number): number {
  if (!distance) return 499;
  if (distance < 2) return 199;
  if (distance < 4) return 399;
  return 699;
}
