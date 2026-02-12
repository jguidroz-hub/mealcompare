/**
 * MealCompare background service worker.
 * 
 * Receives cart detections from content scripts,
 * runs comparison engine, and sends results to popup.
 */

import { CartDetection, ComparisonResult, ExtensionMessage } from '@mealcompare/shared';

// Store latest cart detection and comparison result
let latestCart: CartDetection | null = null;
let latestResult: ComparisonResult | null = null;
let isComparing = false;

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === 'CART_DETECTED') {
      latestCart = message.payload;
      runComparison(message.payload);
      sendResponse({ ok: true });

      // Update badge to show we detected a cart
      chrome.action.setBadgeText({ text: `${message.payload.items.length}` });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
    }

    return true; // Keep message channel open for async
  }
);

// Popup requests current state
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    sendResponse({
      cart: latestCart,
      result: latestResult,
      isComparing,
    });
  }
  return true;
});

async function runComparison(cart: CartDetection): Promise<void> {
  isComparing = true;
  latestResult = null;

  try {
    // v0: Call our API backend for comparison
    // In production this hits api.mealcompare.com
    // For dev, use localhost:3001
    const apiBase = await getApiBase();

    const response = await fetch(`${apiBase}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePlatform: cart.platform,
        restaurantName: cart.restaurantName,
        items: cart.items,
        metro: 'austin', // TODO: detect from user settings
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    latestResult = await response.json();

    // Update badge with savings
    if (latestResult && latestResult.savings > 0) {
      const savingsDollars = Math.floor(latestResult.savings / 100);
      chrome.action.setBadgeText({ text: `-$${savingsDollars}` });
      chrome.action.setBadgeBackgroundColor({ color: '#EF4444' }); // Red = savings available
    }
  } catch (err) {
    console.error('[MealCompare] Comparison failed:', err);
    // Don't clear latestCart — user can retry
  } finally {
    isComparing = false;
  }
}

async function getApiBase(): Promise<string> {
  const stored = await chrome.storage.sync.get('apiBase');
  return stored.apiBase || 'http://localhost:3001';
}

console.log('[MealCompare] Background service worker loaded');
