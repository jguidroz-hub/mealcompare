/**
 * Client-side analytics for Eddy
 * Lightweight, privacy-respecting, no cookies needed
 */

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  // Try sessionStorage first (survives page navigation, dies on tab close)
  if (typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('stf_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('stf_session', sessionId);
    }
  }
  return sessionId || 'unknown';
}

export function trackEvent(event: string, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    props,
    sessionId: getSessionId(),
    referrer: document.referrer || null,
    path: window.location.pathname,
  };

  // Use sendBeacon for reliability (fires even on page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/events', JSON.stringify(payload));
  } else {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackPageView(extra?: Record<string, any>) {
  trackEvent('page_view', { url: window.location.pathname, ...extra });
}

export function trackSearch(query: string, metro: string, resultCount: number) {
  trackEvent('search', { query, metro, resultCount });
}

export function trackMetroSelect(metro: string) {
  trackEvent('metro_select', { metro });
}

export function trackCategoryFilter(category: string, metro: string) {
  trackEvent('category_filter', { category, metro });
}

export function trackOrderClick(restaurant: string, metro: string, platform: string, directUrl: string) {
  trackEvent('order_click', { restaurant, metro, platform, directUrl });
}

export function trackExtensionInstall() {
  trackEvent('extension_install', {});
}

export function trackCalculatorUse(ordersPerWeek: number, avgOrder: number, yearlySavings: string) {
  trackEvent('calculator_use', { ordersPerWeek, avgOrder, yearlySavings });
}
