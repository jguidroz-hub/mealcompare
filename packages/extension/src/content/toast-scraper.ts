/**
 * Toast site scraper — runs as content script on *.toast.site pages.
 * 
 * Extracts menu items and prices from Toast online ordering pages.
 * These are DIRECT prices (no platform markup), making them the
 * cheapest option for consumers.
 * 
 * Pattern observed on ometeo.toast.site and similar Toast-hosted pages:
 * - Menu sections contain item cards with name + price
 * - Toast uses React-based SPA with specific class patterns
 * - Prices are displayed in "$X.XX" format within item cards
 */

interface ToastMenuItem {
  name: string;
  price: number; // cents
  description?: string;
  category?: string;
}

function extractMenuItems(): ToastMenuItem[] {
  const items: ToastMenuItem[] = [];
  
  // Strategy 1: Look for common Toast ordering page patterns
  // Toast sites typically have menu item cards with price spans
  
  // Pattern: Items with data-testid or specific class names
  const itemElements = document.querySelectorAll(
    '[class*="menuItem"], [class*="MenuItem"], [class*="item-card"], ' +
    '[data-testid*="menu-item"], [class*="itemCard"], ' +
    '.menu-item, .menuItem, [class*="MenuItemCard"]'
  );

  for (const el of itemElements) {
    const item = parseToastItem(el);
    if (item) items.push(item);
  }

  // Strategy 2: Generic price extraction from page structure
  // Look for elements containing dollar amounts near text elements
  if (items.length === 0) {
    const allElements = document.querySelectorAll('div, li, article, section');
    for (const el of allElements) {
      if (el.children.length > 10) continue; // Skip containers
      const text = el.textContent ?? '';
      const priceMatch = text.match(/\$(\d+\.\d{2})/);
      if (!priceMatch) continue;
      
      // Get the item name (first significant text node)
      const nameEl = el.querySelector('h3, h4, h5, [class*="name"], [class*="title"], span:first-child');
      const name = nameEl?.textContent?.trim();
      if (!name || name.includes('$')) continue;
      
      const price = Math.round(parseFloat(priceMatch[1]) * 100);
      if (price > 0 && price < 50000) { // Sanity: $0.01 - $500
        items.push({ name, price });
      }
    }
  }

  // Strategy 3: JSON-LD structured data (some Toast pages include this)
  const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of ldScripts) {
    try {
      const data = JSON.parse(script.textContent ?? '');
      if (data['@type'] === 'Menu' || data['@type'] === 'Restaurant') {
        const menuItems = data.hasMenu?.hasMenuSection?.flatMap(
          (s: any) => s.hasMenuItem ?? []
        ) ?? [];
        for (const mi of menuItems) {
          if (mi.name && mi.offers?.price) {
            items.push({
              name: mi.name,
              price: Math.round(parseFloat(mi.offers.price) * 100),
              description: mi.description,
            });
          }
        }
      }
    } catch { /* ignore parse errors */ }
  }

  // Strategy 4: Look for __NEXT_DATA__ or similar hydration data
  const nextData = document.getElementById('__NEXT_DATA__');
  if (nextData) {
    try {
      const data = JSON.parse(nextData.textContent ?? '');
      extractFromNestedObject(data, items);
    } catch { /* ignore */ }
  }

  return deduplicateItems(items);
}

function parseToastItem(el: Element): ToastMenuItem | null {
  // Look for name and price within the item element
  const nameEl = el.querySelector(
    '[class*="itemName"], [class*="name"], [class*="title"], h3, h4, h5'
  );
  const priceEl = el.querySelector(
    '[class*="price"], [class*="Price"], [class*="cost"]'
  );

  const name = nameEl?.textContent?.trim();
  const priceText = priceEl?.textContent?.trim();

  if (!name || !priceText) return null;

  const priceMatch = priceText.match(/\$?(\d+\.\d{2})/);
  if (!priceMatch) return null;

  const price = Math.round(parseFloat(priceMatch[1]) * 100);
  if (price <= 0 || price > 50000) return null;

  const descEl = el.querySelector(
    '[class*="description"], [class*="desc"], p'
  );

  return {
    name,
    price,
    description: descEl?.textContent?.trim(),
  };
}

function extractFromNestedObject(obj: any, items: ToastMenuItem[], depth = 0): void {
  if (depth > 10 || !obj || typeof obj !== 'object') return;
  
  // Look for objects that look like menu items
  if (obj.name && (obj.price || obj.amount)) {
    const price = typeof obj.price === 'number' ? obj.price :
                  typeof obj.amount === 'number' ? obj.amount :
                  parseFloat(String(obj.price || obj.amount));
    if (!isNaN(price) && price > 0 && price < 500) {
      items.push({
        name: String(obj.name),
        price: Math.round(price * 100),
        description: obj.description ? String(obj.description) : undefined,
      });
    }
  }

  // Recurse
  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        extractFromNestedObject(item, items, depth + 1);
      }
    } else if (typeof obj[key] === 'object') {
      extractFromNestedObject(obj[key], items, depth + 1);
    }
  }
}

function deduplicateItems(items: ToastMenuItem[]): ToastMenuItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = `${item.name.toLowerCase()}:${item.price}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Main: Extract + send to background ────────────────────────

function init(): void {

  // Wait for page to hydrate
  setTimeout(() => {
    const items = extractMenuItems();

    if (items.length > 0) {
      // Send to background for storage + future comparison
      chrome.runtime.sendMessage({
        type: 'TOAST_MENU_SCRAPED',
        payload: {
          url: window.location.href,
          restaurant: document.title.replace(/\s*[-|].*$/, '').trim(),
          items,
          scrapedAt: new Date().toISOString(),
        },
      });
    }
  }, 3000); // Wait for SPA to render
}

// Handle SPA navigation
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    setTimeout(() => init(), 2000);
  }
});
observer.observe(document.body, { childList: true, subtree: true });

init();
