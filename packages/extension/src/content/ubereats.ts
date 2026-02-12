/**
 * Uber Eats content script — cart detection.
 * 
 * Uber Eats cart structure:
 * - Cart panel: [data-testid="cart-content"]
 * - Items within the cart have name, price, quantity
 * - Restaurant name from store page header
 */

import { CartDetection, CartItem, normalizeMenuItemName } from '@mealcompare/shared';

let lastCartHash = '';

function extractCart(): CartDetection | null {
  const restaurantEl =
    document.querySelector('[data-testid="store-title"]') ??
    document.querySelector('h1[class*="store"]') ??
    document.querySelector('[class*="StoreTitle"] h1');

  const restaurantName = restaurantEl?.textContent?.trim();
  if (!restaurantName) return null;

  const items: CartItem[] = [];

  const cartSelectors = [
    '[data-testid="cart-content"] [data-testid="cart-item"]',
    '[class*="cartItem"]',
    '[data-testid="cart-item"]',
  ];

  let cartItems: NodeListOf<Element> | null = null;
  for (const selector of cartSelectors) {
    cartItems = document.querySelectorAll(selector);
    if (cartItems.length > 0) break;
  }

  if (!cartItems || cartItems.length === 0) return null;

  for (const el of cartItems) {
    const nameEl = el.querySelector('[data-testid="cart-item-name"], [class*="itemName"]');
    const priceEl = el.querySelector('[data-testid="cart-item-price"], [class*="itemPrice"]');
    const qtyEl = el.querySelector('[data-testid="cart-item-quantity"], [class*="quantity"]');

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
    platform: 'ubereats',
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

console.log('[MealCompare] Uber Eats content script loaded');
