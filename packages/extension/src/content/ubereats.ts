/**
 * Uber Eats content script — cart detection with resilient extraction.
 * Title-first, multi-fallback, no console breadcrumbs.
 */

function normalizeMenuItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[®™©]/g, '').replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*-\s*delivered\s*/gi, '').replace(/\s*\[.*?\]\s*/g, '')
    .replace(/#(\d+)\s+/g, '#$1 ').replace(/\s*-\s*/g, ' ')
    .replace(/[^a-z0-9#\s]/g, '').replace(/\s+/g, ' ').trim();
}

type CartDetection = { platform: string; restaurantName: string; items: CartItem[]; pageUrl: string };
type CartItem = { name: string; normalizedName: string; price: number; quantity: number };

let lastCartHash = '';

function extractRestaurantName(): string | null {
  const titleMatch = document.title.match(/^(.+?)\s*[-–|·]\s*(?:Deliver|Order|Uber\s*Eats)/i);
  if (titleMatch) { const c = titleMatch[1].trim(); if (c.length >= 2 && c.length <= 60) return c; }
  for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { const d = JSON.parse(el.textContent ?? ''); if (d?.name) return d.name; } catch {}
  }
  const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (og?.content) { const m = og.content.match(/^(.+?)\s*[-–|·]/); if (m) return m[1].trim(); }
  for (const sel of ['[data-testid="store-title"]', '[data-testid="store-title-summary"]', 'h1']) {
    const el = document.querySelector(sel);
    const t = el?.textContent?.trim();
    if (t && t.length >= 2 && t.length <= 60) return t;
  }
  return null;
}

function extractCart(): CartDetection | null {
  const restaurantName = extractRestaurantName();
  if (!restaurantName) return null;

  const items: CartItem[] = [];
  const sels = [
    '[data-testid="cart-content"] [data-testid="cart-item"]',
    '[class*="cartItem"]',
    '[data-testid="cart-item"]',
  ];
  let cartEls: NodeListOf<Element> | null = null;
  for (const sel of sels) { cartEls = document.querySelectorAll(sel); if (cartEls.length > 0) break; }

  if (cartEls && cartEls.length > 0) {
    for (const el of cartEls) {
      const nameEl = el.querySelector('[data-testid="cart-item-name"], [class*="itemName"]');
      const priceEl = el.querySelector('[data-testid="cart-item-price"], [class*="itemPrice"]');
      const qtyEl = el.querySelector('[data-testid="cart-item-quantity"], [class*="quantity"]');
      const name = nameEl?.textContent?.trim();
      const priceText = priceEl?.textContent?.trim();
      if (!name || !priceText) continue;
      const pm = priceText.match(/\$?([\d,]+\.?\d*)/);
      items.push({
        name, normalizedName: normalizeMenuItemName(name),
        price: pm ? Math.round(parseFloat(pm[1].replace(',', '')) * 100) : 0,
        quantity: parseInt(qtyEl?.textContent?.trim() ?? '1', 10) || 1,
      });
    }
  }

  if (items.length === 0) return null;
  return { platform: 'ubereats', restaurantName, items, pageUrl: location.href };
}

function checkCart(): void {
  const cart = extractCart();
  if (!cart) return;
  const hash = JSON.stringify(cart.items.map(i => `${i.normalizedName}:${i.quantity}`));
  if (hash === lastCartHash) return;
  lastCartHash = hash;
  chrome.runtime.sendMessage({ type: 'CART_DETECTED', payload: cart });
}

const observer = new MutationObserver(() => {
  clearTimeout((window as any).__edDeb);
  (window as any).__edDeb = setTimeout(checkCart, 500);
});
observer.observe(document.body, { childList: true, subtree: true, characterData: true });
setTimeout(checkCart, 2000);
