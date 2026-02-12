import { Platform, CartItem, RestaurantMatch, FeeBreakdown } from '@mealcompare/shared';
import { PlatformAdapter } from './types';

/**
 * DoorDash adapter — uses DoorDash's public-facing GraphQL API.
 * 
 * DATA ACCESS STRATEGY:
 * 1. Set address via GraphQL mutation (addConsumerAddressV2) — establishes session context
 * 2. Search stores via GraphQL query with address context
 * 3. Fetch menu via store page GraphQL (storeId + menuId)
 * 4. All calls go through the consumer-facing endpoint at doordash.com/graphql/
 * 
 * DoorDash is behind Cloudflare — we need:
 * - Realistic headers (User-Agent, Accept, etc.)
 * - Cookie/session management
 * - Rate limiting (1 req/sec)
 * 
 * v0: Direct GraphQL calls. If they block, fall back to headless browser.
 */

const DD_GRAPHQL = 'https://www.doordash.com/graphql';

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': '*/*',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Referer': 'https://www.doordash.com/',
  'Origin': 'https://www.doordash.com',
  'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
};

// Metro address configs for establishing sessions
const METRO_ADDRESSES: Record<string, { lat: number; lng: number; city: string; state: string; zip: string; address: string; googlePlaceId: string }> = {
  austin: {
    lat: 30.2672,
    lng: -97.7431,
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    address: '100 Congress Ave, Austin, TX 78701',
    googlePlaceId: 'ChIJLwPMoJm1RIYRetVp1EtGm10',
  },
  dc: {
    lat: 38.9072,
    lng: -77.0369,
    city: 'Washington',
    state: 'DC',
    zip: '20001',
    address: '1600 Pennsylvania Ave NW, Washington, DC 20500',
    googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',
  },
};

interface SessionState {
  cookies: string[];
  metro: string;
  initializedAt: number;
}

export class DoorDashAdapter implements PlatformAdapter {
  platform: Platform = 'doordash';
  private session: SessionState | null = null;

  /**
   * Initialize a DoorDash session with an address.
   * Must be called before any data access.
   */
  async initSession(metro: string): Promise<void> {
    if (this.session?.metro === metro) return; // Already initialized

    const addr = METRO_ADDRESSES[metro];
    if (!addr) throw new Error(`Unknown metro: ${metro}`);

    const payload = {
      operationName: 'addConsumerAddressV2',
      query: `mutation addConsumerAddressV2(
        $lat: Float!, $lng: Float!, $city: String!, $state: String!,
        $zipCode: String!, $printableAddress: String!, $shortname: String!,
        $googlePlaceId: String!
      ) {
        addConsumerAddressV2(
          lat: $lat, lng: $lng, city: $city, state: $state,
          zipCode: $zipCode, printableAddress: $printableAddress,
          shortname: $shortname, googlePlaceId: $googlePlaceId
        ) {
          defaultAddress { id lat lng city state zipCode __typename }
          __typename
        }
      }`,
      variables: {
        lat: addr.lat,
        lng: addr.lng,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zip,
        printableAddress: addr.address,
        shortname: addr.city,
        googlePlaceId: addr.googlePlaceId,
      },
    };

    try {
      const res = await fetch(`${DD_GRAPHQL}/addConsumerAddressV2?operation=addConsumerAddressV2`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(payload),
      });

      const cookies = res.headers.getSetCookie?.() ?? [];
      this.session = { cookies, metro, initializedAt: Date.now() };
    } catch (err) {
      console.error('[DoorDash] Session init failed:', err);
      // Continue without session — will use fallback methods
      this.session = { cookies: [], metro, initializedAt: Date.now() };
    }
  }

  private getHeaders(): Record<string, string> {
    const h = { ...HEADERS };
    if (this.session?.cookies.length) {
      (h as any)['Cookie'] = this.session.cookies.join('; ');
    }
    return h;
  }

  async findRestaurant(
    name: string,
    address?: string,
    metro?: string
  ): Promise<RestaurantMatch[]> {
    if (metro) await this.initSession(metro);

    // DoorDash store search via GraphQL
    const payload = {
      operationName: 'SearchStores',
      query: `query SearchStores($searchTerm: String!, $numStores: Int) {
        search(searchTerm: $searchTerm, numStores: $numStores) {
          stores {
            id
            name
            slug
            displayDeliveryFee
            distanceFromConsumer
            averageRating
            numRatings
            priceRange
            address { street printableAddress __typename }
            __typename
          }
          __typename
        }
      }`,
      variables: {
        searchTerm: name,
        numStores: 5,
      },
    };

    try {
      const res = await fetch(`${DD_GRAPHQL}/SearchStores?operation=SearchStores`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[DoorDash] Search returned ${res.status}`);
        return this.fallbackSearch(name);
      }

      const data = await res.json();
      const stores = data?.data?.search?.stores ?? [];

      return stores.map((s: any) => ({
        name: s.name,
        address: s.address?.printableAddress,
        platformId: s.id?.toString(),
        platformUrl: `https://www.doordash.com/store/${s.slug}/`,
        distance: s.distanceFromConsumer,
      }));
    } catch (err) {
      console.error('[DoorDash] Search failed:', err);
      return this.fallbackSearch(name);
    }
  }

  private fallbackSearch(name: string): RestaurantMatch[] {
    // Fallback: construct a search URL for manual verification
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return [{
      name,
      platformUrl: `https://www.doordash.com/search/store/${encodeURIComponent(name)}/`,
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

    // Fetch store menu via GraphQL
    const payload = {
      operationName: 'getStoreMenu',
      query: `query getStoreMenu($storeId: ID!) {
        storeMenus(storeId: $storeId) {
          id
          name
          menuCategories {
            id
            name
            items {
              id
              name
              displayPrice
              price
              __typename
            }
            __typename
          }
          __typename
        }
      }`,
      variables: {
        storeId: restaurant.platformId,
      },
    };

    try {
      const res = await fetch(`${DD_GRAPHQL}/getStoreMenu?operation=getStoreMenu`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        for (const item of items) prices.set(item.normalizedName, null);
        return prices;
      }

      const data = await res.json();
      const menus = data?.data?.storeMenus ?? [];

      // Build a flat list of all menu items
      const allMenuItems: Array<{ name: string; price: number }> = [];
      for (const menu of menus) {
        for (const cat of menu.menuCategories ?? []) {
          for (const menuItem of cat.items ?? []) {
            const price = menuItem.price ?? parseDisplayPrice(menuItem.displayPrice);
            if (price != null) {
              allMenuItems.push({ name: menuItem.name, price });
            }
          }
        }
      }

      // Match cart items to menu items using normalizer
      const { MenuNormalizer } = await import('../MenuNormalizer');
      const normalizer = new MenuNormalizer();

      for (const item of items) {
        const match = normalizer.findBestMatch(item, allMenuItems);
        prices.set(item.normalizedName, match?.price ?? null);
      }
    } catch (err) {
      console.error('[DoorDash] Menu fetch failed:', err);
      for (const item of items) prices.set(item.normalizedName, null);
    }

    return prices;
  }

  async estimateFees(
    restaurant: RestaurantMatch,
    subtotal: number,
    deliveryAddress?: string
  ): Promise<Omit<FeeBreakdown, 'subtotal' | 'platformMarkup' | 'total'>> {
    // DoorDash fee structure (empirical averages):
    // Service fee: 15% capped at $5-8
    // Delivery fee: $0-5.99 (varies by distance + demand)
    // Small order fee: $2.50 if subtotal < $12
    // Regulatory fee: $0-2 in some markets
    const serviceFee = Math.min(Math.round(subtotal * 0.15), 800);
    const deliveryFee = estimateDeliveryFee(restaurant.distance);
    const smallOrderFee = subtotal < 1200 ? 250 : 0;

    // Tax rates by metro
    const taxRate = this.session?.metro === 'dc' ? 0.10 : 0.0825; // DC 10%, Austin 8.25%

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
    if (restaurant.platformId) {
      return `https://www.doordash.com/store/${restaurant.platformId}/`;
    }
    return `https://www.doordash.com/search/store/${encodeURIComponent(restaurant.name)}/`;
  }

  async estimateDeliveryTime(
    _restaurant: RestaurantMatch,
    _deliveryAddress?: string
  ): Promise<number | null> {
    // TODO: Parse from store query response (avgDeliveryTime field)
    return null;
  }
}

function parseDisplayPrice(display: string | null | undefined): number | null {
  if (!display) return null;
  const match = display.match(/\$?([\d,]+\.?\d*)/);
  if (!match) return null;
  return Math.round(parseFloat(match[1].replace(',', '')) * 100);
}

function estimateDeliveryFee(distance?: number): number {
  if (!distance) return 399; // Default $3.99
  if (distance < 1) return 199;
  if (distance < 3) return 399;
  if (distance < 5) return 499;
  return 599;
}
