'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { trackPageView, trackSearch, trackMetroSelect, trackCategoryFilter, trackOrderClick } from '@/lib/analytics';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

const METROS: Record<string, { label: string; full: string; tagline: string }> = {
  nyc: { label: 'NYC', full: 'New York', tagline: 'The city that never stops ordering' },
  chicago: { label: 'Chicago', full: 'Chicago', tagline: 'Deep dish, direct deals' },
  la: { label: 'LA', full: 'Los Angeles', tagline: 'Skip the LA markup' },
  sf: { label: 'SF', full: 'San Francisco', tagline: 'Bay Area bites, no fees' },
  boston: { label: 'Boston', full: 'Boston', tagline: 'Wicked good savings' },
  miami: { label: 'Miami', full: 'Miami', tagline: 'Caliente deals, zero fees' },
  dc: { label: 'DC', full: 'Washington DC', tagline: 'Power lunch, skip the fee' },
  austin: { label: 'Austin', full: 'Austin', tagline: 'Keep Austin ordering direct' },
  houston: { label: 'Houston', full: 'Houston', tagline: 'Space City savings' },
  atlanta: { label: 'Atlanta', full: 'Atlanta', tagline: 'ATL direct ordering' },
  seattle: { label: 'Seattle', full: 'Seattle', tagline: 'Skip the drizzle of fees' },
  denver: { label: 'Denver', full: 'Denver', tagline: 'Mile-high savings' },
  philly: { label: 'Philly', full: 'Philadelphia', tagline: 'No fee on your cheesesteak' },
  nashville: { label: 'Nashville', full: 'Nashville', tagline: 'Hot chicken, cool savings' },
  nola: { label: 'NOLA', full: 'New Orleans', tagline: 'Laissez les bon temps rouler — direct' },
  dallas: { label: 'Dallas', full: 'Dallas', tagline: 'Everything\'s bigger, except the fees' },
  phoenix: { label: 'Phoenix', full: 'Phoenix', tagline: 'Desert-dry delivery fees' },
  portland: { label: 'Portland', full: 'Portland', tagline: 'Keep Portland fee-free' },
  detroit: { label: 'Detroit', full: 'Detroit', tagline: 'Motor City, direct orders' },
  minneapolis: { label: 'Minneapolis', full: 'Minneapolis', tagline: 'North Star savings' },
  charlotte: { label: 'Charlotte', full: 'Charlotte', tagline: 'Queen City direct deals' },
  tampa: { label: 'Tampa', full: 'Tampa', tagline: 'Sunshine State savings' },
  sandiego: { label: 'San Diego', full: 'San Diego', tagline: 'SoCal direct bites' },
  stlouis: { label: 'St Louis', full: 'St Louis', tagline: 'Gateway to savings' },
  pittsburgh: { label: 'Pittsburgh', full: 'Pittsburgh', tagline: 'Steel City, no fee' },
  columbus: { label: 'Columbus', full: 'Columbus', tagline: 'Ohio\'s best, direct' },
  indianapolis: { label: 'Indy', full: 'Indianapolis', tagline: 'Race to savings' },
  milwaukee: { label: 'Milwaukee', full: 'Milwaukee', tagline: 'Brew City bites' },
  raleigh: { label: 'Raleigh', full: 'Raleigh', tagline: 'Triangle direct orders' },
  baltimore: { label: 'Baltimore', full: 'Baltimore', tagline: 'Charm City savings' },
};

const CATEGORY_MAP: Record<string, { emoji: string; label: string }> = {
  pizza: { emoji: '🍕', label: 'Pizza' },
  mexican: { emoji: '🌮', label: 'Mexican' },
  chinese: { emoji: '🥡', label: 'Chinese' },
  burgers: { emoji: '🍔', label: 'Burgers' },
  thai: { emoji: '🍜', label: 'Thai' },
  indian: { emoji: '🍛', label: 'Indian' },
  japanese: { emoji: '🍣', label: 'Japanese' },
  italian: { emoji: '🍝', label: 'Italian' },
  bbq: { emoji: '🔥', label: 'BBQ' },
  seafood: { emoji: '🦞', label: 'Seafood' },
  wings: { emoji: '🍗', label: 'Wings' },
  breakfast: { emoji: '🥞', label: 'Breakfast' },
  cafe: { emoji: '☕', label: 'Café' },
  korean: { emoji: '🥘', label: 'Korean' },
  mediterranean: { emoji: '🧆', label: 'Mediterranean' },
  deli: { emoji: '🥪', label: 'Deli' },
  poke: { emoji: '🐟', label: 'Poké' },
  bakery: { emoji: '🧁', label: 'Bakery' },
  caribbean: { emoji: '🥥', label: 'Caribbean' },
  african: { emoji: '🍲', label: 'African' },
  latin: { emoji: '🫔', label: 'Latin' },
  hawaiian: { emoji: '🌺', label: 'Hawaiian' },
  restaurant: { emoji: '🍽️', label: 'Restaurant' },
};

function getPlatformLabel(r: Restaurant): string {
  if (r.hasToast) return 'Toast';
  if (r.hasSquare) return 'Square';
  if (r.hasWebsite) return 'Direct';
  return 'Direct';
}

function getSavingsEstimate(name: string): string {
  // Deterministic hash based on restaurant name — same restaurant always shows same savings
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  // Range: $3.50 - $11.50 (realistic delivery app markup on $25-40 orders)
  const base = 350; // $3.50 min
  const range = 800; // $8.00 range
  const cents = base + (Math.abs(hash) % range);
  return '$' + (cents / 100).toFixed(2);
}

function addUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'skipthefee');
    u.searchParams.set('utm_medium', 'pwa');
    u.searchParams.set('utm_campaign', 'direct_order');
    u.searchParams.set('ref', 'skipthefee');
    return u.toString();
  } catch {
    return url + (url.includes('?') ? '&' : '?') + 'utm_source=skipthefee&ref=skipthefee';
  }
}

export default function MetroPage() {
  const params = useParams();
  const metro = (params?.metro as string) || 'nyc';
  const metroInfo = METROS[metro] || { label: metro, full: metro, tagline: '' };

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('q') || '');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    trackPageView({ metro });
    trackMetroSelect(metro);
    setLoading(true);
    fetch(`/api/restaurants?metro=${metro}`)
      .then(r => r.json())
      .then(data => { setRestaurants(data.restaurants || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [metro]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    restaurants.forEach(r => {
      const c = r.category.toLowerCase();
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([cat, count]) => ({ id: cat, count, ...(CATEGORY_MAP[cat] || { emoji: '🍽️', label: cat }) }));
  }, [restaurants]);

  const filtered = useMemo(() => {
    let result = restaurants;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      result = result.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    // Direct ordering first
    result.sort((a, b) => (b.directUrl ? 1 : 0) - (a.directUrl ? 1 : 0));
    return result;
  }, [restaurants, search, category]);

  // Debounced search tracking
  useEffect(() => {
    if (!search || search.length < 2) return;
    const t = setTimeout(() => trackSearch(search, metro, filtered.length), 500);
    return () => clearTimeout(t);
  }, [search, metro, filtered.length]);

  const directCount = restaurants.filter(r => r.directUrl).length;
  const directPct = restaurants.length > 0 ? Math.round((directCount / restaurants.length) * 100) : 0;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>SkipTheFee</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/restaurants" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>All Cities</Link>
            <Link href="/savings" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>💰 Calculator</Link>
          </div>
        </div>
      </header>

      {/* City Hero */}
      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '36px 16px 24px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {metroInfo.full}
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{metroInfo.tagline}</p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>{restaurants.length}</div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Restaurants</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#3b82f6' }}>{directCount}</div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Order</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b' }}>{directPct}%</div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</div>
          <input
            type="text"
            placeholder={`Search ${metroInfo.full} restaurants...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 42px 14px 42px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, color: '#e2e8f0', fontSize: 16, outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.3)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', fontSize: 16, cursor: 'pointer' }}>✕</button>
          )}
        </div>
      </div>

      {/* Category grid */}
      {!search && (
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <button
              onClick={() => setCategory('All')}
              style={{
                background: category === 'All' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                border: category === 'All' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '12px 4px', cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>🍽️</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: category === 'All' ? '#10b981' : '#94a3b8' }}>All</div>
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(category === c.id ? 'All' : c.id)}
                style={{
                  background: category === c.id ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                  border: category === c.id ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '12px 4px', cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 2 }}>{c.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: category === c.id ? '#10b981' : '#94a3b8' }}>{c.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {filtered.filter(r => r.directUrl).length} restaurant{filtered.filter(r => r.directUrl).length !== 1 ? 's' : ''} with direct ordering
          {category !== 'All' && ` · ${CATEGORY_MAP[category]?.emoji || ''} ${CATEGORY_MAP[category]?.label || category}`}
        </span>
        <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
          {directPct}% coverage
        </span>
      </div>

      {/* Restaurant list */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 16px' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#475569', fontSize: 15 }}>Finding restaurants in {metroInfo.full}...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 16px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🍽️</p>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 8 }}>
              {search ? `No results for "${search}"` : 'No restaurants found'}
            </p>
            {search && <button onClick={() => setSearch('')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Clear search</button>}
          </div>
        ) : (
          <>
            {filtered.filter(r => r.directUrl).map((r, i) => (
              <RestaurantRow key={`${r.name}-${i}`} restaurant={r} metro={metro} />
            ))}
            {filtered.some(r => !r.directUrl) && (
              <details style={{ marginTop: 16 }}>
                <summary style={{ fontSize: 13, color: '#475569', cursor: 'pointer', padding: '8px 0', userSelect: 'none' }}>
                  + {filtered.filter(r => !r.directUrl).length} more restaurants (no direct ordering yet)
                </summary>
                <div style={{ marginTop: 8 }}>
                  {filtered.filter(r => !r.directUrl).map((r, i) => (
                    <RestaurantRow key={`no-${r.name}-${i}`} restaurant={r} metro={metro} />
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,15,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 50 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Auto-compare every order</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Chrome extension compares all platforms instantly</div>
          </div>
          <Link href="/install" className="btn-glow" style={{ padding: '10px 20px', fontSize: 13, borderRadius: 10, boxShadow: 'none', flexShrink: 0 }}>
            Install Free
          </Link>
        </div>
      </div>
    </main>
  );
}

function RestaurantRow({ restaurant: r, metro }: { restaurant: Restaurant; metro: string }) {
  const hasDirect = !!r.directUrl;
  const catInfo = CATEGORY_MAP[r.category.toLowerCase()] || { emoji: '🍽️', label: r.category };
  const savings = useMemo(() => getSavingsEstimate(r.name), [r.name]);
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const [faved, setFaved] = useState(false);

  useEffect(() => { setFaved(isFavorite(slug, metro)); }, [slug, metro]);

  const handleClick = useCallback(() => {
    const platform = r.hasToast ? 'toast' : r.hasSquare ? 'square' : 'website';
    trackOrderClick(r.name, metro, platform, r.directUrl || '');
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant: r.name, slug, metro, source: 'pwa', directUrl: r.directUrl }),
    }).catch(() => {});
  }, [r.name, r.directUrl, r.hasToast, r.hasSquare, slug, metro]);

  const handleFav = useCallback(() => {
    const added = toggleFavorite(slug, r.name, metro, r.directUrl);
    setFaved(added);
  }, [slug, r.name, metro, r.directUrl]);

  return (
    <div className="glass-card glass-card-hover" style={{ padding: '14px 16px', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Emoji icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: hasDirect ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
          border: hasDirect ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.06)',
        }}>
          {catInfo.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href={`/restaurant/${metro}/${slug}`} style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#e2e8f0', textDecoration: 'none' }}>{r.name}</Link>
            <button onClick={handleFav} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, flexShrink: 0 }} title={faved ? 'Remove from favorites' : 'Add to favorites'}>
              {faved ? '❤️' : '🤍'}
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{catInfo.label}</span>
            {hasDirect && (
              <>
                <span style={{ color: '#1e293b' }}>·</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>via {getPlatformLabel(r)}</span>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        {hasDirect ? (
          <a
            href={addUtm(r.directUrl!)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', padding: '8px 14px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              flexShrink: 0, lineHeight: 1.2,
            }}
          >
            <span>Order Direct</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>Save ~{savings}</span>
          </a>
        ) : (
          <div style={{ fontSize: 11, color: '#334155', textAlign: 'right', flexShrink: 0 }}>
            No direct<br />link yet
          </div>
        )}
      </div>
    </div>
  );
}
