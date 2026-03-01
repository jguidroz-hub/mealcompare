'use client';
import { useState, useEffect } from 'react';

interface PlatformPrice {
  platform: string;
  itemName: string;
  price: number;
  matchConfidence: number;
}

interface MenuItem {
  canonicalName: string;
  category: string;
  basePrice: number;
  platformPrices: PlatformPrice[];
  bestPlatform: string | null;
  bestPrice: number | null;
  worstMarkup: number | null;
}

interface ComparisonResult {
  chain: string;
  metro: string;
  items: MenuItem[];
  totalBasket: {
    baseTotal: number;
    platformTotals: Record<string, number>;
    bestPlatform: string;
    bestTotal: number;
    savings: number;
  };
  fetchedAt: string;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function markupColor(markup: number | null): string {
  if (markup === null) return '#475569';
  if (markup <= 0) return '#10b981'; // cheaper or same
  if (markup < 0.10) return '#fbbf24'; // <10% markup
  if (markup < 0.20) return '#f97316'; // 10-20% markup
  return '#ef4444'; // 20%+ markup
}

function markupLabel(markup: number | null): string {
  if (markup === null) return '—';
  if (markup <= 0) return 'Same or less';
  return `+${(markup * 100).toFixed(0)}%`;
}

const PLATFORM_LABELS: Record<string, { name: string; color: string; emoji: string }> = {
  ubereats: { name: 'Uber Eats', color: '#06C167', emoji: '🟢' },
  doordash: { name: 'DoorDash', color: '#FF3008', emoji: '🔴' },
  grubhub: { name: 'Grubhub', color: '#F63440', emoji: '🟠' },
  direct: { name: 'Direct', color: '#10b981', emoji: '🏪' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  entree: '🍽️',
  side: '🍟',
  drink: '🥤',
  dessert: '🍦',
  combo: '🎁',
};

export default function MenuComparison({ restaurantName, metro }: { restaurantName: string; metro: string }) {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/menu-compare?chain=${encodeURIComponent(restaurantName)}&metro=${encodeURIComponent(metro)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not a chain');
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [restaurantName, metro]);

  if (loading || error || !data || data.items.length === 0) return null;

  const itemsWithPrices = data.items.filter(i => i.platformPrices.length > 0);
  const displayItems = expanded ? itemsWithPrices : itemsWithPrices.slice(0, 6);
  const hasMore = itemsWithPrices.length > 6;

  const avgMarkup = itemsWithPrices.reduce((sum, i) => sum + (i.worstMarkup ?? 0), 0) / (itemsWithPrices.length || 1);

  return (
    <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 4 }}>
            Menu Price Comparison
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>
            In-store vs delivery app prices · {itemsWithPrices.length} items matched
          </div>
        </div>
        {avgMarkup > 0 && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 700,
            color: '#ef4444',
          }}>
            Avg +{(avgMarkup * 100).toFixed(0)}% markup
          </div>
        )}
      </div>

      {/* Items table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Item</th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: '#64748b', fontWeight: 600, fontSize: 11 }}>In-Store</th>
              {Object.keys(data.totalBasket.platformTotals).map(p => (
                <th key={p} style={{ textAlign: 'right', padding: '8px 0', color: PLATFORM_LABELS[p]?.color ?? '#64748b', fontWeight: 600, fontSize: 11 }}>
                  {PLATFORM_LABELS[p]?.emoji} {PLATFORM_LABELS[p]?.name ?? p}
                </th>
              ))}
              <th style={{ textAlign: 'right', padding: '8px 0', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Markup</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px 0', color: '#e2e8f0', fontWeight: 500 }}>
                  <span style={{ marginRight: 6 }}>{CATEGORY_EMOJIS[item.category] ?? '🍽️'}</span>
                  {item.canonicalName}
                </td>
                <td style={{ textAlign: 'right', padding: '10px 0', color: '#10b981', fontWeight: 600 }}>
                  {formatPrice(item.basePrice)}
                </td>
                {Object.keys(data.totalBasket.platformTotals).map(p => {
                  const pp = item.platformPrices.find(x => x.platform === p);
                  return (
                    <td key={p} style={{ textAlign: 'right', padding: '10px 0', color: pp ? '#e2e8f0' : '#334155', fontWeight: pp ? 500 : 400 }}>
                      {pp ? formatPrice(pp.price) : '—'}
                    </td>
                  );
                })}
                <td style={{ textAlign: 'right', padding: '10px 0', color: markupColor(item.worstMarkup), fontWeight: 600 }}>
                  {markupLabel(item.worstMarkup)}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Totals row */}
          <tfoot>
            <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
              <td style={{ padding: '12px 0', fontWeight: 700, color: '#e2e8f0' }}>Total Basket</td>
              <td style={{ textAlign: 'right', padding: '12px 0', color: '#10b981', fontWeight: 700 }}>
                {formatPrice(data.totalBasket.baseTotal)}
              </td>
              {Object.entries(data.totalBasket.platformTotals).map(([p, total]) => (
                <td key={p} style={{ textAlign: 'right', padding: '12px 0', color: '#e2e8f0', fontWeight: 700 }}>
                  {formatPrice(total)}
                </td>
              ))}
              <td style={{ textAlign: 'right', padding: '12px 0', color: markupColor(avgMarkup), fontWeight: 700 }}>
                {avgMarkup > 0 ? `+${(avgMarkup * 100).toFixed(0)}%` : '—'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 12,
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Show all {itemsWithPrices.length} items ↓
        </button>
      )}

      <div style={{ marginTop: 12, fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
        💡 In-store prices are typical national averages. Delivery app prices are live from your area.
        Prices may vary by location. <em>Before fees & tip.</em>
      </div>
    </div>
  );
}
