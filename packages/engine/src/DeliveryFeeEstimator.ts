/**
 * Delivery Fee Estimator.
 * 
 * Models real delivery fee structures for each platform based on observed patterns.
 * Fees are dynamic (surge, distance, subscription discounts) so we model ranges + typical values.
 * 
 * Data sources: Manual observation of 50+ orders across platforms, Feb 2026.
 * 
 * KEY INSIGHT: The "total cost" comparison is what matters, not just food prices.
 * Platforms hide costs in different buckets (service fee, delivery fee, menu markup, small order fee).
 * MealCompare exposes ALL of them.
 */

import { Platform, FeeBreakdown } from '@mealcompare/shared';

export interface FeeEstimateParams {
  platform: Platform;
  subtotal: number; // cents (food items at PLATFORM prices, before fees)
  metro: string;
  distanceMiles?: number;
  isSubscriber?: boolean; // DashPass, Uber One, Grubhub+
  isPeakHours?: boolean;
}

// Tax rates by metro
const TAX_RATES: Record<string, number> = {
  austin: 0.0825,
  dc: 0.10,
};

// ─── Platform Fee Models ───────────────────────────────────────

interface FeeModel {
  // Service fee: typically % of subtotal with min/max
  serviceFeeRate: number;
  serviceFeeMin: number; // cents
  serviceFeeMax: number; // cents
  serviceFeeSubscriber: number; // reduced rate for subscribers

  // Delivery fee
  deliveryFeeBase: number; // cents - base delivery fee
  deliveryFeePerMile: number; // cents per mile beyond base distance
  deliveryFeeSubscriber: number; // cents - subscriber delivery fee (often $0)
  deliveryFeeSurge: number; // cents - additional during peak

  // Small order fee
  smallOrderThreshold: number; // cents - orders below this get surcharged
  smallOrderFee: number; // cents

  // Menu markup estimate (vs direct ordering prices)
  // This is built into item prices, not a separate fee
  menuMarkupRate: number; // e.g., 0.15 = 15% higher than direct
}

const FEE_MODELS: Record<string, FeeModel> = {
  doordash: {
    serviceFeeRate: 0.15,
    serviceFeeMin: 199, // $1.99
    serviceFeeMax: 899, // $8.99
    serviceFeeSubscriber: 0,
    deliveryFeeBase: 399, // $3.99
    deliveryFeePerMile: 100,
    deliveryFeeSubscriber: 0,
    deliveryFeeSurge: 300,
    smallOrderThreshold: 1200, // $12
    smallOrderFee: 250, // $2.50
    menuMarkupRate: 0.15,
  },
  ubereats: {
    serviceFeeRate: 0.15,
    serviceFeeMin: 299,
    serviceFeeMax: 999,
    serviceFeeSubscriber: 0,
    deliveryFeeBase: 499,
    deliveryFeePerMile: 150,
    deliveryFeeSubscriber: 0,
    deliveryFeeSurge: 400,
    smallOrderThreshold: 1500,
    smallOrderFee: 200,
    menuMarkupRate: 0.18, // UE typically highest markup
  },
  grubhub: {
    serviceFeeRate: 0.12,
    serviceFeeMin: 199,
    serviceFeeMax: 799,
    serviceFeeSubscriber: 0,
    deliveryFeeBase: 399,
    deliveryFeePerMile: 100,
    deliveryFeeSubscriber: 0,
    deliveryFeeSurge: 200,
    smallOrderThreshold: 1000,
    smallOrderFee: 250,
    menuMarkupRate: 0.12,
  },
  direct: {
    serviceFeeRate: 0,
    serviceFeeMin: 0,
    serviceFeeMax: 0,
    serviceFeeSubscriber: 0,
    deliveryFeeBase: 499, // Flat delivery via Toast/Square
    deliveryFeePerMile: 0,
    deliveryFeeSubscriber: 499, // Still pay delivery
    deliveryFeeSurge: 0,
    smallOrderThreshold: 0,
    smallOrderFee: 0,
    menuMarkupRate: 0, // No markup!
  },
  pickup: {
    serviceFeeRate: 0,
    serviceFeeMin: 0,
    serviceFeeMax: 0,
    serviceFeeSubscriber: 0,
    deliveryFeeBase: 0,
    deliveryFeePerMile: 0,
    deliveryFeeSubscriber: 0,
    deliveryFeeSurge: 0,
    smallOrderThreshold: 0,
    smallOrderFee: 0,
    menuMarkupRate: 0,
  },
};

export class DeliveryFeeEstimator {
  /**
   * Estimate full fee breakdown for an order.
   * 
   * @param params - Order parameters
   * @returns Full fee breakdown in cents
   */
  estimate(params: FeeEstimateParams): FeeBreakdown {
    const model = FEE_MODELS[params.platform];
    if (!model) {
      throw new Error(`Unknown platform: ${params.platform}`);
    }

    const taxRate = TAX_RATES[params.metro] ?? 0.08;
    const distance = params.distanceMiles ?? 3; // Default 3 miles

    // Service fee
    let serviceFee: number;
    if (params.isSubscriber) {
      serviceFee = model.serviceFeeSubscriber;
    } else {
      serviceFee = Math.round(params.subtotal * model.serviceFeeRate);
      serviceFee = Math.max(model.serviceFeeMin, Math.min(model.serviceFeeMax, serviceFee));
    }

    // Delivery fee
    let deliveryFee: number;
    if (params.isSubscriber) {
      deliveryFee = model.deliveryFeeSubscriber;
    } else {
      deliveryFee = model.deliveryFeeBase;
      if (distance > 3) {
        deliveryFee += Math.round((distance - 3) * model.deliveryFeePerMile);
      }
    }
    if (params.isPeakHours) {
      deliveryFee += model.deliveryFeeSurge;
    }

    // Small order fee
    const smallOrderFee = params.subtotal < model.smallOrderThreshold
      ? model.smallOrderFee
      : 0;

    // Platform markup (built into subtotal from platform prices)
    const platformMarkup = Math.round(params.subtotal * model.menuMarkupRate / (1 + model.menuMarkupRate));
    // Note: platformMarkup is informational — the user already pays it in the item prices

    // Tax (on subtotal)
    const tax = Math.round(params.subtotal * taxRate);

    const total = params.subtotal + serviceFee + deliveryFee + smallOrderFee + tax;

    return {
      subtotal: params.subtotal,
      platformMarkup,
      serviceFee,
      deliveryFee,
      smallOrderFee,
      tax,
      tip: 0, // User-controlled, not estimated
      discount: 0,
      total,
    };
  }

  /**
   * Compare total costs across all platforms for the same items.
   * Adjusts subtotals to account for menu markup differences.
   * 
   * @param directSubtotal - Item total at DIRECT prices (no markup)
   * @param metro - Metro area
   * @returns Map of platform → estimated FeeBreakdown
   */
  compareAll(directSubtotal: number, metro: string): Map<Platform, FeeBreakdown> {
    const results = new Map<Platform, FeeBreakdown>();

    for (const platform of ['doordash', 'ubereats', 'grubhub', 'direct'] as Platform[]) {
      const model = FEE_MODELS[platform];
      // Calculate what the subtotal would be on this platform (with their markup)
      const platformSubtotal = Math.round(directSubtotal * (1 + model.menuMarkupRate));

      results.set(platform, this.estimate({
        platform,
        subtotal: platformSubtotal,
        metro,
      }));
    }

    return results;
  }

  /**
   * Get the menu markup rate for a platform.
   */
  getMarkupRate(platform: Platform): number {
    return FEE_MODELS[platform]?.menuMarkupRate ?? 0;
  }
}
