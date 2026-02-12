import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';

export interface PlatformAdapter {
  platform: Platform;

  /**
   * Search for a restaurant by name (and optionally address) on this platform.
   * Returns matches ranked by confidence.
   */
  findRestaurant(
    name: string,
    address?: string,
    metro?: string
  ): Promise<RestaurantMatch[]>;

  /**
   * Get the price for specific menu items at a matched restaurant.
   * Returns null for items that can't be found on this platform.
   */
  getMenuPrices(
    restaurant: RestaurantMatch,
    items: CartItem[]
  ): Promise<Map<string, number | null>>; // normalizedName → price in cents

  /**
   * Get the fee breakdown for an order at this restaurant.
   * Subtotal is computed from items; this fills in service/delivery/etc fees.
   */
  estimateFees(
    restaurant: RestaurantMatch,
    subtotal: number,
    deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>>;

  /**
   * Build a deep link to this restaurant (or specific cart) on the platform.
   */
  buildDeepLink(restaurant: RestaurantMatch, items?: CartItem[]): string;

  /**
   * Estimated delivery time in minutes, or null if unavailable.
   */
  estimateDeliveryTime(
    restaurant: RestaurantMatch,
    deliveryAddress?: string
  ): Promise<number | null>;
}
