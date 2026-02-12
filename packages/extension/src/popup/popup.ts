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
  if (!response) return;

  if (response.isComparing) {
    content.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Comparing prices across platforms...</p>
      </div>
    `;
    // Poll for result
    const poll = setInterval(() => {
      chrome.runtime.sendMessage({ type: 'GET_STATE' }, (r) => {
        if (r && !r.isComparing && r.result) {
          clearInterval(poll);
          renderResult(r.result);
        }
      });
    }, 1000);
    return;
  }

  if (response.result) {
    renderResult(response.result);
    return;
  }

  if (response.cart) {
    content.innerHTML = `
      <div class="restaurant">${response.cart.restaurantName}</div>
      <div class="loading">
        <div class="spinner"></div>
        <p>Cart detected! Comparing ${response.cart.items.length} items...</p>
      </div>
    `;
  }
});

function renderResult(result: ComparisonResult): void {
  const quotes = result.quotes.filter(q => q.available);
  const unavailable = result.quotes.filter(q => !q.available);

  let html = `<div class="restaurant">📍 ${result.restaurantName}</div>`;

  if (result.savings > 0) {
    html += `
      <div class="savings-banner">
        <div class="amount">${formatCents(result.savings)}</div>
        <div class="label">potential savings found</div>
      </div>
    `;
  }

  for (const quote of quotes) {
    const isBest = quote === result.bestDeal;
    html += renderQuote(quote, isBest);
  }

  for (const quote of unavailable) {
    html += `
      <div class="quote">
        <div>
          <span class="platform">
            <span class="platform-icon">${PLATFORM_ICONS[quote.platform]}</span>
            ${PLATFORM_NAMES[quote.platform]}
          </span>
          <div class="unavailable">${quote.unavailableReason ?? 'Not available'}</div>
        </div>
      </div>
    `;
  }

  content.innerHTML = html;

  // Wire up click handlers for deep links
  content.querySelectorAll('.quote[data-deeplink]').forEach(el => {
    el.addEventListener('click', () => {
      const url = (el as HTMLElement).dataset.deeplink;
      if (url) chrome.tabs.create({ url });
    });
  });
}

function renderQuote(quote: PlatformQuote, isBest: boolean): string {
  const fees = quote.fees;
  const details = [
    `Items: ${formatCents(fees.subtotal)}`,
    fees.serviceFee ? `Service: ${formatCents(fees.serviceFee)}` : '',
    fees.deliveryFee ? `Delivery: ${formatCents(fees.deliveryFee)}` : '',
    fees.platformMarkup ? `Markup: ${formatCents(fees.platformMarkup)}` : '',
    fees.discount ? `Discount: ${formatCents(fees.discount)}` : '',
  ].filter(Boolean).join(' · ');

  const time = quote.estimatedMinutes
    ? `<span style="color:#94a3b8;font-size:12px">${quote.estimatedMinutes} min</span>`
    : '';

  return `
    <div class="quote ${isBest ? 'best' : ''}" data-deeplink="${quote.deepLink}">
      <div>
        <span class="platform">
          <span class="platform-icon">${PLATFORM_ICONS[quote.platform]}</span>
          ${PLATFORM_NAMES[quote.platform]}
          ${isBest ? '<span class="best-tag">BEST PRICE</span>' : ''}
        </span>
        <div class="fee-details">${details}</div>
      </div>
      <div>
        <div class="total">${formatCents(fees.total)}</div>
        ${time}
      </div>
    </div>
  `;
}
