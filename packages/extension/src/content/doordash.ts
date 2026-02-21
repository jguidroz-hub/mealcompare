function normalizeMenuItemName(name: string): string { return name.toLowerCase().replace(/[®™©]/g, "").replace(/\s*\(.*?\)\s*/g, "").replace(/\s*-\s*delivered\s*/gi, "").replace(/\s*\[.*?\]\s*/g, "").replace(/#(\d+)\s+/g, "#$1 ").replace(/\s*-\s*/g, " ").replace(/[^a-z0-9#\s]/g, "").replace(/\s+/g, " ").trim(); }
type CartDetection = { platform: string; restaurantName: string; items: CartItem[]; pageUrl: string; };
type CartItem = { name: string; normalizedName: string; price: number; quantity: number; };

/**
 * DoorDash content script — detects cart and extracts items.
 * 
 * DoorDash cart structure (as of Feb 2026):
 * - Cart drawer: [data-testid="CartContent"] or .sc-* styled components
 * - Cart items have item name + price + quantity
 * - Restaurant name in header / breadcrumb
 * 
 * Strategy: MutationObserver watches for cart open/change,
 * then parses DOM for cart items.
 */



let lastCartHash = '';

function extractCart(): CartDetection | null {
  // DoorDash uses dynamic class names (styled-components), so we target
  // by structure and data-testid attributes where possible.
  
  const restaurantEl =
    document.querySelector('[data-testid="StoreHeader"] h1') ??
    document.querySelector('h1[class*="StoreHeader"]') ??
    document.querySelector('.store-header h1');

  const restaurantName = restaurantEl?.textContent?.trim();
  if (!restaurantName) return null;

  const items: CartItem[] = [];

  // Try multiple selectors — DoorDash changes DOM frequently
  const cartSelectors = [
    '[data-testid="CartItemList"] [data-testid="CartItem"]',
    '[class*="CartItem"]',
    '.cart-item',
  ];

  let cartItems: NodeListOf<Element> | null = null;
  for (const selector of cartSelectors) {
    cartItems = document.querySelectorAll(selector);
    if (cartItems.length > 0) break;
  }

  if (!cartItems || cartItems.length === 0) return null;

  for (const el of cartItems) {
    const nameEl = el.querySelector('[data-testid="CartItemName"], [class*="itemName"], .item-name');
    const priceEl = el.querySelector('[data-testid="CartItemPrice"], [class*="itemPrice"], .item-price');
    const qtyEl = el.querySelector('[data-testid="CartItemQuantity"], [class*="quantity"], .quantity');

    const name = nameEl?.textContent?.trim();
    const priceText = priceEl?.textContent?.trim();

    if (!name || !priceText) continue;

    const price = parsePriceCents(priceText);
    const quantity = parseInt(qtyEl?.textContent?.trim() ?? '1', 10) || 1;

    items.push({
      name,
      normalizedName: normalizeMenuItemName(name),
      price,
      quantity,
    });
  }

  if (items.length === 0) return null;

  return {
    platform: 'doordash',
    restaurantName,
    items,
    pageUrl: window.location.href,
  };
}

function parsePriceCents(text: string): number {
  const match = text.match(/\$?([\d,]+\.?\d*)/);
  if (!match) return 0;
  return Math.round(parseFloat(match[1].replace(',', '')) * 100);
}

function hashCart(detection: CartDetection): string {
  return JSON.stringify(detection.items.map(i => `${i.normalizedName}:${i.quantity}`));
}

function checkCart(): void {
  const cart = extractCart();
  if (!cart) return;

  const hash = hashCart(cart);
  if (hash === lastCartHash) return;
  lastCartHash = hash;

  // Send to background script
  chrome.runtime.sendMessage({
    type: 'CART_DETECTED',
    payload: cart,
  });
}

// Watch for cart changes
const observer = new MutationObserver(() => {
  // Debounce — cart DOM updates multiple times during interaction
  clearTimeout((window as any).__mcDebounce);
  (window as any).__mcDebounce = setTimeout(checkCart, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

// Initial check
setTimeout(checkCart, 2000);

console.log('[Eddy] DoorDash content script loaded');
