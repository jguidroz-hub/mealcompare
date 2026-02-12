/**
 * DoorDash in-browser price scraper.
 * 
 * This runs as an injected script within the DoorDash page context,
 * meaning it has access to DoorDash's session cookies and can make
 * authenticated GraphQL calls directly.
 * 
 * Called by the background worker when comparing FROM another platform
 * and we need DoorDash prices.
 * 
 * Strategy:
 * 1. Open DoorDash search in a background tab
 * 2. Inject this script
 * 3. It finds the restaurant, fetches menu, returns prices
 * 4. Background worker closes the tab
 */

import { CartItem, normalizeMenuItemName } from '@mealcompare/shared';

export interface ScrapedMenuData {
  restaurant: {
    name: string;
    storeId: string;
    slug: string;
  };
  items: Array<{
    name: string;
    normalizedName: string;
    price: number; // cents
  }>;
}

/**
 * Scrape menu prices from a DoorDash store page.
 * Call this when the content script is running on a DoorDash /store/ page.
 */
export function scrapeMenuFromPage(): ScrapedMenuData | null {
  try {
    // Extract restaurant name
    const nameEl =
      document.querySelector('[data-testid="StoreHeader"] h1') ??
      document.querySelector('h1');
    const restaurantName = nameEl?.textContent?.trim();
    if (!restaurantName) return null;

    // Extract store ID from URL: /store/{slug}-{storeId}/ or /store/{slug}/
    const urlMatch = window.location.pathname.match(/\/store\/([^/]+)/);
    const slug = urlMatch?.[1] ?? '';

    // Find all menu items on the page
    // DoorDash renders menu items with price in the DOM
    const items: ScrapedMenuData['items'] = [];

    // Strategy 1: Look for menu item cards
    const menuItemSelectors = [
      '[data-testid="MenuItem"]',
      '[data-anchor-id^="MenuItem"]',
      'button[class*="MenuItem"]',
      '[class*="MenuItemCard"]',
    ];

    let menuItems: NodeListOf<Element> | null = null;
    for (const sel of menuItemSelectors) {
      menuItems = document.querySelectorAll(sel);
      if (menuItems.length > 0) break;
    }

    if (menuItems) {
      for (const el of menuItems) {
        // Item name is usually in a span or div with specific attributes
        const nameEl =
          el.querySelector('[data-testid="MenuItemName"]') ??
          el.querySelector('span[class*="itemName"]') ??
          el.querySelector('div > span:first-child');

        // Price is in a separate span, often formatted as "$X.XX"
        const priceEl =
          el.querySelector('[data-testid="MenuItemPrice"]') ??
          el.querySelector('span[class*="price"]');

        const name = nameEl?.textContent?.trim();
        const priceText = priceEl?.textContent?.trim();

        if (name && priceText) {
          const price = parsePriceCents(priceText);
          if (price > 0) {
            items.push({
              name,
              normalizedName: normalizeMenuItemName(name),
              price,
            });
          }
        }
      }
    }

    // Strategy 2: If no items found via selectors, try parsing all visible text
    // that matches price patterns near food-sounding words
    if (items.length === 0) {
      const allElements = document.querySelectorAll('span, div, p');
      let lastFoodName = '';

      for (const el of allElements) {
        const text = el.textContent?.trim() ?? '';

        // Skip if this is a container with children (avoid duplicates)
        if (el.children.length > 2) continue;

        // Check if it looks like a price
        const priceMatch = text.match(/^\$(\d+\.?\d*)$/);
        if (priceMatch && lastFoodName) {
          items.push({
            name: lastFoodName,
            normalizedName: normalizeMenuItemName(lastFoodName),
            price: Math.round(parseFloat(priceMatch[1]) * 100),
          });
          lastFoodName = '';
          continue;
        }

        // Check if it could be a food item name (3-50 chars, no price symbols)
        if (text.length >= 3 && text.length <= 50 && !text.includes('$') && !text.match(/^\d/)) {
          lastFoodName = text;
        }
      }
    }

    return {
      restaurant: {
        name: restaurantName,
        storeId: slug,
        slug,
      },
      items,
    };
  } catch (err) {
    console.error('[SkipTheFee] DoorDash scraper error:', err);
    return null;
  }
}

/**
 * Search DoorDash for a restaurant by name.
 * Uses DoorDash's own GraphQL from within the browser context.
 */
export async function searchDoorDash(query: string): Promise<Array<{ name: string; slug: string; storeId: string }>> {
  try {
    // From within the browser, we can call DoorDash GraphQL with the user's cookies
    const res = await fetch('https://www.doordash.com/graphql/getSearchSuggestions?operation=getSearchSuggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include DoorDash cookies
      body: JSON.stringify({
        operationName: 'getSearchSuggestions',
        query: `query getSearchSuggestions($query: String!) {
          searchSuggestions(query: $query) {
            suggestions {
              text
              type
              store { id name slug __typename }
              __typename
            }
            __typename
          }
        }`,
        variables: { query },
      }),
    });

    const data = await res.json();
    const suggestions = data?.data?.searchSuggestions?.suggestions ?? [];

    return suggestions
      .filter((s: any) => s.store)
      .map((s: any) => ({
        name: s.store.name,
        slug: s.store.slug,
        storeId: s.store.id?.toString(),
      }));
  } catch (err) {
    console.error('[SkipTheFee] DoorDash search error:', err);
    return [];
  }
}

function parsePriceCents(text: string): number {
  const match = text.match(/\$?([\d,]+\.?\d*)/);
  if (!match) return 0;
  return Math.round(parseFloat(match[1].replace(',', '')) * 100);
}
