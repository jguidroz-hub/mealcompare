/**
 * Eddy Overlay — Honey-style notification on delivery app pages
 * 
 * Detects which restaurant the user is viewing on DoorDash/UberEats/Grubhub,
 * looks it up in our database, and shows a slide-in panel if direct ordering exists.
 */

const STF_OVERLAY_ID = 'eddy-overlay';
const STF_SHOWN_KEY = 'stf_shown_restaurants';
const API_BASE = 'https://eddy.delivery';

interface DirectMatch {
  name: string;
  directUrl: string;
  platform: string;
  category: string;
}

// Detect which delivery platform we're on
function detectPlatform(): 'doordash' | 'ubereats' | 'grubhub' | null {
  const host = window.location.hostname;
  if (host.includes('doordash.com')) return 'doordash';
  if (host.includes('ubereats.com')) return 'ubereats';
  if (host.includes('grubhub.com')) return 'grubhub';
  return null;
}

// Extract restaurant name from the page
function extractRestaurantName(): string | null {
  const platform = detectPlatform();
  if (!platform) return null;

  let name: string | null = null;

  if (platform === 'doordash') {
    // DoorDash: restaurant name in h1 inside store header, or page title
    const el = document.querySelector('[data-testid="StoreHeader"] h1, h1[class*="StoreHeader"], .store-header h1');
    name = el?.textContent?.trim() || null;
    // Fallback: page title "Restaurant Name - DoorDash"
    if (!name) {
      const titleMatch = document.title.match(/^(.+?)\s*[-–|]\s*(?:Delivery|DoorDash)/i);
      if (titleMatch) name = titleMatch[1].trim();
    }
  }

  if (platform === 'ubereats') {
    // UberEats: h1 on store page, or title "Restaurant | Uber Eats"
    const el = document.querySelector('h1[data-testid="store-title-summary"], h1[class*="StoreName"]');
    name = el?.textContent?.trim() || null;
    if (!name) {
      const titleMatch = document.title.match(/^(.+?)\s*[-–|]\s*(?:Delivery|Uber\s*Eats)/i);
      if (titleMatch) name = titleMatch[1].trim();
    }
  }

  if (platform === 'grubhub') {
    // Grubhub: h1 or title
    const el = document.querySelector('h1.restaurant-name, h1[class*="restaurantName"]');
    name = el?.textContent?.trim() || null;
    if (!name) {
      const titleMatch = document.title.match(/^(.+?)\s*[-–|]\s*(?:Delivery|Order|Grubhub)/i);
      if (titleMatch) name = titleMatch[1].trim();
    }
  }

  return name;
}

// Check if we already showed for this restaurant recently
function wasRecentlyShown(restaurantName: string): boolean {
  try {
    const shown = JSON.parse(localStorage.getItem(STF_SHOWN_KEY) || '{}');
    const lastShown = shown[restaurantName.toLowerCase()];
    if (!lastShown) return false;
    // Don't show again for 24 hours
    return Date.now() - lastShown < 24 * 60 * 60 * 1000;
  } catch { return false; }
}

function markShown(restaurantName: string) {
  try {
    const shown = JSON.parse(localStorage.getItem(STF_SHOWN_KEY) || '{}');
    shown[restaurantName.toLowerCase()] = Date.now();
    // Keep only last 50 entries
    const entries = Object.entries(shown).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 50);
    localStorage.setItem(STF_SHOWN_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {}
}

// Fuzzy match restaurant name against our database
async function findDirectOrdering(restaurantName: string): Promise<DirectMatch | null> {
  // Try to determine metro from geolocation or default
  const metro = localStorage.getItem('stf_metro') || 'nyc';

  try {
    const res = await fetch(`${API_BASE}/api/restaurants?metro=${metro}&limit=1000`);
    const data = await res.json();

    const normalizedSearch = restaurantName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // Exact match first
    for (const r of data.restaurants) {
      if (!r.directUrl) continue;
      const normalizedName = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (normalizedName === normalizedSearch) {
        return {
          name: r.name,
          directUrl: r.directUrl,
          platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct',
          category: r.category,
        };
      }
    }

    // Partial match — restaurant name contains or is contained
    for (const r of data.restaurants) {
      if (!r.directUrl) continue;
      const normalizedName = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName)) {
        if (Math.min(normalizedName.length, normalizedSearch.length) >= 4) {
          return {
            name: r.name,
            directUrl: r.directUrl,
            platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct',
            category: r.category,
          };
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Read fees from the delivery app page
function extractFees(): { subtotal: number; serviceFee: number; deliveryFee: number; total: number } | null {
  const platform = detectPlatform();

  try {
    if (platform === 'doordash') {
      // Look for fee breakdown in cart/checkout
      const feeEls = document.querySelectorAll('[data-testid="SubtotalBreakdown"] span, [class*="FeeRow"] span, [class*="subtotal"] span');
      // This is fragile — DoorDash changes DOM constantly. Phase 2 work.
    }
  } catch {}

  return null; // Phase 2 — for now just show the direct link
}

// Create and show the overlay
function showOverlay(match: DirectMatch, deliveryPlatform: string) {
  // Don't show if already visible
  if (document.getElementById(STF_OVERLAY_ID)) return;

  const platformNames: Record<string, string> = {
    doordash: 'DoorDash',
    ubereats: 'Uber Eats',
    grubhub: 'Grubhub',
  };

  const overlay = document.createElement('div');
  overlay.id = STF_OVERLAY_ID;
  overlay.innerHTML = `
    <div style="
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 360px; background: #0f1729; border: 1px solid rgba(16,185,129,0.3);
      border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #e2e8f0; overflow: hidden;
      animation: stf-slide-in 0.3s ease-out;
    ">
      <!-- Header -->
      <div style="padding: 16px 20px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">💰</span>
          <span style="font-weight: 800; font-size: 14px; letter-spacing: -0.02em;">Eddy</span>
        </div>
        <button id="stf-close" style="background: none; border: none; color: #475569; cursor: pointer; font-size: 18px; padding: 0; line-height: 1;">✕</button>
      </div>

      <!-- Body -->
      <div style="padding: 16px 20px;">
        <div style="font-size: 15px; font-weight: 700; margin-bottom: 8px; line-height: 1.4;">
          🏪 <strong>${match.name}</strong> has direct ordering
        </div>
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px;">
          Skip ${platformNames[deliveryPlatform] || 'delivery app'} fees — order directly through <strong style="color: #10b981;">${match.platform}</strong>. Same food, typically lower cost.
        </div>

        <!-- CTA -->
        <a href="${match.directUrl}" target="_blank" rel="noopener" id="stf-order-btn" style="
          display: block; text-align: center; padding: 14px 20px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white; font-weight: 800; font-size: 15px;
          border-radius: 12px; text-decoration: none;
          transition: opacity 0.15s;
        ">
          Order Direct from ${match.platform} →
        </a>

        <div style="text-align: center; margin-top: 10px; font-size: 11px; color: #475569;">
          Free & private · <a href="https://eddy.delivery" target="_blank" style="color: #10b981; text-decoration: none;">eddy.delivery</a>
        </div>
      </div>
    </div>

    <style>
      @keyframes stf-slide-in {
        from { transform: translateY(20px) translateX(20px); opacity: 0; }
        to { transform: translateY(0) translateX(0); opacity: 1; }
      }
    </style>
  `;

  document.body.appendChild(overlay);

  // Close button
  document.getElementById('stf-close')?.addEventListener('click', () => {
    overlay.style.transition = 'opacity 0.2s, transform 0.2s';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(10px)';
    setTimeout(() => overlay.remove(), 200);
  });

  // Track click
  document.getElementById('stf-order-btn')?.addEventListener('click', () => {
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: match.name,
        slug: match.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        metro: localStorage.getItem('stf_metro') || 'unknown',
        source: 'extension_overlay',
        directUrl: match.directUrl,
        interceptedFrom: deliveryPlatform,
      }),
    }).catch(() => {});
  });

  // Auto-dismiss after 15 seconds
  setTimeout(() => {
    const el = document.getElementById(STF_OVERLAY_ID);
    if (el) {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    }
  }, 15000);
}

// Main detection loop
let lastDetectedName = '';

async function detectAndShow() {
  const platform = detectPlatform();
  if (!platform) return;

  const restaurantName = extractRestaurantName();
  if (!restaurantName || restaurantName === lastDetectedName) return;
  lastDetectedName = restaurantName;

  if (wasRecentlyShown(restaurantName)) return;

  const match = await findDirectOrdering(restaurantName);
  if (!match) return;

  markShown(restaurantName);
  showOverlay(match, platform);
}

// Watch for page navigation (SPAs don't reload)
let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    // Remove existing overlay on navigation
    document.getElementById(STF_OVERLAY_ID)?.remove();
    lastDetectedName = '';
    setTimeout(detectAndShow, 1500);
  }
});

urlObserver.observe(document.body, { childList: true, subtree: true });

// Initial detection
setTimeout(detectAndShow, 2000);

console.log('[Eddy] Overlay content script loaded');
