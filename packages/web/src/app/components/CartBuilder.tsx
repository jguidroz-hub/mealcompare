'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────

interface CartItem {
  name: string;
  category: string;
  basePrice: number; // cents (in-store)
  quantity: number;
}

interface FeeBreakdown {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  smallOrderFee: number;
  tax: number;
  total: number;
  markupAmount: number;
}

interface PlatformQuote {
  platform: string;
  label: string;
  emoji: string;
  color: string;
  fees: FeeBreakdown;
  isSubscriber: boolean;
}

interface ChainMenuItem {
  name: string;
  category: string;
  basePrice: number;
}

// ─── Fee Models ────────────────────────────────────────────────

const PLATFORM_FEES = {
  ubereats: { markup: 0.18, serviceFee: 0.15, serviceMax: 999, deliveryFee: 499, smallOrderThreshold: 1500, smallOrderFee: 200, subDelivery: 0, subService: 0 },
  doordash: { markup: 0.15, serviceFee: 0.15, serviceMax: 899, deliveryFee: 399, smallOrderThreshold: 1200, smallOrderFee: 250, subDelivery: 0, subService: 0 },
  grubhub: { markup: 0.12, serviceFee: 0.12, serviceMax: 799, deliveryFee: 399, smallOrderThreshold: 1000, smallOrderFee: 250, subDelivery: 0, subService: 0 },
  direct: { markup: 0, serviceFee: 0, serviceMax: 0, deliveryFee: 499, smallOrderThreshold: 0, smallOrderFee: 0, subDelivery: 499, subService: 0 },
  pickup: { markup: 0, serviceFee: 0, serviceMax: 0, deliveryFee: 0, smallOrderThreshold: 0, smallOrderFee: 0, subDelivery: 0, subService: 0 },
};

const METRO_TAX: Record<string, number> = {
  austin: 0.0825, nyc: 0.08875, chicago: 0.1075, la: 0.095, houston: 0.0825,
  dallas: 0.0825, atlanta: 0.089, miami: 0.07, dc: 0.10, denver: 0.0881,
  seattle: 0.1025, boston: 0.0625, phoenix: 0.086, sf: 0.0875,
};

function calculateFees(baseSubtotal: number, platform: keyof typeof PLATFORM_FEES, metro: string, isSubscriber: boolean): FeeBreakdown {
  const model = PLATFORM_FEES[platform];
  const taxRate = METRO_TAX[metro] ?? 0.08;

  const markupAmount = Math.round(baseSubtotal * model.markup);
  const subtotal = baseSubtotal + markupAmount;

  const serviceFee = isSubscriber ? model.subService : Math.min(Math.round(subtotal * model.serviceFee), model.serviceMax);
  const deliveryFee = isSubscriber ? model.subDelivery : model.deliveryFee;
  const smallOrderFee = subtotal < model.smallOrderThreshold ? model.smallOrderFee : 0;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + serviceFee + deliveryFee + smallOrderFee + tax;

  return { subtotal, serviceFee, deliveryFee, smallOrderFee, tax, total, markupAmount };
}

// ─── Formatting ────────────────────────────────────────────────

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  entree: '🍽️', side: '🍟', drink: '🥤', dessert: '🍦', combo: '🎁',
};

const PLATFORMS: Array<{ key: keyof typeof PLATFORM_FEES; label: string; emoji: string; color: string }> = [
  { key: 'pickup', label: 'Pickup', emoji: '🚶', color: '#22c55e' },
  { key: 'direct', label: 'Direct', emoji: '🏪', color: '#10b981' },
  { key: 'doordash', label: 'DoorDash', emoji: '🔴', color: '#FF3008' },
  { key: 'ubereats', label: 'Uber Eats', emoji: '🟢', color: '#06C167' },
  { key: 'grubhub', label: 'Grubhub', emoji: '🟠', color: '#F63440' },
];

// ─── Component ─────────────────────────────────────────────────

function getOrderLink(chainName: string, platform: string): string {
  const q = encodeURIComponent(chainName);
  const DIRECT_URLS: Record<string, string> = {
    "mcdonald's": 'https://www.mcdonalds.com/us/en-us/mobile-order-and-pay.html',
    'chipotle': 'https://www.chipotle.com/order',
    "chick-fil-a": 'https://www.chick-fil-a.com/order',
    'subway': 'https://order.subway.com/',
    'taco bell': 'https://www.tacobell.com/food',
    "wendy's": 'https://order.wendys.com/',
    'burger king': 'https://www.bk.com/menu',
    'popeyes': 'https://www.popeyes.com/order',
    "domino's": 'https://www.dominos.com/en/',
    'pizza hut': 'https://www.pizzahut.com/menu',
    'panda express': 'https://www.pandaexpress.com/order',
    'wingstop': 'https://www.wingstop.com/order',
    'panera bread': 'https://delivery.panera.com/',
    'five guys': 'https://order.fiveguys.com/',
    'starbucks': 'https://app.starbucks.com/',
    "raising cane's": 'https://www.raisingcanes.com/order',
    'whataburger': 'https://whataburger.com/order',
    'shake shack': 'https://order.shakeshack.com/',
    "jersey mike's": 'https://www.jerseymikes.com/menu',
    'sweetgreen': 'https://order.sweetgreen.com/',
    "jimmy john's": 'https://www.jimmyjohns.com/order/',
    "torchy's tacos": 'https://www.torchystacos.com/order',
  };
  const lower = chainName.toLowerCase();
  switch (platform) {
    case 'doordash': return `https://www.doordash.com/search/store/${q}/`;
    case 'ubereats': return `https://www.ubereats.com/search?q=${q}`;
    case 'grubhub': return `https://www.grubhub.com/search?orderMethod=delivery&query=${q}`;
    case 'direct': return DIRECT_URLS[lower] ?? `https://www.google.com/search?q=${q}+order+online+direct`;
    case 'pickup': return `https://www.google.com/maps/search/${q}`;
    default: return '#';
  }
}

// Chrome extension API type declaration
declare const chrome: any;

// Extension ID — set after publishing to Chrome Web Store
// For now, users can set via localStorage for dev/testing
const EXTENSION_ID = typeof window !== 'undefined'
  ? localStorage.getItem('stf_extension_id') || ''
  : '';

function detectExtension(): Promise<boolean> {
  if (!EXTENSION_ID) return Promise.resolve(false);
  return new Promise(resolve => {
    try {
      chrome.runtime.sendMessage(EXTENSION_ID, { type: 'PING' }, (response: any) => {
        resolve(!!response?.ok);
      });
    } catch {
      resolve(false);
    }
  });
}

function sendAutofillToExtension(platform: string, chainName: string, items: CartItem[], url: string): void {
  if (!EXTENSION_ID) {
    // Fallback: open the URL directly
    window.open(url, '_blank');
    return;
  }
  try {
    chrome.runtime.sendMessage(EXTENSION_ID, {
      type: 'AUTOFILL_ORDER',
      payload: {
        platform,
        chainName,
        items: items.map(i => ({ name: i.name, quantity: i.quantity })),
        url,
      },
    }, (response: any) => {
      if (!response?.success) {
        // Fallback: just open the URL
        window.open(url, '_blank');
      }
    });
  } catch {
    window.open(url, '_blank');
  }
}

export default function CartBuilder({
  chainName,
  menuItems,
  metro,
}: {
  chainName: string;
  menuItems: ChainMenuItem[];
  metro: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});
  const [tipPercent, setTipPercent] = useState(20);
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    detectExtension().then(setHasExtension);
  }, []);

  const addItem = useCallback((item: ChainMenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name);
      if (existing) {
        return prev.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.name === name ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.name !== name);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const baseSubtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0),
    [cart]
  );

  const quotes = useMemo<PlatformQuote[]>(() => {
    if (baseSubtotal === 0) return [];
    return PLATFORMS.map(p => {
      const isSub = subscriptions[p.key] ?? false;
      const fees = calculateFees(baseSubtotal, p.key, metro, isSub);
      const tip = Math.round(fees.subtotal * tipPercent / 100);
      return {
        platform: p.key,
        label: p.label,
        emoji: p.emoji,
        color: p.color,
        fees: { ...fees, total: fees.total + tip },
        isSubscriber: isSub,
      };
    }).sort((a, b) => a.fees.total - b.fees.total);
  }, [baseSubtotal, metro, subscriptions, tipPercent]);

  const bestQuote = quotes[0];
  const worstQuote = quotes[quotes.length - 1];
  const savings = worstQuote && bestQuote ? worstQuote.fees.total - bestQuote.fees.total : 0;

  // Group menu items by category
  const menuByCategory = useMemo(() => {
    const grouped: Record<string, ChainMenuItem[]> = {};
    for (const item of menuItems) {
      if (item.basePrice === 0) continue;
      const cat = item.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
    return grouped;
  }, [menuItems]);

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const tip = baseSubtotal > 0 ? Math.round((baseSubtotal + Math.round(baseSubtotal * 0.15)) * tipPercent / 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1fr 1fr' : '1fr', gap: 20, alignItems: 'start' }}>
      {/* Left: Menu */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 Menu</h2>
          {cartCount > 0 && (
            <button onClick={clearCart} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear cart
            </button>
          )}
        </div>

        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {CATEGORY_EMOJIS[category] ?? '🍽️'} {category}
            </div>
            {items.map(item => {
              const inCart = cart.find(c => c.name === item.name);
              return (
                <div
                  key={item.name}
                  className="glass-card"
                  style={{
                    padding: '10px 14px',
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: inCart ? '1px solid rgba(16,185,129,0.3)' : undefined,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>{fmt(item.basePrice)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {inCart && (
                      <>
                        <button
                          onClick={() => removeItem(item.name)}
                          style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#94a3b8', fontSize: 16, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >−</button>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', minWidth: 20, textAlign: 'center' }}>
                          {inCart.quantity}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addItem(item)}
                      style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: '1px solid rgba(16,185,129,0.3)',
                        background: 'rgba(16,185,129,0.1)',
                        color: '#10b981', fontSize: 16, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Right: Cart & Comparison */}
      {cart.length > 0 && (
        <div style={{ position: 'sticky', top: 60 }}>
          {/* Cart summary */}
          <div className="glass-card" style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              🛒 Your Order ({cartCount} item{cartCount !== 1 ? 's' : ''})
            </h3>
            {cart.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: '#94a3b8' }}>
                <span>{item.quantity}× {item.name}</span>
                <span style={{ color: '#e2e8f0' }}>{fmt(item.basePrice * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
              <span>Subtotal (in-store)</span>
              <span style={{ color: '#10b981' }}>{fmt(baseSubtotal)}</span>
            </div>
          </div>

          {/* Tip selector */}
          <div className="glass-card" style={{ padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Tip</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 15, 18, 20, 25].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: tipPercent === pct ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                    background: tipPercent === pct ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                    color: tipPercent === pct ? '#10b981' : '#94a3b8',
                  }}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>
            {tipPercent > 0 && (
              <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                ~{fmt(tip)} tip
              </div>
            )}
          </div>

          {/* Subscription toggles */}
          <div className="glass-card" style={{ padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Your memberships</div>
            {[
              { key: 'doordash', label: 'DashPass', price: '$9.99/mo' },
              { key: 'ubereats', label: 'Uber One', price: '$9.99/mo' },
              { key: 'grubhub', label: 'Grubhub+', price: '$9.99/mo' },
            ].map(sub => (
              <label key={sub.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={subscriptions[sub.key] ?? false}
                  onChange={e => setSubscriptions(prev => ({ ...prev, [sub.key]: e.target.checked }))}
                  style={{ accentColor: '#10b981' }}
                />
                <span style={{ color: '#e2e8f0' }}>{sub.label}</span>
                <span style={{ color: '#475569', fontSize: 11 }}>({sub.price})</span>
              </label>
            ))}
          </div>

          {/* Platform comparison */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>💰 Total Cost Comparison</h3>
              {savings > 0 && (
                <div style={{
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#10b981',
                }}>
                  Save {fmt(savings)}
                </div>
              )}
            </div>

            {quotes.map((q, i) => {
              const isBest = i === 0;
              const isWorst = i === quotes.length - 1 && quotes.length > 1;
              return (
                <div
                  key={q.platform}
                  style={{
                    padding: '12px 14px',
                    marginBottom: 8,
                    borderRadius: 10,
                    border: isBest ? '2px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    background: isBest ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                    position: 'relative',
                  }}
                >
                  {isBest && (
                    <div style={{
                      position: 'absolute', top: -8, right: 12,
                      background: '#10b981', color: '#000', fontWeight: 800,
                      fontSize: 10, padding: '2px 8px', borderRadius: 4,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      🏆 Best Deal
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{q.emoji}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{q.label}</span>
                      {q.isSubscriber && (
                        <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                          Member
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 900, color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#e2e8f0' }}>
                      {fmt(q.fees.total)}
                    </span>
                  </div>

                  {/* Fee breakdown */}
                  <div style={{ fontSize: 11, color: '#475569', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    <span>Food: {fmt(q.fees.subtotal)}</span>
                    <span>Delivery: {fmt(q.fees.deliveryFee)}</span>
                    <span>Service: {fmt(q.fees.serviceFee)}</span>
                    {q.fees.smallOrderFee > 0 && <span style={{ color: '#ef4444' }}>Small order: {fmt(q.fees.smallOrderFee)}</span>}
                    <span>Tax: {fmt(q.fees.tax)}</span>
                    {tipPercent > 0 && <span>Tip: {fmt(Math.round(q.fees.subtotal * tipPercent / 100))}</span>}
                    {q.fees.markupAmount > 0 && (
                      <span style={{ color: '#f97316' }}>
                        Menu markup: +{fmt(q.fees.markupAmount)}
                      </span>
                    )}
                  </div>

                  {isBest && quotes.length > 1 && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                      ✅ {fmt(savings)} cheaper than {worstQuote?.label}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const url = getOrderLink(chainName, q.platform);
                      if (hasExtension && ['doordash', 'ubereats', 'grubhub'].includes(q.platform)) {
                        sendAutofillToExtension(q.platform, chainName, cart, url);
                      } else {
                        window.open(url, '_blank');
                      }
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: 10,
                      padding: '8px 0',
                      borderRadius: 8,
                      border: isBest ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      background: isBest ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                      color: isBest ? '#10b981' : '#94a3b8',
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {q.platform === 'pickup'
                      ? '📍 Find Nearest Location'
                      : hasExtension && ['doordash', 'ubereats', 'grubhub'].includes(q.platform)
                        ? `⚡ Auto-Fill on ${q.label}`
                        : `Order on ${q.label} →`}
                  </button>
                </div>
              );
            })}

            <div style={{ marginTop: 12, fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
              💡 Estimates based on typical platform fees. Actual prices may vary. Tip calculated on food subtotal.
            </div>
          </div>
        </div>
      )}

      {/* Empty cart prompt */}
      {cart.length === 0 && (
        <div style={{ display: 'none' }} /> // Hidden when menu is full-width
      )}
    </div>
  );
}
