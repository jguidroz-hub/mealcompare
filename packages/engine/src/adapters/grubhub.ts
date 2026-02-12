import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * Grubhub adapter.
 * 
 * DATA ACCESS REALITY (validated Feb 12, 2026):
 * - Grubhub API (api-gtm.grubhub.com) returns 401 without auth token
 * - Requires session/authentication to access search + menu endpoints
 * - SOLUTION: Similar to DoorDash — use extension content scripts for real data,
 *   server-side for estimates only
 * 
 * However, Grubhub web pages are more scrape-friendly than DoorDash:
 * - Restaurant pages render menus in accessible HTML
 * - No heavy Cloudflare challenge on regular page loads
 * - Server-side HTML scraping MAY work as a backup
 * 
 * For v0: Extension-side scraping + server-side estimates.
 * Phase 2: Explore headless browser scraping or Grubhub developer API partnership.
 */

const METRO_TAX: Record<string, number> = {
  austin: 0.0825,
  dc: 0.10,
};

export class GrubhubAdapter implements PlatformAdapter {
  platform: Platform = 'grubhub';

  async findRestaurant(
    name: string,
    _address?: string,
    _metro?: string
  ): Promise<RestaurantMatch[]> {
    // Can try HTML scraping of Grubhub search results as a v0.5 approach
    // For now, return search URL
    return [{
      name,
      platformUrl: `https://www.grubhub.com/search?orderMethod=delivery&query=${encodeURIComponent(name)}`,
    }];
  }

  async getMenuPrices(
    _restaurant: RestaurantMatch,
    items: CartItem[]
  ): Promise<Map<string, number | null>> {
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
    const serviceFee = Math.round(subtotal * 0.12);
    const deliveryFee = estimateDeliveryFee(restaurant.distance);
    const smallOrderFee = subtotal < 1200 ? 200 : 0;
    const taxRate = METRO_TAX['austin'];

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
