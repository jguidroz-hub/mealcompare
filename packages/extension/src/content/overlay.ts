/**
 * Eddy Overlay — slide-in comparison panel on delivery app pages.
 *
 * MITIGATIONS applied:
 * 1. Shadow DOM — overlay lives in a closed shadow root so host pages
 *    cannot detect, style-target, or querySelector into it.
 * 2. Randomised host element — no fixed ID; random class name each run.
 * 3. Title-first restaurant extraction — page <title> is more stable
 *    than data-testid selectors that get obfuscated.
 * 4. No console.log breadcrumbs — all logging silenced in production.
 * 5. Minimal DOM footprint — single host element, shadow root, cleanup
 *    on close.
 */

const API_BASE = 'https://eddy.delivery';

// Random ID per session — never the same string twice
const HOST_CLASS = '_e' + Math.random().toString(36).slice(2, 10);
const SHOWN_KEY = '_e_shown';

interface DirectMatch {
  name: string;
  directUrl: string;
  platform: string;
  category: string;
}

// ─── Platform detection ──────────────────────────────────────────

function detectPlatform(): 'doordash' | 'ubereats' | 'grubhub' | null {
  const h = location.hostname;
  if (h.includes('doordash')) return 'doordash';
  if (h.includes('ubereats')) return 'ubereats';
  if (h.includes('grubhub')) return 'grubhub';
  return null;
}

// ─── Restaurant name extraction (resilient) ──────────────────────
// Priority: page title → structured data → DOM heuristic → h1 fallback

function extractRestaurantName(): string | null {
  const platform = detectPlatform();
  if (!platform) return null;

  // 1. Page title — most stable, rarely obfuscated
  const title = document.title;
  if (title) {
    // Common patterns:
    //   "Chipotle - DoorDash"
    //   "Chipotle Mexican Grill | Delivery | Uber Eats"
    //   "Chipotle - Delivery | Grubhub"
    const titleMatch = title.match(
      /^(.+?)\s*[-–|·]\s*(?:Deliver|Order|DoorDash|Uber\s*Eats|Grubhub)/i
    );
    if (titleMatch) {
      const candidate = titleMatch[1].trim();
      // Sanity: real restaurant names are 2–60 chars
      if (candidate.length >= 2 && candidate.length <= 60) return candidate;
    }
  }

  // 2. JSON-LD structured data (if present)
  for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(el.textContent ?? '');
      const name = data?.name ?? data?.restaurant?.name;
      if (typeof name === 'string' && name.length >= 2 && name.length <= 60) return name;
    } catch { /* skip */ }
  }

  // 3. Open Graph meta
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (ogTitle?.content) {
    const ogMatch = ogTitle.content.match(/^(.+?)\s*[-–|·]/);
    if (ogMatch) return ogMatch[1].trim();
  }

  // 4. DOM heuristic — look for the first h1 that isn't a generic phrase
  const h1s = document.querySelectorAll('h1');
  for (const h1 of h1s) {
    const text = h1.textContent?.trim();
    if (text && text.length >= 2 && text.length <= 60 && !text.match(/^(menu|order|delivery|sign|log)/i)) {
      return text;
    }
  }

  return null;
}

// ─── Recently-shown check ────────────────────────────────────────

function wasRecentlyShown(name: string): boolean {
  try {
    const shown = JSON.parse(localStorage.getItem(SHOWN_KEY) || '{}');
    const ts = shown[name.toLowerCase()];
    return ts ? Date.now() - ts < 24 * 60 * 60 * 1000 : false;
  } catch { return false; }
}

function markShown(name: string) {
  try {
    const shown = JSON.parse(localStorage.getItem(SHOWN_KEY) || '{}');
    shown[name.toLowerCase()] = Date.now();
    const trimmed = Object.entries(shown)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 50);
    localStorage.setItem(SHOWN_KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch { /* non-critical */ }
}

// ─── Database lookup ─────────────────────────────────────────────

async function findDirectOrdering(restaurantName: string): Promise<DirectMatch | null> {
  const metro = localStorage.getItem('_e_metro') || 'nyc';

  try {
    const res = await fetch(`${API_BASE}/api/restaurants?metro=${metro}&limit=1000`);
    const data = await res.json();
    const search = restaurantName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    for (const r of data.restaurants) {
      if (!r.directUrl) continue;
      const n = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (n === search) {
        return { name: r.name, directUrl: r.directUrl, platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct', category: r.category };
      }
    }
    for (const r of data.restaurants) {
      if (!r.directUrl) continue;
      const n = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if ((n.includes(search) || search.includes(n)) && Math.min(n.length, search.length) >= 4) {
        return { name: r.name, directUrl: r.directUrl, platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct', category: r.category };
      }
    }
    return null;
  } catch { return null; }
}

// ─── Shadow DOM overlay ──────────────────────────────────────────
// Closed shadow root: host page cannot access internals.

function showOverlay(match: DirectMatch, deliveryPlatform: string) {
  // Only one overlay at a time
  const existing = document.querySelector('.' + HOST_CLASS);
  if (existing) return;

  const platformLabels: Record<string, string> = {
    doordash: 'delivery app',
    ubereats: 'delivery app',
    grubhub: 'delivery app',
  };

  // Create host element with random class (no ID)
  const host = document.createElement('div');
  host.className = HOST_CLASS;
  host.style.cssText = 'all:initial;position:fixed;bottom:24px;right:24px;z-index:2147483647;';
  document.documentElement.appendChild(host);

  // Closed shadow root — invisible to querySelectorAll from the page
  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      @keyframes _eSlide {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)   scale(1);    }
      }
      .panel {
        width: 360px;
        background: #0B0B0B;
        border: 1px solid #252525;
        border-radius: 16px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.12);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #e2e8f0;
        overflow: hidden;
        animation: _eSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .hdr {
        padding: 14px 18px 12px;
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px solid #1E1E1E;
      }
      .hdr-left { display: flex; align-items: center; gap: 8px; }
      .hdr-label { font-size: 9px; font-weight: 800; color: #22D3EE; letter-spacing: 0.12em; text-transform: uppercase; }
      .hdr-sub { font-size: 10px; color: #9B9B9B; margin-top: 1px; }
      .badge {
        background: #F4A300; color: #0B0B0B;
        font-size: 10px; font-weight: 900;
        padding: 3px 9px; border-radius: 6px; white-space: nowrap;
      }
      .close {
        background: none; border: none; color: #555; cursor: pointer;
        font-size: 16px; padding: 4px; line-height: 1;
      }
      .close:hover { color: #999; }
      .body { padding: 14px 18px 16px; }
      .msg {
        font-size: 14px; font-weight: 700; margin-bottom: 8px; line-height: 1.45;
      }
      .sub {
        font-size: 13px; color: #9B9B9B; line-height: 1.6; margin-bottom: 16px;
      }
      .sub strong { color: #22D3EE; }
      .cta {
        display: block; text-align: center; padding: 13px 18px;
        background: #F4A300; color: #0B0B0B;
        font-weight: 900; font-size: 14px;
        border-radius: 10px; text-decoration: none;
        border: none; cursor: pointer; width: 100%;
        transition: opacity 0.15s;
      }
      .cta:hover { opacity: 0.9; }
      .foot {
        text-align: center; margin-top: 10px;
        font-size: 11px; color: #555;
      }
      .foot a { color: #22D3EE; text-decoration: none; }
    </style>

    <div class="panel">
      <div class="hdr">
        <div class="hdr-left">
          <span style="font-size:16px;">🌊</span>
          <div>
            <div class="hdr-label">Eddy</div>
            <div class="hdr-sub">Found a cheaper path</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge">Save money</span>
          <button class="close" id="c">✕</button>
        </div>
      </div>
      <div class="body">
        <div class="msg">
          🏪 <strong>${escHtml(match.name)}</strong> has direct ordering
        </div>
        <div class="sub">
          Skip ${platformLabels[deliveryPlatform] || 'delivery app'} fees — order directly through
          <strong>${escHtml(match.platform)}</strong>. Same food, typically 15–25% less.
        </div>
        <a class="cta" href="${escHtml(match.directUrl)}" target="_blank" rel="noopener" id="go">
          Order Direct from ${escHtml(match.platform)} →
        </a>
        <div class="foot">
          Free &amp; private · <a href="https://eddy.delivery" target="_blank">eddy.delivery</a>
        </div>
      </div>
    </div>
  `;

  // Close button
  shadow.getElementById('c')?.addEventListener('click', () => {
    host.style.transition = 'opacity 0.2s, transform 0.2s';
    host.style.opacity = '0';
    host.style.transform = 'translateY(10px)';
    setTimeout(() => host.remove(), 250);
  });

  // Track click (fire-and-forget, no identifiers)
  shadow.getElementById('go')?.addEventListener('click', () => {
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: match.name,
        slug: match.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        metro: localStorage.getItem('_e_metro') || 'unknown',
        source: 'extension_overlay',
        directUrl: match.directUrl,
        interceptedFrom: deliveryPlatform,
      }),
    }).catch(() => {});
  });

  // Auto-dismiss after 15s
  setTimeout(() => {
    if (host.isConnected) {
      host.style.transition = 'opacity 0.5s';
      host.style.opacity = '0';
      setTimeout(() => host.remove(), 500);
    }
  }, 15000);
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Detection loop ──────────────────────────────────────────────

let lastDetected = '';

async function detectAndShow() {
  const platform = detectPlatform();
  if (!platform) return;

  const name = extractRestaurantName();
  if (!name || name === lastDetected) return;
  lastDetected = name;

  if (wasRecentlyShown(name)) return;

  const match = await findDirectOrdering(name);
  if (!match) return;

  markShown(name);
  showOverlay(match, platform);
}

// SPA navigation watcher
let lastUrl = location.href;
const obs = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    document.querySelector('.' + HOST_CLASS)?.remove();
    lastDetected = '';
    setTimeout(detectAndShow, 1500);
  }
});
obs.observe(document.body, { childList: true, subtree: true });

// Initial detection
setTimeout(detectAndShow, 2000);
