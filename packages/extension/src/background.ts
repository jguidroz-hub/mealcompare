/**
 * Eddy background service worker.
 * 
 * Detects carts on DoorDash, Uber Eats, Grubhub → compares prices
 * across platforms + direct ordering to find the cheapest option.
 * 
 * Features:
 * #1: Passes real fees from page scraping to comparison API
 * #5: Generates deep links for switching platforms
 * #8: Supports community restaurant URL submissions
 * #10: Tracks savings per session
 */

import { CartDetection, ComparisonResult } from '@mealcompare/shared';

const API_BASE = 'https://eddy.delivery';

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

    // #8: Community submission — user submits a direct ordering URL
    case 'SUBMIT_RESTAURANT':
      submitRestaurant(message.payload).then(r => sendResponse(r)).catch(() => sendResponse({ ok: false }));
      return true; // async

    // #10: Record that the user chose a cheaper option (savings event)
    case 'RECORD_SAVINGS':
      recordSavings(message.payload).catch(() => {});
      sendResponse({ ok: true });
      break;

    // #5: Generate deep link for switching platforms
    case 'GET_DEEP_LINK':
      sendResponse({ deepLink: generateDeepLink(message.payload) });
      break;
  }

  return true;
});

function updateBadge(cart: CartDetection): void {
  chrome.action.setBadgeText({ text: `${cart.items.length}` });
  chrome.action.setBadgeBackgroundColor({ color: '#2563EB' });
}

async function runComparison(cart: CartDetection): Promise<void> {
  isComparing = true;
  latestResult = null;
  latestError = null;

  try {
    const metro = await getMetro();
    const sessionId = await getSessionId();

    const response = await fetch(`${API_BASE}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePlatform: cart.platform,
        restaurantName: cart.restaurantName,
        items: cart.items,
        metro,
        sessionId,
        // #1: Pass real fees if the content script extracted them
        ...(cart.realFees ? { realFees: cart.realFees } : {}),
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Server error (${response.status})${text ? ': ' + text : ''}`);
    }

    latestResult = await response.json();

    // Track stats locally
    await trackComparison(latestResult);

    // Update badge with savings
    if (latestResult && latestResult.savings > 100) {
      const savingsDollars = Math.floor(latestResult.savings / 100);
      chrome.action.setBadgeText({ text: `-$${savingsDollars}` });
      chrome.action.setBadgeBackgroundColor({ color: '#FACC15' }); // Eddy yellow for savings
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

async function getSessionId(): Promise<string> {
  const stored = await chrome.storage.sync.get('sessionId');
  if (stored.sessionId) return stored.sessionId;
  const id = 'eddy-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  await chrome.storage.sync.set({ sessionId: id });
  return id;
}

// ─── #8: Community Restaurant Submission ──────────────────────

async function submitRestaurant(payload: {
  restaurantName: string;
  metro: string;
  directUrl: string;
  platformUrl?: string;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const sessionId = await getSessionId();
    const response = await fetch(`${API_BASE}/api/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        submittedBy: sessionId,
      }),
    });
    return await response.json();
  } catch {
    return { ok: false, message: 'Submission failed' };
  }
}

// ─── #10: Record Savings Event ────────────────────────────────

async function recordSavings(payload: {
  restaurantName: string;
  savingsCents: number;
  chosenPlatform: string;
}): Promise<void> {
  try {
    const sessionId = await getSessionId();
    await fetch(`${API_BASE}/api/savings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        restaurantName: payload.restaurantName,
        savingsCents: payload.savingsCents,
        chosenPlatform: payload.chosenPlatform,
      }),
    });
  } catch { /* non-critical */ }
}

// ─── #5: Deep Link Generation ─────────────────────────────────

function generateDeepLink(payload: {
  platform: string;
  restaurantName: string;
  items?: Array<{ name: string }>;
}): string {
  const { platform, restaurantName } = payload;
  const encoded = encodeURIComponent(restaurantName);

  switch (platform) {
    case 'doordash':
      return `https://www.doordash.com/search/store/${encoded}/?utm_source=eddy`;
    case 'ubereats':
      return `https://www.ubereats.com/search?q=${encoded}&utm_source=eddy`;
    case 'grubhub':
      return `https://www.grubhub.com/search?orderMethod=delivery&query=${encoded}&utm_source=eddy`;
    case 'direct':
      return `https://www.google.com/search?q=${encoded}+order+online+direct`;
    default:
      return `https://www.google.com/search?q=${encoded}+food+delivery`;
  }
}

// ─── Install Handler ──────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.sync.set({
    metro: 'austin',
    totalComparisons: 0,
    totalSavingsCents: 0,
  });

  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'https://eddy.delivery/welcome?source=extension',
    });
  }
});
