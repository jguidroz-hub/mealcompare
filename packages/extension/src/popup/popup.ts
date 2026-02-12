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

  if (response.error) {
    renderError(response.error);
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
      if (r && r.error) {
        clearInterval(poll);
        renderError(r.error);
      }
    });
  }, 1000);
  setTimeout(() => clearInterval(poll), 30000);
}

function renderEmpty(): void {
  // Show savings stats if available
  chrome.storage.sync.get(['totalComparisons', 'totalSavingsCents'], (data) => {
    const comparisons = data.totalComparisons || 0;
    const savings = data.totalSavingsCents || 0;

    let statsHtml = '';
    if (comparisons > 0) {
      statsHtml = `
        <div style="background:#1e293b;border-radius:8px;padding:12px;margin-bottom:16px;text-align:center;">
          <div style="font-size:11px;color:#64748b;margin-bottom:4px;">Your total savings</div>
          <div style="font-size:22px;font-weight:800;color:#10b981;">${formatCents(savings)}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">${comparisons} comparison${comparisons === 1 ? '' : 's'} made</div>
        </div>
      `;
    }

    content.innerHTML = `
      ${statsHtml}
      <div class="empty">
        <h2>💰 Save $5–15 on every order</h2>
        <p>Browse DoorDash, Uber Eats, or Grubhub and add items to your cart. We'll find the cheapest way to order — including direct from the restaurant.</p>
        <div style="margin-top: 16px;">
          <a href="https://www.doordash.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px; margin-right: 12px;">DoorDash →</a>
          <a href="https://www.ubereats.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px; margin-right: 12px;">Uber Eats →</a>
          <a href="https://www.grubhub.com" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Grubhub →</a>
        </div>
      </div>
    `;
  });
}

function renderError(errorMsg: string): void {
  content.innerHTML = `
    <div class="error-state">
      <h2>⚠️ Comparison failed</h2>
      <p>${errorMsg || 'Could not reach SkipTheFee servers. Check your connection and try again.'}</p>
      <button class="retry-btn" id="retryBtn">Try Again</button>
    </div>
  `;
  document.getElementById('retryBtn')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'RETRY_COMPARE' });
    renderLoading();
    pollForResult();
  });
}

function renderLoading(restaurant?: string, itemCount?: number): void {
  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${restaurant ? `Comparing prices for <strong>${restaurant}</strong>` : 'Comparing prices'}${itemCount ? ` (${itemCount} item${itemCount === 1 ? '' : 's'})` : ''}...</p>
      <p style="font-size:11px;color:#64748b;margin-top:8px;">Checking delivery apps + direct ordering</p>
    </div>
  `;
}

function renderResult(result: ComparisonResult): void {
  const available = result.quotes.filter(q => q.available);
  const unavailable = result.quotes.filter(q => !q.available);
  const sorted = [...available].sort((a, b) => a.fees.total - b.fees.total);
  const hasDirect = sorted.some(q => q.platform === 'direct');

  let html = '';

  // Restaurant header
  html += `<div class="restaurant">📍 ${result.restaurantName}</div>`;

  // Savings banner
  if (result.savings > 100) {
    html += `
      <div class="savings-banner">
        <div class="amount">${formatCents(result.savings)}</div>
        <div class="label">potential savings on this order</div>
      </div>
    `;
  }

  // Direct ordering callout (if available and cheapest)
  if (hasDirect && sorted[0]?.platform === 'direct') {
    html += `
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:12px;color:white;">
        <strong>💰 Direct ordering is cheapest!</strong> Skip the delivery app fees entirely.
      </div>
    `;
  } else if (hasDirect) {
    html += `
      <div style="background:#1e293b;border:1px solid #3b82f6;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:12px;color:#93c5fd;">
        🏪 Direct ordering available — no platform markup
      </div>
    `;
  }

  // Quotes with full fee breakdown
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

  // Fee transparency section
  if (sorted.length > 1) {
    html += renderFeeBreakdown(sorted);
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
      let url = (el as HTMLElement).dataset.deeplink;
      if (!url) return;
      const platform = (el as HTMLElement).dataset.platform;

      // Add UTM params for direct ordering links
      if (platform === 'direct') {
        try {
          const u = new URL(url);
          u.searchParams.set('utm_source', 'skipthefee');
          u.searchParams.set('utm_medium', 'extension');
          u.searchParams.set('utm_campaign', 'direct_order');
          u.searchParams.set('ref', 'skipthefee');
          url = u.toString();
        } catch {}

        // Track the click
        fetch('https://skipthefee.vercel.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant: result.restaurantName,
            slug: result.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            metro: 'unknown',
            source: 'extension',
            directUrl: url,
          }),
        }).catch(() => {});
      }

      chrome.tabs.create({ url });
    });
  });

  // Wire fee detail toggles
  content.querySelectorAll('.fee-toggle').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById((el as HTMLElement).dataset.target!);
      if (target) {
        const isHidden = target.style.display === 'none';
        target.style.display = isHidden ? 'block' : 'none';
        (el as HTMLElement).textContent = isHidden ? '▾ Hide fee details' : '▸ Show fee details';
      }
    });
  });
}

function renderQuote(quote: PlatformQuote, isBest: boolean, extraCost: number): string {
  const f = quote.fees;
  const confIcon = quote.confidence >= 0.5 ? '✅' : '📊';

  // Delivery time
  const timeStr = quote.estimatedMinutes
    ? `${quote.estimatedMinutes} min`
    : '';

  const extraTag = !isBest && extraCost > 0
    ? `<span style="background:#ef4444;color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px;">+${formatCents(extraCost)}</span>`
    : '';

  const bestTag = isBest
    ? '<span class="best-tag">BEST PRICE</span>'
    : '';

  // Compact fee line
  const feeItems: string[] = [];
  if (f.platformMarkup > 0) feeItems.push(`Menu markup: +${formatCents(f.platformMarkup)}`);
  if (f.serviceFee > 0) feeItems.push(`Service: ${formatCents(f.serviceFee)}`);
  if (f.deliveryFee > 0) feeItems.push(`Delivery: ${formatCents(f.deliveryFee)}`);
  if (f.smallOrderFee > 0) feeItems.push(`Small order: ${formatCents(f.smallOrderFee)}`);
  if (f.discount < 0) feeItems.push(`Promo: ${formatCents(f.discount)}`);
  const feeSummary = feeItems.length > 0 ? feeItems.join(' · ') : 'No extra fees';

  const isDirect = quote.platform === 'direct';
  const directBadge = isDirect ? ' <span style="background:#2563eb;color:white;font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px;">NO MARKUP</span>' : '';

  return `
    <div class="quote ${isBest ? 'best' : ''}" data-deeplink="${quote.deepLink || ''}" data-platform="${quote.platform}" style="cursor:${quote.deepLink ? 'pointer' : 'default'}">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
          <span class="platform">
            ${confIcon} ${PLATFORM_NAMES[quote.platform]}${directBadge}
          </span>
          ${bestTag}${extraTag}
          ${timeStr ? `<span style="font-size:11px;color:#94a3b8;margin-left:auto;">🕐 ${timeStr}</span>` : ''}
        </div>
        <div class="fee-details">${feeSummary}</div>
      </div>
      <div class="total">${formatCents(f.total)}</div>
    </div>
  `;
}

function renderFeeBreakdown(sorted: PlatformQuote[]): string {
  const id = 'fee-breakdown-' + Date.now();

  // Build comparison table
  let rows = '';
  const labels = [
    { key: 'subtotal', label: 'Menu items' },
    { key: 'platformMarkup', label: 'Menu markup' },
    { key: 'serviceFee', label: 'Service fee' },
    { key: 'deliveryFee', label: 'Delivery fee' },
    { key: 'smallOrderFee', label: 'Small order fee' },
    { key: 'tax', label: 'Est. tax' },
    { key: 'discount', label: 'Promos/discounts' },
    { key: 'total', label: 'Total' },
  ];

  for (const { key, label } of labels) {
    const values = sorted.map(q => (q.fees as any)[key] as number);
    // Skip rows where all values are 0
    if (values.every(v => v === 0) && key !== 'total' && key !== 'subtotal') continue;

    const cells = values.map((v, i) => {
      const isTotal = key === 'total';
      const isBest = key === 'total' && i === 0;
      const color = key === 'discount' && v < 0 ? '#10b981' :
                    key === 'platformMarkup' && v > 0 ? '#f87171' :
                    isTotal && isBest ? '#10b981' :
                    isTotal ? '#e2e8f0' : '#94a3b8';
      const weight = isTotal ? '700' : '400';
      return `<td style="color:${color};font-weight:${weight};text-align:right;padding:3px 0 3px 12px;font-size:11px;">${formatCents(v)}</td>`;
    }).join('');

    const isTotal = key === 'total';
    rows += `<tr ${isTotal ? 'style="border-top:1px solid #334155;"' : ''}>
      <td style="color:#94a3b8;font-size:11px;padding:3px 0;${isTotal ? 'font-weight:600;color:#e2e8f0;' : ''}">${label}</td>
      ${cells}
    </tr>`;
  }

  const headers = sorted.map(q =>
    `<th style="text-align:right;font-size:10px;color:#64748b;font-weight:600;padding:0 0 6px 12px;">${PLATFORM_ICONS[q.platform]} ${q.platform === 'direct' ? 'Direct' : PLATFORM_NAMES[q.platform].split(' ')[0]}</th>`
  ).join('');

  return `
    <div style="margin-top:10px;">
      <div class="fee-toggle" data-target="${id}" style="font-size:11px;color:#3b82f6;cursor:pointer;padding:4px 0;">▸ Show fee details</div>
      <div id="${id}" style="display:none;background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:10px;margin-top:6px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th></th>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}
