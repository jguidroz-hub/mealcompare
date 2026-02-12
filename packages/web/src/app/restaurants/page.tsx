'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

const METROS = [
  { id: 'nyc', label: 'NYC', full: 'New York' },
  { id: 'chicago', label: 'Chicago', full: 'Chicago' },
  { id: 'la', label: 'LA', full: 'Los Angeles' },
  { id: 'sf', label: 'SF', full: 'San Francisco' },
  { id: 'boston', label: 'Boston', full: 'Boston' },
  { id: 'miami', label: 'Miami', full: 'Miami' },
  { id: 'dc', label: 'DC', full: 'Washington DC' },
  { id: 'austin', label: 'Austin', full: 'Austin' },
  { id: 'houston', label: 'Houston', full: 'Houston' },
  { id: 'atlanta', label: 'Atlanta', full: 'Atlanta' },
  { id: 'seattle', label: 'Seattle', full: 'Seattle' },
  { id: 'denver', label: 'Denver', full: 'Denver' },
  { id: 'philly', label: 'Philly', full: 'Philadelphia' },
  { id: 'nashville', label: 'Nashville', full: 'Nashville' },
  { id: 'nola', label: 'NOLA', full: 'New Orleans' },
];

const CATEGORIES = [
  'All', 'Pizza', 'Mexican', 'Chinese', 'Burgers', 'Thai', 'Indian',
  'Sushi', 'Italian', 'BBQ', 'Seafood', 'Vegan', 'Wings',
];

export default function RestaurantsPage() {
  const [metro, setMetro] = useState('nyc');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showDirectOnly, setShowDirectOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants?metro=${metro}`)
      .then(r => r.json())
      .then(data => {
        setRestaurants(data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [metro]);

  const filtered = useMemo(() => {
    let result = restaurants;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      result = result.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (showDirectOnly) {
      result = result.filter(r => r.directUrl);
    }
    return result;
  }, [restaurants, search, category, showDirectOnly]);

  const directCount = restaurants.filter(r => r.directUrl).length;

  return (
    <main style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/" style={S.logo}>
            <span style={{ fontSize: 24 }}>💰</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>SkipTheFee</span>
          </Link>
          <Link href="/install" style={S.installBtn}>Get Extension</Link>
        </div>
      </header>

      {/* Search bar */}
      <div style={S.searchWrap}>
        <div style={S.searchInner}>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={S.clearBtn}>✕</button>
          )}
        </div>
      </div>

      {/* Metro pills */}
      <div style={S.pillScroll}>
        <div style={S.pillRow}>
          {METROS.map(m => (
            <button
              key={m.id}
              onClick={() => { setMetro(m.id); setSearch(''); setCategory('All'); }}
              style={metro === m.id ? S.pillActive : S.pill}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={S.pillScroll}>
        <div style={S.pillRow}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={category === c ? { ...S.pill, background: '#3b82f6', color: 'white', borderColor: '#3b82f6' } : S.pill}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={S.statsBar}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {METROS.find(m => m.id === metro)?.full} · {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
          {directCount > 0 && ` · ${directCount} with direct ordering`}
        </span>
        <button
          onClick={() => setShowDirectOnly(!showDirectOnly)}
          style={showDirectOnly ? S.filterActive : S.filterBtn}
        >
          🏪 Direct only
        </button>
      </div>

      {/* Restaurant list */}
      <div style={S.list}>
        {loading ? (
          <div style={S.empty}>
            <div style={S.spinner} />
            <p style={{ color: '#64748b', fontSize: 14 }}>Loading restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>🍽️</p>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              {search ? `No results for "${search}"` : 'No restaurants found'}
            </p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} metro={metro} />
          ))
        )}
      </div>

      {/* Bottom install banner (mobile) */}
      <div style={S.bottomBanner}>
        <div style={S.bannerInner}>
          <div>
            <strong style={{ fontSize: 14 }}>Save more with the extension</strong>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Auto-compare when you order on DoorDash, Uber Eats, or Grubhub</p>
          </div>
          <Link href="/install" style={S.bannerBtn}>Install</Link>
        </div>
      </div>
    </main>
  );
}

function trackClick(restaurant: Restaurant, metro: string) {
  const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurant: restaurant.name,
      slug,
      metro,
      source: 'pwa',
      directUrl: restaurant.directUrl,
    }),
  }).catch(() => {}); // Best-effort, never block
}

function addUtmParams(url: string): string {
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

function RestaurantCard({ restaurant: r, metro }: { restaurant: Restaurant; metro: string }) {
  const hasDirect = !!r.directUrl;
  const platform = r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : r.hasWebsite ? 'Website' : null;

  const handleDirectClick = () => {
    trackClick(r, metro);
  };

  return (
    <div style={S.card}>
      <div style={S.cardTop}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.cardName}>{r.name}</div>
          <div style={S.cardCategory}>{r.category}</div>
        </div>
        {hasDirect && (
          <span style={S.directBadge}>
            🏪 {platform || 'Direct'}
          </span>
        )}
      </div>
      {hasDirect ? (
        <a
          href={addUtmParams(r.directUrl!)}
          target="_blank"
          rel="noopener noreferrer"
          style={S.directBtn}
          onClick={handleDirectClick}
        >
          Order Direct — Skip the Fees →
        </a>
      ) : (
        <div style={S.noDirectMsg}>
          Use SkipTheFee extension to compare delivery app prices
        </div>
      )}
    </div>
  );
}

// ─── Styles (inline for SSR, no Tailwind dependency) ──────────
const S: Record<string, React.CSSProperties> = {
  page: {
    background: '#0f172a',
    color: '#e2e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    paddingBottom: 80,
  },
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1e293b',
    zIndex: 50,
  },
  headerInner: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#e2e8f0',
    textDecoration: 'none',
  },
  installBtn: {
    background: '#10b981',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
  },
  searchWrap: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '12px 16px 0',
  },
  searchInner: {
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    paddingRight: 40,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 12,
    color: '#e2e8f0',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: 16,
    cursor: 'pointer',
  },
  pillScroll: {
    maxWidth: 600,
    margin: '0 auto',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' as const,
    padding: '10px 16px 0',
  },
  pillRow: {
    display: 'flex',
    gap: 8,
    whiteSpace: 'nowrap' as const,
  },
  pill: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  pillActive: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid #10b981',
    background: '#10b981',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  statsBar: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid #334155',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: 12,
    cursor: 'pointer',
  },
  filterActive: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid #3b82f6',
    background: 'rgba(59,130,246,0.15)',
    color: '#93c5fd',
    fontSize: 12,
    cursor: 'pointer',
  },
  list: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '0 16px',
  },
  empty: {
    textAlign: 'center',
    padding: '48px 16px',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #1e293b',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 12px',
  },
  card: {
    background: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    border: '1px solid #334155',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  cardName: {
    fontWeight: 700,
    fontSize: 15,
  },
  cardCategory: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize' as const,
    marginTop: 2,
  },
  directBadge: {
    background: 'rgba(16,185,129,0.15)',
    color: '#10b981',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 6,
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  directBtn: {
    display: 'block',
    background: '#10b981',
    color: 'white',
    textAlign: 'center' as const,
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },
  noDirectMsg: {
    fontSize: 12,
    color: '#64748b',
    padding: '4px 0',
  },
  bottomBanner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(15,23,42,0.97)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid #1e293b',
    zIndex: 50,
  },
  bannerInner: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bannerBtn: {
    background: '#10b981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
};
