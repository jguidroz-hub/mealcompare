/**
 * Grubhub content script — cart detection with resilient extraction.
 * Title-first, multi-fallback, no console breadcrumbs.
 */

function normalizeMenuItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[®™©]/g, '').replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*-\s*delivered\s*/gi, '').replace(/\s*\[.*?\]\s*/g, '')
    .replace(/#(\d+)\s+/g, '#$1 ').replace(/\s*-\s*/g, ' ')
    .replace(/[^a-z0-9#\s]/g, '').replace(/\s+/g, ' ').trim();
}

type RealFees = { subtotal: number; serviceFee: number; deliveryFee: number; tax: number; total: number; smallOrderFee?: number; promoDiscount?: number };
type CartDetection = { platform: string; restaurantName: string; items: CartItem[]; pageUrl: string; realFees?: RealFees };
type CartItem = { name: string; normalizedName: string; price: number; quantity: number };

let lastCartHash = '';

function extractRestaurantName(): string | null {
  const titleMatch = document.title.match(/^(.+?)\s*[-–|·]\s*(?:Deliver|Order|Grubhub)/i);
  if (titleMatch) { const c = titleMatch[1].trim(); if (c.length >= 2 && c.length <= 60) return c; }
  for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { const d = JSON.parse(el.textContent ?? ''); if (d?.name) return d.name; } catch {}
  }
  const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (og?.content) { const m = og.content.match(/^(.+?)\s*[-–|·]/); if (m) return m[1].trim(); }
  for (const sel of ['[data-testid="restaurant-name"]', '.restaurant-name', 'h1']) {
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
  const sels = ['.cartItems .cartItem', '[data-testid="cart-item"]', '.bag-item'];
  let cartEls: NodeListOf<Element> | null = null;
  for (const sel of sels) { cartEls = document.querySelectorAll(sel); if (cartEls.length > 0) break; }

  if (cartEls && cartEls.length > 0) {
    for (const el of cartEls) {
      const nameEl = el.querySelector('.itemName, [data-testid="item-name"]');
      const priceEl = el.querySelector('.itemPrice, [data-testid="item-price"]');
      const qtyEl = el.querySelector('.itemQuantity, [data-testid="item-qty"]');
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

  const realFees = extractRealFees();
  return { platform: 'grubhub', restaurantName, items, pageUrl: location.href, ...(realFees ? { realFees } : {}) };
}

function parseCents(text: string): number {
  const m = text.match(/\$?([\d,]+\.?\d*)/);
  return m ? Math.round(parseFloat(m[1].replace(',', '')) * 100) : 0;
}

function extractRealFees(): RealFees | null {
  const fees: Partial<RealFees> = {};
  const feeMap: Record<string, keyof RealFees> = {
    'subtotal': 'subtotal', 'service fee': 'serviceFee', 'delivery fee': 'deliveryFee',
    'tax': 'tax', 'taxes and fees': 'tax', 'estimated tax': 'tax',
    'total': 'total', 'order total': 'total', 'small order fee': 'smallOrderFee',
  };

  const containers = document.querySelectorAll('[class*="cart"], [class*="bag"], [class*="Cart"], [class*="Bag"], [class*="checkout"], [class*="Checkout"]');
  for (const container of containers) {
    const els = container.querySelectorAll('span, div, li, p');
    for (let i = 0; i < els.length; i++) {
      const text = (els[i].textContent ?? '').trim().toLowerCase();
      for (const [label, key] of Object.entries(feeMap)) {
        if (text.includes(label) && !text.includes('$')) {
          for (let j = i + 1; j < Math.min(i + 4, els.length); j++) {
            const pt = (els[j].textContent ?? '').trim();
            if (pt.toLowerCase() === 'free') { (fees as any)[key] = 0; break; }
            const price = parseCents(pt);
            if (price > 0) { (fees as any)[key] = price; break; }
          }
        }
      }
    }
  }

  if (fees.subtotal && fees.total) {
    return { subtotal: fees.subtotal, serviceFee: fees.serviceFee ?? 0, deliveryFee: fees.deliveryFee ?? 0, tax: fees.tax ?? 0, total: fees.total, smallOrderFee: fees.smallOrderFee, promoDiscount: fees.promoDiscount };
  }
  return null;
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
