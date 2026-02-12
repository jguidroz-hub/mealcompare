/**
 * MealCompare background service worker.
 * 
 * COMPARISON FLOW:
 * 1. Content script detects cart on Platform A
 * 2. Background calls server API → gets Uber Eats prices (always available server-side)
 * 3. Background also queries other platforms:
 *    - If user is on DD → UE prices come from server, GH from estimate
 *    - If user is on UE → DD/GH from estimates (v0), extension scraping (v1)
 * 4. Results shown in popup with savings + deep links
 * 
 * v0 SIMPLIFICATION:
 * - Server handles UE comparisons (real prices)
 * - DD/GH use fee estimates for non-UE comparisons
 * - Still valuable: DoorDash users (67% market) save by seeing UE prices
 */

import { CartDetection, ComparisonResult } from '@mealcompare/shared';

let latestCart: CartDetection | null = null;
let latestResult: ComparisonResult | null = null;
let isComparing = false;

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CART_DETECTED':
      latestCart = message.payload;
      runComparison(message.payload);
      updateBadge(message.payload);
      sendResponse({ ok: true });
      break;

    case 'GET_STATE':
      sendResponse({
        cart: latestCart,
        result: latestResult,
        isComparing,
      });
      break;

    case 'CLEAR':
      latestCart = null;
      latestResult = null;
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ ok: true });
      break;
  }

  return true;
});

function updateBadge(cart: CartDetection): void {
  chrome.action.setBadgeText({ text: `${cart.items.length}` });
  chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' }); // Blue = cart detected
}

async function runComparison(cart: CartDetection): Promise<void> {
  isComparing = true;
  latestResult = null;

  try {
    const apiBase = await getApiBase();

    const response = await fetch(`${apiBase}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePlatform: cart.platform,
        restaurantName: cart.restaurantName,
        items: cart.items,
        metro: await getMetro(),
      }),
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}: ${await response.text()}`);
    }

    latestResult = await response.json();

    // Update badge with savings
    if (latestResult && latestResult.savings > 100) { // Only show if >$1 savings
      const savingsDollars = Math.floor(latestResult.savings / 100);
      chrome.action.setBadgeText({ text: `-$${savingsDollars}` });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' }); // Green = savings found
    } else if (latestResult) {
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#6b7280' }); // Gray = compared, no savings
    }

    // Notify any open popups
    chrome.runtime.sendMessage({
      type: 'COMPARE_RESULT',
      payload: latestResult,
    }).catch(() => {}); // Popup might not be open

  } catch (err) {
    console.error('[MealCompare] Comparison failed:', err);
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // Red = error
  } finally {
    isComparing = false;
  }
}

async function getApiBase(): Promise<string> {
  const stored = await chrome.storage.sync.get('apiBase');
  return stored.apiBase || 'http://localhost:3001';
}

async function getMetro(): Promise<string> {
  const stored = await chrome.storage.sync.get('metro');
  return stored.metro || 'austin';
}

// On install, set defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    metro: 'austin',
    apiBase: 'http://localhost:3001',
  });
  console.log('[MealCompare] Extension installed. Default metro: austin');
});

console.log('[MealCompare] Background service worker loaded');
