/**
 * DoorDash content script — cart detection with resilient extraction.
 *
 * MITIGATIONS:
 * 1. Title-first restaurant name extraction (stable across DOM changes)
 * 2. Multiple fallback selector chains for cart items
 * 3. Price pattern matching as last resort (no fixed selectors)
 * 4. No console.log breadcrumbs
 */

function normalizeMenuItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[®™©]/g, '').replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*-\s*delivered\s*/gi, '').replace(/\s*\[.*?\]\s*/g, '')
    .replace(/#(\d+)\s+/g, '#$1 ').replace(/\s*-\s*/g, ' ')
    .replace(/[^a-z0-9#\s]/g, '').replace(/\s+/g, ' ').trim();
}

type RealFees = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
  smallOrderFee?: number;
  promoDiscount?: number;
};
type CartDetection = { platform: string; restaurantName: string; items: CartItem[]; pageUrl: string; realFees?: RealFees };
type CartItem = { name: string; normalizedName: string; price: number; quantity: number };

let lastCartHash = '';

function extractRestaurantName(): string | null {
  // 1. Title — most resilient
  const titleMatch = document.title.match(/^(.+?)\s*[-–|·]\s*(?:Deliver|Order|DoorDash)/i);
  if (titleMatch) {
    const c = titleMatch[1].trim();
    if (c.length >= 2 && c.length <= 60) return c;
  }
  // 2. JSON-LD
  for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { const d = JSON.parse(el.textContent ?? ''); if (d?.name) return d.name; } catch {}
  }
  // 3. OG meta
  const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (og?.content) { const m = og.content.match(/^(.+?)\s*[-–|·]/); if (m) return m[1].trim(); }
  // 4. DOM selectors (least stable)
  for (const sel of ['[data-testid="StoreHeader"] h1', 'h1']) {
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

  // Try structured selectors first, then heuristic
  const selectorChains = [
    '[data-testid="CartItemList"] [data-testid="CartItem"]',
    '[class*="CartItem"]',
    '.cart-item',
  ];

  let cartEls: NodeListOf<Element> | null = null;
  for (const sel of selectorChains) {
    cartEls = document.querySelectorAll(sel);
    if (cartEls.length > 0) break;
  }

  if (cartEls && cartEls.length > 0) {
    for (const el of cartEls) {
      const nameEl = el.querySelector('[data-testid="CartItemName"], [class*="itemName"], .item-name');
      const priceEl = el.querySelector('[data-testid="CartItemPrice"], [class*="itemPrice"], .item-price');
      const qtyEl = el.querySelector('[data-testid="CartItemQuantity"], [class*="quantity"]');
      const name = nameEl?.textContent?.trim();
      const priceText = priceEl?.textContent?.trim();
      if (!name || !priceText) continue;
      items.push({
        name, normalizedName: normalizeMenuItemName(name),
        price: parseCents(priceText),
        quantity: parseInt(qtyEl?.textContent?.trim() ?? '1', 10) || 1,
      });
    }
  }

  // Heuristic fallback: scan for price-adjacent text patterns
  if (items.length === 0) {
    const allEls = document.querySelectorAll('[class*="cart"] span, [class*="Cart"] span, [class*="bag"] span');
    let pendingName = '';
    for (const el of allEls) {
      const t = (el.textContent ?? '').trim();
      if (!t) continue;
      const priceMatch = t.match(/^\$(\d+\.?\d*)$/);
      if (priceMatch && pendingName) {
        items.push({
          name: pendingName, normalizedName: normalizeMenuItemName(pendingName),
          price: Math.round(parseFloat(priceMatch[1]) * 100), quantity: 1,
        });
        pendingName = '';
      } else if (t.length >= 3 && t.length <= 60 && !t.includes('$')) {
        pendingName = t;
      }
    }
  }

  if (items.length === 0) return null;

  // #1: Extract real fees from the checkout/cart panel
  const realFees = extractRealFees();

  return { platform: 'doordash', restaurantName, items, pageUrl: location.href, ...(realFees ? { realFees } : {}) };
}

/**
 * #1: Extract REAL fee breakdown from DoorDash cart panel.
 * Looks for labeled price rows (Subtotal, Service Fee, Delivery Fee, Tax, etc.)
 */
function extractRealFees(): RealFees | null {
  const fees: Partial<RealFees> = {};
  const feeLabels: Record<string, keyof RealFees> = {
    'subtotal': 'subtotal',
    'service fee': 'serviceFee',
    'delivery fee': 'deliveryFee',
    'estimated tax': 'tax',
    'taxes': 'tax',
    'tax': 'tax',
    'total': 'total',
    'order total': 'total',
    'small order fee': 'smallOrderFee',
    'discount': 'promoDiscount',
    'promo': 'promoDiscount',
  };

  // Strategy 1: Look for fee rows with data-testid
  const testIdSelectors = [
    '[data-testid="Subtotal"]', '[data-testid="ServiceFee"]',
    '[data-testid="DeliveryFee"]', '[data-testid="Tax"]',
    '[data-testid="Total"]',
  ];
  for (const sel of testIdSelectors) {
    const el = document.querySelector(sel);
    if (el) {
      const priceEl = el.querySelector('span:last-child') ?? el;
      const price = parseCents(priceEl.textContent ?? '');
      const label = sel.match(/data-testid="(\w+)"/)?.[1]?.toLowerCase();
      if (price > 0 && label) {
        const key = feeLabels[label] ?? label;
        if (key in fees || ['subtotal', 'serviceFee', 'deliveryFee', 'tax', 'total', 'smallOrderFee', 'promoDiscount'].includes(key as string)) {
          (fees as any)[key] = price;
        }
      }
    }
  }

  // Strategy 2: Heuristic — scan for label-value pairs in cart/checkout area
  if (!fees.total) {
    const containers = document.querySelectorAll('[class*="cart"], [class*="Cart"], [class*="checkout"], [class*="Checkout"], [class*="OrderSummary"], [class*="order-summary"]');
    for (const container of containers) {
      const spans = container.querySelectorAll('span, div, p');
      for (let i = 0; i < spans.length; i++) {
        const text = (spans[i].textContent ?? '').trim().toLowerCase();
        for (const [labelText, feeKey] of Object.entries(feeLabels)) {
          if (text.includes(labelText) && !text.includes('$')) {
            // Look at next sibling or adjacent element for the price
            for (let j = i + 1; j < Math.min(i + 4, spans.length); j++) {
              const priceText = (spans[j].textContent ?? '').trim();
              const price = parseCents(priceText);
              if (price > 0) {
                (fees as any)[feeKey] = price;
                break;
              }
              // "Free" delivery
              if (priceText.toLowerCase() === 'free' && feeKey === 'deliveryFee') {
                fees.deliveryFee = 0;
                break;
              }
            }
          }
        }
      }
    }
  }

  // Need at least subtotal and total to be useful
  if (fees.subtotal && fees.total) {
    return {
      subtotal: fees.subtotal,
      serviceFee: fees.serviceFee ?? 0,
      deliveryFee: fees.deliveryFee ?? 0,
      tax: fees.tax ?? 0,
      total: fees.total,
      smallOrderFee: fees.smallOrderFee,
      promoDiscount: fees.promoDiscount,
    };
  }

  return null;
}

function parseCents(text: string): number {
  const m = text.match(/\$?([\d,]+\.?\d*)/);
  return m ? Math.round(parseFloat(m[1].replace(',', '')) * 100) : 0;
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
