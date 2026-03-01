/**
 * SkipTheFee background service worker.
 * 
 * Detects carts on DoorDash, Uber Eats, Grubhub → compares prices
 * across platforms + direct ordering to find the cheapest option.
 */

import { CartDetection, ComparisonResult } from '@mealcompare/shared';

const API_BASE = 'https://skipthefee.vercel.app';

let latestCart: CartDetection | null = null;
let latestResult: ComparisonResult | null = null;
let latestError: string | null = null;
let isComparing = false;

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CART_DETECTED':
      latestCart = message.payload;
      latestError = null;
      runComparison(message.payload);
      updateBadge(message.payload);
      sendResponse({ ok: true });
      break;

    case 'GET_STATE':
      sendResponse({
        cart: latestCart,
        result: latestResult,
        error: latestError,
        isComparing,
      });
      break;

    case 'RETRY_COMPARE':
      if (latestCart) {
        latestError = null;
        runComparison(latestCart);
      }
      sendResponse({ ok: true });
      break;

    case 'CLEAR':
      latestCart = null;
      latestResult = null;
      latestError = null;
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ ok: true });
      break;

    case 'AUTOFILL_ORDER': {
      // Open the target platform, navigate to the chain, then auto-fill items
      const { platform, chainName, items, url } = message.payload;
      handleAutofillOrder(platform, chainName, items, url)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true; // async
    }
  }

  return true;
});

function updateBadge(cart: CartDetection): void {
  chrome.action.setBadgeText({ text: `${cart.items.length}` });
  chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });
}

async function runComparison(cart: CartDetection): Promise<void> {
  isComparing = true;
  latestResult = null;
  latestError = null;

  try {
    const metro = await getMetro();

    const response = await fetch(`${API_BASE}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePlatform: cart.platform,
        restaurantName: cart.restaurantName,
        items: cart.items,
        metro,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Server error (${response.status})${text ? ': ' + text : ''}`);
    }

    latestResult = await response.json();

    // Track stats
    await trackComparison(latestResult);

    // Update badge with savings
    if (latestResult && latestResult.savings > 100) {
      const savingsDollars = Math.floor(latestResult.savings / 100);
      chrome.action.setBadgeText({ text: `-$${savingsDollars}` });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    } else if (latestResult) {
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    }

    // Notify any open popups
    chrome.runtime.sendMessage({
      type: 'COMPARE_RESULT',
      payload: latestResult,
    }).catch(() => {});

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Comparison failed';
    console.error('[SkipTheFee] Comparison failed:', errorMsg);
    latestError = errorMsg;
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  } finally {
    isComparing = false;
  }
}

async function trackComparison(result: ComparisonResult | null): Promise<void> {
  if (!result) return;
  try {
    const data = await chrome.storage.sync.get(['totalComparisons', 'totalSavingsCents']);
    await chrome.storage.sync.set({
      totalComparisons: (data.totalComparisons || 0) + 1,
      totalSavingsCents: (data.totalSavingsCents || 0) + Math.max(0, result.savings),
    });
  } catch { /* non-critical */ }
}

async function getMetro(): Promise<string> {
  const stored = await chrome.storage.sync.get('metro');
  return stored.metro || 'austin';
}

// On install — set defaults and show welcome
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.sync.set({
    metro: 'austin',
    totalComparisons: 0,
    totalSavingsCents: 0,
  });

  if (details.reason === 'install') {
    // Open onboarding tab
    chrome.tabs.create({
      url: 'https://skipthefee.app/welcome?source=extension',
    });
  }

  console.log('[SkipTheFee] Extension installed. Default metro: austin');
});

// ─── External Messages (from Eddy web app) ────────────────────

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTOFILL_ORDER') {
    const { platform, chainName, items, url } = message.payload;
    handleAutofillOrder(platform, chainName, items, url)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
  
  if (message.type === 'PING') {
    sendResponse({ ok: true, version: chrome.runtime.getManifest().version });
    return;
  }
});

// ─── Auto-Fill Handler ─────────────────────────────────────────

interface AutofillItem {
  name: string;
  quantity: number;
}

async function handleAutofillOrder(
  platform: string,
  chainName: string,
  items: AutofillItem[],
  url: string
): Promise<{ success: boolean; tabId?: number }> {
  // Open the platform URL in a new tab
  const tab = await chrome.tabs.create({ url, active: true });
  
  if (!tab.id) return { success: false };
  
  // Wait for tab to finish loading
  await new Promise<void>((resolve) => {
    const listener = (tabId: number, info: chrome.tabs.TabChangeInfo) => {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    // Timeout after 15s
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 15000);
  });
  
  // Wait extra for SPA content to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Send autofill request to the content script
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'AUTOFILL_CART',
      items,
      chainName,
    });
    return { success: true, tabId: tab.id };
  } catch (err) {
    return { success: false };
  }
}

console.log('[SkipTheFee] Background service worker loaded');
