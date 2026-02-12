import { ComparisonResult, PlatformQuote, formatCents, Platform } from '@mealcompare/shared';

const content = document.getElementById('content')!;

const PLATFORM_NAMES: Record<Platform, string> = {
  doordash: 'DoorDash',
  ubereats: 'Uber Eats',
  grubhub: 'Grubhub',
  direct: 'Direct Order',
  pickup: 'Pickup',
};

const PLATFORM_ICONS: Record<Platform, string> = {
  doordash: '🔴',
  ubereats: '🟢',
  grubhub: '🟠',
  direct: '🏪',
  pickup: '🚗',
};

// Request state from background
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  if (chrome.runtime.lastError || !response) {
    renderEmpty();
    return;
  }

  if (response.isComparing) {
    renderLoading(response.cart?.restaurantName, response.cart?.items?.length);
    pollForResult();
    return;
  }

  if (response.result) {
    renderResult(response.result);
    return;
  }

  if (response.cart) {
    renderLoading(response.cart.restaurantName, response.cart.items.length);
    return;
  }

  renderEmpty();
});

// Listen for results while popup is open
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'COMPARE_RESULT') {
    renderResult(message.payload);
  }
});

function pollForResult(): void {
  const poll = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (r) => {
      if (chrome.runtime.lastError) { clearInterval(poll); return; }
      if (r && !r.isComparing && r.result) {
        clearInterval(poll);
        renderResult(r.result);
      }
    });
  }, 1000);
  // Stop polling after 30s
  setTimeout(() => clearInterval(poll), 30000);
}

function renderEmpty(): void {
  content.innerHTML = `
    <div class="empty">
      <h2>🍔 Browse a delivery app</h2>
      <p>Open DoorDash, Uber Eats, or Grubhub and add items to your cart. SkipTheFee will automatically compare prices.</p>
      <div style="margin-top: 16px;">
        <a href="https://www.doordash.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px; margin-right: 12px;">DoorDash →</a>
        <a href="https://www.ubereats.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px; margin-right: 12px;">Uber Eats →</a>
        <a href="https://www.grubhub.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Grubhub →</a>
      </div>
    </div>
  `;
}

function renderLoading(restaurant?: string, itemCount?: number): void {
  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${restaurant ? `Comparing prices for ${restaurant}` : 'Comparing prices'}${itemCount ? ` (${itemCount} items)` : ''}...</p>
    </div>
  `;
}

function renderResult(result: ComparisonResult): void {
  const available = result.quotes.filter(q => q.available);
  const unavailable = result.quotes.filter(q => !q.available);

  let html = '';

  // Restaurant header
  html += `<div class="restaurant">📍 ${result.restaurantName}</div>`;

  // Savings banner
  if (result.savings > 100) {
    html += `
      <div class="savings-banner">
        <div class="amount">${formatCents(result.savings)}</div>
        <div class="label">potential savings</div>
      </div>
    `;
  }

  // Quotes
  const sorted = [...available].sort((a, b) => a.fees.total - b.fees.total);
  for (let i = 0; i < sorted.length; i++) {
    const quote = sorted[i];
    const isBest = i === 0;
    html += renderQuote(quote, isBest, isBest ? 0 : quote.fees.total - sorted[0].fees.total);
  }

  // Unavailable platforms
  for (const quote of unavailable) {
    html += `
      <div class="quote unavailable-quote">
        <div>
          <span class="platform">
            ${PLATFORM_ICONS[quote.platform]} ${PLATFORM_NAMES[quote.platform]}
          </span>
          <div class="unavailable">${quote.unavailableReason ?? 'Not available'}</div>
        </div>
      </div>
    `;
  }

  // Confidence note
  const hasEstimates = available.some(q => q.confidence < 0.5);
  if (hasEstimates) {
    html += `<div style="font-size:10px;color:#475569;text-align:center;margin-top:8px;">✅ = verified prices · 📊 = estimated</div>`;
  }

  content.innerHTML = html;

  // Wire click handlers
  content.querySelectorAll('.quote[data-deeplink]').forEach(el => {
    el.addEventListener('click', () => {
      const url = (el as HTMLElement).dataset.deeplink;
      if (url) chrome.tabs.create({ url });
    });
  });
}

function renderQuote(quote: PlatformQuote, isBest: boolean, extraCost: number): string {
  const f = quote.fees;
  const confIcon = quote.confidence >= 0.5 ? '✅' : '📊';

  const feeDetails = [
    `Items: ${formatCents(f.subtotal)}`,
    f.serviceFee > 0 ? `Service: ${formatCents(f.serviceFee)}` : 'Service: $0',
    `Delivery: ${formatCents(f.deliveryFee)}`,
    f.platformMarkup > 0 ? `Markup: +${formatCents(f.platformMarkup)}` : null,
  ].filter(Boolean).join(' · ');

  const extraTag = !isBest && extraCost > 0
    ? `<span style="background:#ef4444;color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px;">+${formatCents(extraCost)}</span>`
    : '';

  const bestTag = isBest
    ? '<span class="best-tag">BEST PRICE</span>'
    : '';

  return `
    <div class="quote ${isBest ? 'best' : ''}" data-deeplink="${quote.deepLink || ''}">
      <div>
        <span class="platform">
          ${confIcon} ${PLATFORM_NAMES[quote.platform]}
          ${bestTag}${extraTag}
        </span>
        <div class="fee-details">${feeDetails}</div>
      </div>
      <div class="total">${formatCents(f.total)}</div>
    </div>
  `;
}
