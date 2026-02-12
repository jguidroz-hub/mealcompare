import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * DoorDash adapter.
 * 
 * DATA ACCESS REALITY (validated Feb 12, 2026):
 * - DoorDash GraphQL is behind aggressive Cloudflare challenge
 * - Server-side API calls get blocked immediately
 * - SOLUTION: Use the Chrome extension's content script to scrape DoorDash
 *   from within the browser (bypasses Cloudflare since it's a real browser session)
 * 
 * Architecture:
 * - Server-side: Only estimates (fee structure, deep links)
 * - Client-side (extension): Real price scraping via DOM + GraphQL from browser context
 * - The extension content script on DoorDash pages can make authenticated
 *   GraphQL calls using the user's existing session cookies
 * 
 * This means DoorDash comparison only works when:
 * 1. User has DoorDash open in another tab, OR
 * 2. We open a DoorDash tab in the background to query prices
 * 
 * For v0: If user is ON DoorDash, we compare to UberEats/Grubhub.
 * If user is on UberEats/Grubhub, we can't query DoorDash server-side.
 * Phase 2: Background tab approach or proxy service.
 */

const METRO_TAX: Record<string, number> = {
  austin: 0.0825,
  dc: 0.10,
};

export class DoorDashAdapter implements PlatformAdapter {
  platform: Platform = 'doordash';

  async findRestaurant(
    name: string,
    _address?: string,
    _metro?: string
  ): Promise<RestaurantMatch[]> {
    // Server-side: Can't query DoorDash due to Cloudflare
    // Return search URL for deep linking
    return [{
      name,
      platformUrl: `https://www.doordash.com/search/store/${encodeURIComponent(name)}/`,
    }];
  }

  async getMenuPrices(
    _restaurant: RestaurantMatch,
    items: CartItem[]
  ): Promise<Map<string, number | null>> {
    // Server-side: Can't access DoorDash menus
    // Prices will come from extension-side scraping (see content/doordash-scraper.ts)
    const prices = new Map<string, number | null>();
    for (const item of items) {
      prices.set(item.normalizedName, null);
    }
    return prices;
  }

  async estimateFees(
    restaurant: RestaurantMatch,
    subtotal: number,
    _deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>> {
    // DoorDash fee estimates (empirical, Feb 2026):
    const serviceFee = Math.min(Math.round(subtotal * 0.15), 800);
    const deliveryFee = estimateDeliveryFee(restaurant.distance);
    const smallOrderFee = subtotal < 1200 ? 250 : 0;
    const taxRate = METRO_TAX['austin']; // TODO: detect from metro context

    return {
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax: Math.round(subtotal * taxRate),
      tip: 0,
      discount: 0,
    };
  }

  buildDeepLink(restaurant: RestaurantMatch, _items?: CartItem[]): string {
    if (restaurant.platformUrl) return restaurant.platformUrl;
    return `https://www.doordash.com/search/store/${encodeURIComponent(restaurant.name)}/`;
  }

  async estimateDeliveryTime(): Promise<number | null> {
    return null;
  }
}

function estimateDeliveryFee(distance?: number): number {
  if (!distance) return 399;
  if (distance < 1) return 199;
  if (distance < 3) return 399;
  if (distance < 5) return 499;
  return 599;
}
