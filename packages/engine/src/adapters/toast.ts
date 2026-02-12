import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * Toast Direct Ordering adapter.
 * 
 * DATA ACCESS:
 * - Toast API (ws-api.toasttab.com) requires auth — 401 without partnership
 * - Toast ordering pages (order.toasttab.com) are Cloudflare-protected — 403 server-side
 * - SOLUTION: Extension-side scraping of order.toasttab.com pages
 * - BONUS: Co-founder is a restaurant operator — can provide direct POS data
 * 
 * WHY TOAST MATTERS:
 * Toast charges restaurants ~$75/mo flat + small per-delivery fee vs 28-33% platform commission.
 * This means:
 * - Menu prices on Toast are often 10-15% LOWER than DD/UE/GH (no markup needed)
 * - No service fee for consumers
 * - Delivery fee is typically $4-6 (real cost, not demand-priced)
 * - TOTAL is often $5-15 less than platform ordering for the same food
 * 
 * Toast is the "direct ordering" killer comparison in MealCompare.
 */

const METRO_TAX: Record<string, number> = {
  austin: 0.0825,
  dc: 0.10,
};

export class ToastAdapter implements PlatformAdapter {
  platform: Platform = 'direct';

  // Known Toast restaurant URLs (populated from co-founder's network + discovery)
  private toastUrls: Map<string, string> = new Map();

  /**
   * Register a known Toast ordering URL for a restaurant.
   * Called during initialization with co-founder's restaurant data.
   */
  registerRestaurant(normalizedName: string, toastUrl: string): void {
    this.toastUrls.set(normalizedName, toastUrl);
  }

  async findRestaurant(
    name: string,
    _address?: string,
    _metro?: string
  ): Promise<RestaurantMatch[]> {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if we have a known Toast URL
    const toastUrl = this.toastUrls.get(normalizedName);
    if (toastUrl) {
      return [{
        name: `${name} (Direct via Toast)`,
        platformUrl: toastUrl,
      }];
    }

    // Construct a likely Toast URL (many follow pattern: order.toasttab.com/online/{slug})
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
    return [{
      name: `${name} (Direct Order)`,
      platformUrl: `https://order.toasttab.com/online/${slug}`,
    }];
  }

  async getMenuPrices(
    _restaurant: RestaurantMatch,
    items: CartItem[]
  ): Promise<Map<string, number | null>> {
    // Server-side: Can't access Toast pages (Cloudflare)
    // Extension-side: Will scrape from order.toasttab.com
    // For now: estimate direct prices as source price minus typical platform markup
    const prices = new Map<string, number | null>();
    for (const item of items) {
      // Direct ordering typically 10-15% cheaper (no platform markup)
      // Use 12% as average markdown from platform prices
      const directPrice = Math.round(item.price * 0.88);
      prices.set(item.normalizedName, directPrice);
    }
    return prices;
  }

  async estimateFees(
    _restaurant: RestaurantMatch,
    subtotal: number,
    _deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>> {
    // Toast direct ordering fee structure:
    // - NO service fee (huge differentiator)
    // - Delivery fee: flat $4-6 (actual delivery cost, not demand-priced)
    // - NO small order fee
    // - Tax: standard rate
    const taxRate = METRO_TAX['austin']; // TODO: detect from metro

    return {
      serviceFee: 0,        // No service fee!
      deliveryFee: 499,     // Flat ~$4.99
      smallOrderFee: 0,     // No small order fee!
      tax: Math.round(subtotal * taxRate),
      tip: 0,
      discount: 0,
    };
  }

  buildDeepLink(restaurant: RestaurantMatch, _items?: CartItem[]): string {
    if (restaurant.platformUrl) return restaurant.platformUrl;
    return `https://www.google.com/search?q=${encodeURIComponent(restaurant.name + ' online order')}`;
  }

  async estimateDeliveryTime(): Promise<number | null> {
    return null; // Toast doesn't expose ETA via public data
  }
}
