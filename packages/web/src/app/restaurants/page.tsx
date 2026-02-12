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
  'Sushi', 'Italian', 'BBQ', 'Seafood', 'Vegan', 'Wings', 'Breakfast',
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
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' }}>SkipTheFee</span>
          </Link>
          <Link href="/install" className="btn-glow" style={{ padding: '6px 16px', fontSize: 12, borderRadius: 8, boxShadow: 'none' }}>
            Get Extension
          </Link>
        </div>
      </header>

      {/* Hero mini */}
      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '32px 16px 20px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Find <span className="gradient-text">direct ordering</span>
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Skip the delivery app markup. Order direct and save 15–30%.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#475569' }}>🔍</div>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 40px 12px 38px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#e2e8f0', fontSize: 15, outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.3)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer' }}
            >✕</button>
          )}
        </div>
      </div>

      {/* Metro pills */}
      <div className="pill-scroll" style={{ maxWidth: 600, margin: '0 auto', overflowX: 'auto', padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {METROS.map(m => (
            <button
              key={m.id}
              onClick={() => { setMetro(m.id); setSearch(''); setCategory('All'); }}
              className={metro === m.id ? 'pill-active' : 'pill'}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="pill-scroll" style={{ maxWidth: 600, margin: '0 auto', overflowX: 'auto', padding: '8px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? 'pill-active' : 'pill'}
              style={category === c ? { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.12)', color: '#3b82f6' } : {}}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stats + filter bar */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#475569' }}>
          {METROS.find(m => m.id === metro)?.full} · {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {directCount > 0 && <span style={{ color: '#10b981' }}> · {directCount} direct</span>}
        </span>
        <button
          onClick={() => setShowDirectOnly(!showDirectOnly)}
          className={showDirectOnly ? 'pill-active' : 'pill'}
          style={{ fontSize: 11, padding: '4px 10px' }}
        >
          🏪 Direct only
        </button>
      </div>

      {/* Restaurant list */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <div style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#475569', fontSize: 14 }}>Loading restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>🍽️</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              {search ? `No results for "${search}"` : 'No restaurants found'}
            </p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} metro={metro} />
          ))
        )}
      </div>

      {/* Bottom banner */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,15,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 50 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>Auto-compare when you order</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Install the Chrome extension for automatic savings</div>
          </div>
          <Link href="/install" className="btn-glow" style={{ padding: '8px 18px', fontSize: 12, borderRadius: 8, boxShadow: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Install Free
          </Link>
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
  }).catch(() => {});
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

  return (
    <div className="glass-card glass-card-hover" style={{ padding: 16, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: hasDirect ? 12 : 4 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
          <div style={{ fontSize: 12, color: '#475569', textTransform: 'capitalize', marginTop: 2 }}>{r.category}</div>
        </div>
        {hasDirect && (
          <span style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.15)',
            color: '#10b981',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 100,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {platform || 'Direct'}
          </span>
        )}
      </div>
      {hasDirect ? (
        <a
          href={addUtmParams(r.directUrl!)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(r, metro)}
          style={{
            display: 'block',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: 'white',
            textAlign: 'center',
            padding: '10px 16px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
        >
          Order Direct — Skip the Fees →
        </a>
      ) : (
        <div style={{ fontSize: 12, color: '#334155', fontStyle: 'italic' }}>
          Use the extension to compare delivery prices
        </div>
      )}
    </div>
  );
}
