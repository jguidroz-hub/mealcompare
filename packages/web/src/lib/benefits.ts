/**
 * Eddy Benefits Profile — Phase 1
 * Stores user's credit cards, memberships, and calculates personalized savings.
 * All data in localStorage (no account required).
 */

const STORAGE_KEY = 'eddy_benefits';

// ── Credit Cards ──────────────────────────────────────────────

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  diningMultiplier: number;     // e.g. 3 = 3x points
  pointValueCents: number;      // cents per point (e.g. 1.5 = 1.5¢ per point)
  deliveryMultiplier?: number;  // if different from dining (e.g. Uber Visa 5x on Uber)
  monthlyCredits?: { platform: string; amountCents: number }[];
  annualFee?: number;
}

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'chase-sapphire-reserve',
    name: 'Sapphire Reserve',
    issuer: 'Chase',
    diningMultiplier: 3,
    pointValueCents: 1.5,
    monthlyCredits: [{ platform: 'doordash', amountCents: 500 }],
    annualFee: 550,
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Sapphire Preferred',
    issuer: 'Chase',
    diningMultiplier: 3,
    pointValueCents: 1.25,
    monthlyCredits: [],
    annualFee: 95,
  },
  {
    id: 'amex-gold',
    name: 'Gold Card',
    issuer: 'Amex',
    diningMultiplier: 4,
    pointValueCents: 1.2,
    monthlyCredits: [
      { platform: 'grubhub', amountCents: 1000 },
      { platform: 'ubereats', amountCents: 0 },
    ],
    annualFee: 250,
  },
  {
    id: 'amex-platinum',
    name: 'Platinum Card',
    issuer: 'Amex',
    diningMultiplier: 1,
    pointValueCents: 1.2,
    monthlyCredits: [{ platform: 'ubereats', amountCents: 1500 }],
    annualFee: 695,
  },
  {
    id: 'capital-one-savor',
    name: 'Savor',
    issuer: 'Capital One',
    diningMultiplier: 4,
    pointValueCents: 1.0,
    annualFee: 95,
  },
  {
    id: 'capital-one-savorone',
    name: 'SavorOne',
    issuer: 'Capital One',
    diningMultiplier: 3,
    pointValueCents: 1.0,
    annualFee: 0,
  },
  {
    id: 'citi-custom-cash',
    name: 'Custom Cash',
    issuer: 'Citi',
    diningMultiplier: 5, // if dining is top category
    pointValueCents: 1.0,
    annualFee: 0,
  },
  {
    id: 'uber-visa',
    name: 'Uber One Card',
    issuer: 'Uber',
    diningMultiplier: 3,
    pointValueCents: 1.0,
    deliveryMultiplier: 5, // 5% on Uber orders
    annualFee: 0,
  },
  {
    id: 'doordash-mastercard',
    name: 'DoorDash Rewards Mastercard',
    issuer: 'DoorDash',
    diningMultiplier: 4, // 4% cashback on DoorDash
    pointValueCents: 1.0,
    deliveryMultiplier: 4,
    annualFee: 0,
  },
  {
    id: 'wells-fargo-autograph',
    name: 'Autograph',
    issuer: 'Wells Fargo',
    diningMultiplier: 3,
    pointValueCents: 1.0,
    annualFee: 0,
  },
  {
    id: 'generic-2pct',
    name: '2% Cashback (generic)',
    issuer: 'Other',
    diningMultiplier: 2,
    pointValueCents: 1.0,
    annualFee: 0,
  },
  {
    id: 'generic-1pct',
    name: '1% Cashback (generic)',
    issuer: 'Other',
    diningMultiplier: 1,
    pointValueCents: 1.0,
    annualFee: 0,
  },
];

// ── Delivery Memberships ──────────────────────────────────────

export interface Membership {
  id: string;
  name: string;
  platform: string;
  monthlyCost: number;
  freeDeliveryMinOrder: number;  // e.g. $12 minimum for free delivery
  serviceFeeDiscount: number;    // percentage discount on service fees (0-1)
  orderDiscount: number;         // flat percentage off orders (e.g. 0.05 = 5%)
}

export const MEMBERSHIPS: Membership[] = [
  {
    id: 'dashpass',
    name: 'DashPass',
    platform: 'doordash',
    monthlyCost: 9.99,
    freeDeliveryMinOrder: 12,
    serviceFeeDiscount: 0.5, // reduced service fees
    orderDiscount: 0,
  },
  {
    id: 'uber-one',
    name: 'Uber One',
    platform: 'ubereats',
    monthlyCost: 9.99,
    freeDeliveryMinOrder: 15,
    serviceFeeDiscount: 0.3,
    orderDiscount: 0.05, // 5% off orders
  },
  {
    id: 'grubhub-plus',
    name: 'Grubhub+',
    platform: 'grubhub',
    monthlyCost: 9.99,
    freeDeliveryMinOrder: 12,
    serviceFeeDiscount: 0.3,
    orderDiscount: 0,
  },
];

// ── User Profile ──────────────────────────────────────────────

export interface BenefitsProfile {
  cards: string[];        // card IDs the user has
  memberships: string[];  // membership IDs the user has
  defaultTipPercent: number;
  updatedAt: number;
}

const DEFAULT_PROFILE: BenefitsProfile = {
  cards: [],
  memberships: [],
  defaultTipPercent: 20,
  updatedAt: 0,
};

export function getProfile(): BenefitsProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: BenefitsProfile) {
  if (typeof window === 'undefined') return;
  profile.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function hasProfile(): boolean {
  const p = getProfile();
  return p.cards.length > 0 || p.memberships.length > 0;
}

// ── Cost Calculator ───────────────────────────────────────────

export type Platform = 'doordash' | 'ubereats' | 'grubhub' | 'direct';

interface PlatformFees {
  deliveryFee: number;
  serviceFeePercent: number;
  serviceFeeCap: number;
  smallOrderFee: number;
  smallOrderThreshold: number;
  menuMarkupPercent: number; // avg markup on menu prices vs direct
}

// Industry average fees (conservative estimates)
const PLATFORM_FEES: Record<Platform, PlatformFees> = {
  doordash: {
    deliveryFee: 3.99,
    serviceFeePercent: 0.15,
    serviceFeeCap: 9.99,
    smallOrderFee: 2.50,
    smallOrderThreshold: 12,
    menuMarkupPercent: 0.15,
  },
  ubereats: {
    deliveryFee: 4.49,
    serviceFeePercent: 0.15,
    serviceFeeCap: 9.99,
    smallOrderFee: 2.00,
    smallOrderThreshold: 15,
    menuMarkupPercent: 0.18,
  },
  grubhub: {
    deliveryFee: 3.49,
    serviceFeePercent: 0.12,
    serviceFeeCap: 8.99,
    smallOrderFee: 2.50,
    smallOrderThreshold: 12,
    menuMarkupPercent: 0.12,
  },
  direct: {
    deliveryFee: 1.99, // many direct charge a small fee
    serviceFeePercent: 0,
    serviceFeeCap: 0,
    smallOrderFee: 0,
    smallOrderThreshold: 0,
    menuMarkupPercent: 0,
  },
};

export interface CostBreakdown {
  platform: Platform;
  platformLabel: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  smallOrderFee: number;
  tax: number;
  tip: number;
  totalBeforeBenefits: number;
  // Benefits applied
  creditCardReward: number;     // cashback/points value earned
  membershipDeliverySaved: number;
  membershipDiscountSaved: number;
  creditApplied: number;        // monthly credits used
  effectiveTotal: number;       // what you ACTUALLY pay after benefits
  hasMembership: boolean;
  bestCard: CreditCard | null;
}

export function calculateCosts(
  baseOrderAmount: number, // menu price at restaurant (before any markup)
  profile: BenefitsProfile,
  taxRate: number = 0.08,
): CostBreakdown[] {
  const userCards = profile.cards
    .map(id => CREDIT_CARDS.find(c => c.id === id))
    .filter((c): c is CreditCard => !!c);

  const userMemberships = profile.memberships
    .map(id => MEMBERSHIPS.find(m => m.id === id))
    .filter((m): m is Membership => !!m);

  const platforms: Platform[] = ['doordash', 'ubereats', 'grubhub', 'direct'];
  const labels: Record<Platform, string> = {
    doordash: 'DoorDash',
    ubereats: 'Uber Eats',
    grubhub: 'Grubhub',
    direct: 'Direct Order',
  };

  return platforms.map(platform => {
    const fees = PLATFORM_FEES[platform];
    const membership = userMemberships.find(m => m.platform === platform);

    // Subtotal = base price + platform markup
    const subtotal = baseOrderAmount * (1 + fees.menuMarkupPercent);

    // Delivery fee (waived with membership if over minimum)
    let deliveryFee = fees.deliveryFee;
    let membershipDeliverySaved = 0;
    if (membership && subtotal >= membership.freeDeliveryMinOrder) {
      membershipDeliverySaved = deliveryFee;
      deliveryFee = 0;
    }

    // Service fee
    let serviceFee = Math.min(subtotal * fees.serviceFeePercent, fees.serviceFeeCap);
    if (membership) {
      const discount = serviceFee * membership.serviceFeeDiscount;
      serviceFee -= discount;
    }

    // Small order fee
    const smallOrderFee = subtotal < fees.smallOrderThreshold ? fees.smallOrderFee : 0;

    // Tax on subtotal
    const tax = subtotal * taxRate;

    // Tip
    const tip = subtotal * (profile.defaultTipPercent / 100);

    const totalBeforeBenefits = subtotal + deliveryFee + serviceFee + smallOrderFee + tax + tip;

    // Membership order discount (e.g. Uber One 5% off)
    let membershipDiscountSaved = 0;
    if (membership && membership.orderDiscount > 0) {
      membershipDiscountSaved = subtotal * membership.orderDiscount;
    }

    // Best credit card for this platform
    let bestCard: CreditCard | null = null;
    let creditCardReward = 0;

    for (const card of userCards) {
      let multiplier = card.diningMultiplier;
      // Some cards have special delivery multipliers
      if (card.deliveryMultiplier && platform !== 'direct') {
        if (
          (card.id === 'uber-visa' && platform === 'ubereats') ||
          (card.id === 'doordash-mastercard' && platform === 'doordash')
        ) {
          multiplier = card.deliveryMultiplier;
        }
      }
      const reward = (subtotal * multiplier * card.pointValueCents) / 100;
      if (reward > creditCardReward) {
        creditCardReward = reward;
        bestCard = card;
      }
    }

    // Monthly credits
    let creditApplied = 0;
    if (bestCard?.monthlyCredits) {
      for (const credit of bestCard.monthlyCredits) {
        if (credit.platform === platform) {
          creditApplied = credit.amountCents / 100;
        }
      }
    }

    const effectiveTotal = Math.max(
      0,
      totalBeforeBenefits - membershipDiscountSaved - creditCardReward - creditApplied
    );

    return {
      platform,
      platformLabel: labels[platform],
      subtotal: round(subtotal),
      deliveryFee: round(deliveryFee),
      serviceFee: round(serviceFee),
      smallOrderFee: round(smallOrderFee),
      tax: round(tax),
      tip: round(tip),
      totalBeforeBenefits: round(totalBeforeBenefits),
      creditCardReward: round(creditCardReward),
      membershipDeliverySaved: round(membershipDeliverySaved),
      membershipDiscountSaved: round(membershipDiscountSaved),
      creditApplied: round(creditApplied),
      effectiveTotal: round(effectiveTotal),
      hasMembership: !!membership,
      bestCard,
    };
  }).sort((a, b) => a.effectiveTotal - b.effectiveTotal);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Quick summary: how much the cheapest platform saves vs the most expensive
 */
export function getSavingsSummary(costs: CostBreakdown[]): {
  bestPlatform: CostBreakdown;
  worstPlatform: CostBreakdown;
  savingsAmount: number;
} {
  const sorted = [...costs].sort((a, b) => a.effectiveTotal - b.effectiveTotal);
  return {
    bestPlatform: sorted[0],
    worstPlatform: sorted[sorted.length - 1],
    savingsAmount: round(sorted[sorted.length - 1].effectiveTotal - sorted[0].effectiveTotal),
  };
}
