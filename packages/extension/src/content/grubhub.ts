function normalizeMenuItemName(name: string): string { return name.toLowerCase().replace(/[®™©]/g, "").replace(/\s*\(.*?\)\s*/g, "").replace(/\s*-\s*delivered\s*/gi, "").replace(/\s*\[.*?\]\s*/g, "").replace(/#(\d+)\s+/g, "#$1 ").replace(/\s*-\s*/g, " ").replace(/[^a-z0-9#\s]/g, "").replace(/\s+/g, " ").trim(); }
type CartDetection = { platform: string; restaurantName: string; items: CartItem[]; pageUrl: string; };
type CartItem = { name: string; normalizedName: string; price: number; quantity: number; };

/**
 * Grubhub content script — cart detection.
 * Grubhub uses more traditional DOM — easier to parse.
 */



let lastCartHash = '';

function extractCart(): CartDetection | null {
  const restaurantEl =
    document.querySelector('[data-testid="restaurant-name"]') ??
    document.querySelector('.restaurant-name') ??
    document.querySelector('h1');

  const restaurantName = restaurantEl?.textContent?.trim();
  if (!restaurantName) return null;

  const items: CartItem[] = [];

  const cartSelectors = [
    '.cartItems .cartItem',
    '[data-testid="cart-item"]',
    '.bag-item',
  ];

  let cartItems: NodeListOf<Element> | null = null;
  for (const selector of cartSelectors) {
    cartItems = document.querySelectorAll(selector);
    if (cartItems.length > 0) break;
  }

  if (!cartItems || cartItems.length === 0) return null;

  for (const el of cartItems) {
    const nameEl = el.querySelector('.itemName, [data-testid="item-name"]');
    const priceEl = el.querySelector('.itemPrice, [data-testid="item-price"]');
    const qtyEl = el.querySelector('.itemQuantity, [data-testid="item-qty"]');

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
    platform: 'grubhub',
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

function hashCart(d: CartDetection): string {
  return JSON.stringify(d.items.map(i => `${i.normalizedName}:${i.quantity}`));
}

function checkCart(): void {
  const cart = extractCart();
  if (!cart) return;
  const hash = hashCart(cart);
  if (hash === lastCartHash) return;
  lastCartHash = hash;
  chrome.runtime.sendMessage({ type: 'CART_DETECTED', payload: cart });
}

const observer = new MutationObserver(() => {
  clearTimeout((window as any).__mcDebounce);
  (window as any).__mcDebounce = setTimeout(checkCart, 500);
});

observer.observe(document.body, { childList: true, subtree: true, characterData: true });
setTimeout(checkCart, 2000);

console.log('[Eddy] Grubhub content script loaded');
