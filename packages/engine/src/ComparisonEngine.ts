import {
  Platform,
  CartItem,
  PlatformQuote,
  ComparisonResult,
  FeeBreakdown,
  calculateSavings,
} from '@mealcompare/shared';
import { PlatformAdapter } from './adapters/types';
import { MenuNormalizer } from './MenuNormalizer';

export class ComparisonEngine {
  private adapters: Map<Platform, PlatformAdapter> = new Map();
  private normalizer = new MenuNormalizer();

  registerAdapter(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.platform, adapter);
  }

  /**
   * Compare prices for a cart across all registered platforms.
   * Excludes the source platform (user is already there).
   */
  async compare(
    sourcePlatform: Platform,
    restaurantName: string,
    items: CartItem[],
    deliveryAddress?: string,
    metro?: string
  ): Promise<ComparisonResult> {
    const quotes: PlatformQuote[] = [];

    // Query all platforms in parallel (except source)
    const platforms = [...this.adapters.entries()].filter(
      ([p]) => p !== sourcePlatform
    );

    const results = await Promise.allSettled(
      platforms.map(([platform, adapter]) =>
        this.getQuote(adapter, restaurantName, items, deliveryAddress, metro)
      )
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        quotes.push(result.value);
      }
    }

    // Sort by total price ascending
    quotes.sort((a, b) => a.fees.total - b.fees.total);

    const bestDeal = quotes.find(q => q.available) ?? null;

    return {
      restaurantName,
      address: deliveryAddress ?? '',
      items,
      quotes,
      bestDeal,
      savings: calculateSavings(quotes),
      comparedAt: new Date().toISOString(),
    };
  }

  private async getQuote(
    adapter: PlatformAdapter,
    restaurantName: string,
    items: CartItem[],
    deliveryAddress?: string,
    metro?: string
  ): Promise<PlatformQuote | null> {
    try {
      // 1. Find the restaurant on this platform
      const matches = await adapter.findRestaurant(restaurantName, deliveryAddress, metro);
      if (matches.length === 0) {
        return {
          platform: adapter.platform,
          restaurant: { name: restaurantName },
          fees: emptyFees(),
          estimatedMinutes: null,
          available: false,
          unavailableReason: 'Restaurant not found on this platform',
          deepLink: adapter.buildDeepLink({ name: restaurantName }),
          confidence: 0,
          capturedAt: new Date().toISOString(),
        };
      }

      const restaurant = matches[0];

      // 2. Get menu prices
      const prices = await adapter.getMenuPrices(restaurant, items);

      // 3. Calculate subtotal with platform prices
      let subtotal = 0;
      let matchedItems = 0;
      for (const item of items) {
        const platformPrice = prices.get(item.normalizedName);
        if (platformPrice !== null && platformPrice !== undefined) {
          subtotal += platformPrice * item.quantity;
          matchedItems++;
        } else {
          // Use source price as fallback
          subtotal += item.price * item.quantity;
        }
      }

      const confidence = items.length > 0 ? matchedItems / items.length : 0;

      // 4. Estimate fees
      const fees = await adapter.estimateFees(restaurant, subtotal, deliveryAddress);

      // 5. Calculate platform markup
      const sourceSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const platformMarkup = subtotal - sourceSubtotal;

      // 6. Delivery time
      const estimatedMinutes = await adapter.estimateDeliveryTime(
        restaurant,
        deliveryAddress
      );

      const total =
        subtotal +
        fees.serviceFee +
        fees.deliveryFee +
        fees.smallOrderFee +
        fees.tax +
        fees.tip +
        fees.discount; // discount is negative

      return {
        platform: adapter.platform,
        restaurant,
        fees: {
          subtotal,
          platformMarkup,
          serviceFee: fees.serviceFee,
          deliveryFee: fees.deliveryFee,
          smallOrderFee: fees.smallOrderFee,
          tax: fees.tax,
          tip: fees.tip,
          discount: fees.discount,
          total,
        },
        estimatedMinutes,
        available: true,
        deepLink: adapter.buildDeepLink(restaurant, items),
        confidence,
        capturedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        platform: adapter.platform,
        restaurant: { name: restaurantName },
        fees: emptyFees(),
        estimatedMinutes: null,
        available: false,
        unavailableReason: `Error: ${err instanceof Error ? err.message : 'Unknown'}`,
        deepLink: adapter.buildDeepLink({ name: restaurantName }),
        confidence: 0,
        capturedAt: new Date().toISOString(),
      };
    }
  }
}

function emptyFees(): FeeBreakdown {
  return {
    subtotal: 0,
    platformMarkup: 0,
    serviceFee: 0,
    deliveryFee: 0,
    smallOrderFee: 0,
    tax: 0,
    tip: 0,
    discount: 0,
    total: 0,
  };
}
