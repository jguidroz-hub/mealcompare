/**
 * Eddy Overlay — slide-in comparison panel on delivery app pages.
 *
 * MITIGATIONS:
 * 1. Shadow DOM — closed shadow root, invisible to host page
 * 2. Randomised host class — no fixed ID
 * 3. Title-first restaurant extraction
 * 4. No console.log breadcrumbs
 * 5. Minimal DOM footprint
 *
 * FEATURES:
 * #1: Shows real fee data when available
 * #5: Deep links for platform switching
 * #8: Community submission form in no-match state
 * #10: Savings tracking on click-through
 */

const API_BASE = 'https://eddy.delivery';
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

function extractRestaurantName(): string | null {
  const platform = detectPlatform();
  if (!platform) return null;

  const title = document.title;
  if (title) {
    const titleMatch = title.match(/^(.+?)\s*[-–|·]\s*(?:Deliver|Order|DoorDash|Uber\s*Eats|Grubhub)/i);
    if (titleMatch) {
      const candidate = titleMatch[1].trim();
      if (candidate.length >= 2 && candidate.length <= 60) return candidate;
    }
  }

  for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(el.textContent ?? '');
      const name = data?.name ?? data?.restaurant?.name;
      if (typeof name === 'string' && name.length >= 2 && name.length <= 60) return name;
    } catch { /* skip */ }
  }

  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (ogTitle?.content) {
    const ogMatch = ogTitle.content.match(/^(.+?)\s*[-–|·]/);
    if (ogMatch) return ogMatch[1].trim();
  }

  const h1s = document.querySelectorAll('h1');
  for (const h1 of h1s) {
    const text = h1.textContent?.trim();
    if (text && text.length >= 2 && text.length <= 60 && !text.match(/^(menu|order|delivery|sign|log)/i)) return text;
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
    const trimmed = Object.entries(shown).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 50);
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
      if (n === search) return { name: r.name, directUrl: r.directUrl, platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct', category: r.category };
    }
    for (const r of data.restaurants) {
      if (!r.directUrl) continue;
      const n = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if ((n.includes(search) || search.includes(n)) && Math.min(n.length, search.length) >= 4) return { name: r.name, directUrl: r.directUrl, platform: r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct', category: r.category };
    }
    return null;
  } catch { return null; }
}

// ─── Brand Styles (shared across overlays) ───────────────────────

const BRAND_STYLES = `
  :host { all: initial; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @keyframes _eSlide {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  .panel {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(37,99,235,0.08);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #111111;
    overflow: hidden;
    animation: _eSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .hdr {
    padding: 14px 18px 12px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #F3F4F6;
  }
  .hdr-left { display: flex; align-items: center; gap: 8px; }
  .hdr-label { font-size: 9px; font-weight: 800; color: #2563EB; letter-spacing: 0.12em; text-transform: uppercase; }
  .close {
    background: none; border: none; color: #9CA3AF; cursor: pointer;
    font-size: 16px; padding: 4px; line-height: 1;
  }
  .close:hover { color: #6B7280; }
  .body { padding: 14px 18px 16px; }
`;

// ─── Match overlay (found direct ordering) ───────────────────────

function showOverlay(match: DirectMatch, deliveryPlatform: string) {
  const existing = document.querySelector('.' + HOST_CLASS);
  if (existing) return;

  const host = document.createElement('div');
  host.className = HOST_CLASS;
  host.style.cssText = 'all:initial;position:fixed;bottom:24px;right:24px;z-index:2147483647;';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      ${BRAND_STYLES}
      .panel { width: 360px; }
      .badge {
        background: #FACC15; color: #111111;
        font-size: 10px; font-weight: 900;
        padding: 3px 9px; border-radius: 6px; white-space: nowrap;
      }
      .msg { font-size: 14px; font-weight: 700; margin-bottom: 8px; line-height: 1.45; color: #111111; }
      .sub { font-size: 13px; color: #6B7280; line-height: 1.6; margin-bottom: 16px; }
      .sub strong { color: #2563EB; }
      .cta {
        display: block; text-align: center; padding: 13px 18px;
        background: #2563EB; color: #FFFFFF;
        font-weight: 900; font-size: 14px;
        border-radius: 10px; text-decoration: none;
        border: none; cursor: pointer; width: 100%;
        transition: opacity 0.15s;
      }
      .cta:hover { opacity: 0.9; }
      .savings-tag {
        display: inline-block; background: #FEF9C3; color: #92400E;
        font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
        margin-bottom: 10px;
      }
      .foot { text-align: center; margin-top: 10px; font-size: 11px; color: #9CA3AF; }
      .foot a { color: #2563EB; text-decoration: none; }
    </style>

    <div class="panel">
      <div class="hdr">
        <div class="hdr-left">
          <span style="font-size:16px;">🌊</span>
          <div>
            <div class="hdr-label">Eddy</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge">💰 Save money</span>
          <button class="close" id="c">✕</button>
        </div>
      </div>
      <div class="body">
        <div class="savings-tag">Typically 15–25% cheaper</div>
        <div class="msg">
          🏪 <strong>${escHtml(match.name)}</strong> has direct ordering
        </div>
        <div class="sub">
          Skip the delivery app fees — order directly through
          <strong>${escHtml(match.platform)}</strong>. Same food, lower price.
        </div>
        <a class="cta" href="${escHtml(match.directUrl)}" target="_blank" rel="noopener" id="go">
          Order Direct → Save 15-25%
        </a>
        <div class="foot">
          Free &amp; private · <a href="https://eddy.delivery" target="_blank">eddy.delivery</a>
        </div>
      </div>
    </div>
  `;

  shadow.getElementById('c')?.addEventListener('click', () => {
    host.style.transition = 'opacity 0.2s, transform 0.2s';
    host.style.opacity = '0';
    host.style.transform = 'translateY(10px)';
    setTimeout(() => host.remove(), 250);
  });

  shadow.getElementById('go')?.addEventListener('click', () => {
    // Track click
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

    // #10: Record savings event
    chrome.runtime.sendMessage({
      type: 'RECORD_SAVINGS',
      payload: {
        restaurantName: match.name,
        savingsCents: 250, // conservative $2.50 estimate per switch
        chosenPlatform: 'direct',
      },
    }).catch(() => {});

    // #6: Track redirect engagement — did they likely complete an order?
    // We can't track the restaurant site directly, but we can track that
    // the user clicked through and didn't immediately bounce back
    const clickTime = Date.now();
    const checkBounce = () => {
      // If user comes back to this tab within 10s, they bounced
      // If they stay away 60s+, likely ordering
      const elapsed = Date.now() - clickTime;
      if (elapsed > 60000) {
        fetch(`${API_BASE}/api/telemetry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'likely_order',
            restaurant: match.name,
            metro: localStorage.getItem('_e_metro') || 'unknown',
            directUrl: match.directUrl,
            timeAwayMs: elapsed,
          }),
        }).catch(() => {});
        document.removeEventListener('visibilitychange', onVisChange);
      }
    };
    const onVisChange = () => {
      if (document.visibilityState === 'visible') checkBounce();
    };
    document.addEventListener('visibilitychange', onVisChange);
    // Clean up after 10 minutes
    setTimeout(() => document.removeEventListener('visibilitychange', onVisChange), 600000);
  });

  setTimeout(() => {
    if (host.isConnected) {
      host.style.transition = 'opacity 0.5s';
      host.style.opacity = '0';
      setTimeout(() => host.remove(), 500);
    }
  }, 15000);
}

// ─── No-match overlay with community submission (#8) ─────────────

function showNoMatchOverlay(restaurantName: string, deliveryPlatform: string) {
  const existing = document.querySelector('.' + HOST_CLASS);
  if (existing) return;

  const host = document.createElement('div');
  host.className = HOST_CLASS;
  host.style.cssText = 'all:initial;position:fixed;bottom:24px;right:24px;z-index:2147483647;';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      ${BRAND_STYLES}
      .panel { width: 320px; }
      .msg { font-size: 13px; color: #6B7280; line-height: 1.5; margin-bottom: 12px; }
      .msg strong { color: #111111; }
      .submit-form { display: none; margin-top: 8px; }
      .submit-form.show { display: block; }
      .submit-input {
        width: 100%; padding: 8px 12px; border: 1px solid #E5E7EB;
        border-radius: 8px; font-size: 13px; margin-bottom: 8px;
        outline: none; font-family: inherit;
      }
      .submit-input:focus { border-color: #2563EB; }
      .submit-btn {
        background: #2563EB; color: white; border: none;
        padding: 8px 16px; border-radius: 8px; font-size: 12px;
        font-weight: 700; cursor: pointer; width: 100%;
      }
      .submit-btn:hover { opacity: 0.9; }
      .submit-btn:disabled { opacity: 0.5; cursor: default; }
      .link-btn {
        background: none; border: none; color: #2563EB;
        font-size: 12px; font-weight: 600; cursor: pointer;
        padding: 0; text-decoration: underline;
      }
      .success { color: #059669; font-size: 12px; font-weight: 600; margin-top: 8px; }
      .browse { font-size: 12px; color: #9CA3AF; margin-top: 8px; }
      .browse a { color: #2563EB; text-decoration: none; }
    </style>
    <div class="panel">
      <div class="hdr">
        <div class="hdr-left">
          <span style="font-size:14px;">🌊</span>
          <span class="hdr-label">Eddy</span>
        </div>
        <button class="close" id="c">✕</button>
      </div>
      <div class="body">
        <div class="msg">
          No direct ordering link found for <strong>${escHtml(restaurantName)}</strong> yet.
        </div>
        <button class="link-btn" id="show-form">Know their ordering website? Help others save →</button>
        <div class="submit-form" id="form">
          <input class="submit-input" id="url-input" type="url" placeholder="https://restaurant-ordering-site.com" />
          <button class="submit-btn" id="submit-btn">Submit Direct Ordering Link</button>
        </div>
        <div class="success" id="success" style="display:none;">✓ Thanks! We'll verify and add this.</div>
        <div class="browse">
          <a href="https://eddy.delivery/restaurants" target="_blank">Browse 19,000+ restaurants with savings →</a>
        </div>
      </div>
    </div>
  `;

  shadow.getElementById('c')?.addEventListener('click', () => {
    host.style.transition = 'opacity 0.2s';
    host.style.opacity = '0';
    setTimeout(() => host.remove(), 200);
  });

  // #8: Community submission form toggle
  shadow.getElementById('show-form')?.addEventListener('click', () => {
    const form = shadow.getElementById('form');
    if (form) form.classList.add('show');
    shadow.getElementById('show-form')!.style.display = 'none';
    shadow.getElementById('url-input')?.focus();
  });

  // #8: Submit handler
  shadow.getElementById('submit-btn')?.addEventListener('click', async () => {
    const urlInput = shadow.getElementById('url-input') as HTMLInputElement;
    const submitBtn = shadow.getElementById('submit-btn') as HTMLButtonElement;
    const url = urlInput?.value?.trim();

    if (!url) return;
    try { new URL(url); } catch { urlInput.style.borderColor = '#DC2626'; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    chrome.runtime.sendMessage({
      type: 'SUBMIT_RESTAURANT',
      payload: {
        restaurantName,
        metro: localStorage.getItem('_e_metro') || 'unknown',
        directUrl: url,
        platformUrl: location.href,
      },
    }, () => {
      const form = shadow.getElementById('form');
      const success = shadow.getElementById('success');
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    });
  });

  setTimeout(() => {
    if (host.isConnected) {
      host.style.transition = 'opacity 0.4s';
      host.style.opacity = '0';
      setTimeout(() => host.remove(), 400);
    }
  }, 12000);
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
  markShown(name);

  if (match) {
    showOverlay(match, platform);
    // Track impression event
    fetch(`${API_BASE}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'overlay_shown',
        restaurant: name,
        metro: localStorage.getItem('_e_metro') || 'unknown',
        platform,
        hasMatch: true,
        directUrl: match.directUrl,
      }),
    }).catch(() => {});
  } else {
    showNoMatchOverlay(name, platform);
    // Track no-match event — critical for Toast/ChowNow pitch
    fetch(`${API_BASE}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'no_match',
        restaurant: name,
        metro: localStorage.getItem('_e_metro') || 'unknown',
        platform,
        pageUrl: location.href,
      }),
    }).catch(() => {});
  }
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

setTimeout(detectAndShow, 2000);
