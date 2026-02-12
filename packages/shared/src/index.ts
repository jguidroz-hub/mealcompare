// ─── Core Types ────────────────────────────────────────────────

export type Platform = 'doordash' | 'ubereats' | 'grubhub' | 'direct' | 'pickup';

export interface MenuItem {
  name: string;
  normalizedName: string; // Lowercase, stripped of platform-specific suffixes
  price: number; // In cents
  quantity: number;
  customizations?: string[];
}

export interface CartItem extends MenuItem {
  platformItemId?: string; // Platform-specific ID if available
}

export interface FeeBreakdown {
  subtotal: number;       // Item prices * quantities (cents)
  platformMarkup: number; // Menu markup vs direct price (cents)
  serviceFee: number;     // Platform service fee (cents)
  deliveryFee: number;    // Delivery fee (cents)
  smallOrderFee: number;  // Small order surcharge (cents)
  tax: number;            // Estimated tax (cents)
  tip: number;            // Suggested/default tip (cents)
  discount: number;       // Any applied promos (cents, negative)
  total: number;          // Final total (cents)
}

export interface PlatformQuote {
  platform: Platform;
  restaurant: RestaurantMatch;
  fees: FeeBreakdown;
  estimatedMinutes: number | null; // Delivery time estimate
  available: boolean;
  unavailableReason?: string;
  deepLink: string; // URL to complete order on this platform
  confidence: number; // 0-1 how confident we are in this quote
  capturedAt: string; // ISO timestamp
}

export interface ComparisonResult {
  restaurantName: string;
  address: string;
  items: CartItem[];
  quotes: PlatformQuote[];
  bestDeal: PlatformQuote | null;
  savings: number; // Cents saved vs most expensive option
  comparedAt: string;
}

export interface RestaurantMatch {
  name: string;
  address?: string;
  platformId?: string;
  platformUrl?: string;
  distance?: number; // miles
}

// ─── Extension Messages ────────────────────────────────────────

export type ExtensionMessage =
  | { type: 'CART_DETECTED'; payload: CartDetection }
  | { type: 'COMPARE_REQUEST'; payload: CompareRequest }
  | { type: 'COMPARE_RESULT'; payload: ComparisonResult }
  | { type: 'COMPARE_ERROR'; payload: { error: string } };

export interface CartDetection {
  platform: Platform;
  restaurantName: string;
  items: CartItem[];
  pageUrl: string;
}

export interface CompareRequest {
  sourcePlatform: Platform;
  restaurantName: string;
  items: CartItem[];
  deliveryAddress?: string;
  metro: string; // 'austin' | 'dc'
}

// ─── Helpers ───────────────────────────────────────────────────

export function normalizeMenuItemName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '') // Remove parenthetical notes
    .replace(/\s*-\s*delivered\s*/gi, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toFixed(2)}`;
}

export function calculateSavings(quotes: PlatformQuote[]): number {
  const available = quotes.filter(q => q.available);
  if (available.length < 2) return 0;
  const totals = available.map(q => q.fees.total);
  return Math.max(...totals) - Math.min(...totals);
}
