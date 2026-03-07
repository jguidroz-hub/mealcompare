'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const METROS = [
  'atlanta', 'austin', 'baltimore', 'boston', 'charlotte', 'chicago', 'columbus',
  'dallas', 'dc', 'denver', 'detroit', 'houston', 'indianapolis', 'la', 'miami',
  'milwaukee', 'minneapolis', 'nashville', 'nola', 'nyc', 'philly', 'phoenix',
  'pittsburgh', 'portland', 'raleigh', 'sandiego', 'seattle', 'sf', 'stlouis', 'tampa',
];

const METRO_LABELS: Record<string, string> = {
  atlanta: 'Atlanta', austin: 'Austin', baltimore: 'Baltimore', boston: 'Boston',
  charlotte: 'Charlotte', chicago: 'Chicago', columbus: 'Columbus', dallas: 'Dallas',
  dc: 'Washington DC', denver: 'Denver', detroit: 'Detroit', houston: 'Houston',
  indianapolis: 'Indianapolis', la: 'Los Angeles', miami: 'Miami', milwaukee: 'Milwaukee',
  minneapolis: 'Minneapolis', nashville: 'Nashville', nola: 'New Orleans', nyc: 'New York',
  philly: 'Philadelphia', phoenix: 'Phoenix', pittsburgh: 'Pittsburgh', portland: 'Portland',
  raleigh: 'Raleigh-Durham', sandiego: 'San Diego', seattle: 'Seattle', sf: 'San Francisco',
  stlouis: 'St. Louis', tampa: 'Tampa',
};

interface SearchResult {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  directUrl: string | null;
  platform: string | null;
}

function PlatformBadge({ platform }: { platform: string | null }) {
  if (!platform) return null;
  const colors: Record<string, { bg: string; text: string }> = {
    toast: { bg: '#fff7ed', text: '#c2410c' },
    square: { bg: '#f0fdf4', text: '#15803d' },
    direct: { bg: '#eff6ff', text: '#1d4ed8' },
  };
  const c = colors[platform] || colors.direct;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const }}>
      {platform === 'toast' ? '🍞 Toast' : platform === 'square' ? '◻️ Square' : '🔗 Direct'}
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [metro, setMetro] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    if (query.length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q: query, limit: '20' });
      if (metro) params.set('metro', metro);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, [query, metro]);

  useEffect(() => {
    const timer = setTimeout(() => { if (query.length >= 2) search(); }, 300);
    return () => clearTimeout(timer);
  }, [query, metro, search]);

  const trackClick = async (r: SearchResult) => {
    try {
      await fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant: r.name,
          slug: r.slug,
          metro: r.metros[0] || metro,
          platform: r.platform,
          directUrl: r.directUrl,
          source: 'search',
        }),
      });
    } catch { /* fire and forget */ }
  };

  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb', lineHeight: 1, letterSpacing: '-0.05em', marginRight: 2 }}>~</span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: '#111' }}>eddy</span>
            <span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 1, fontWeight: 500 }}>.delivery</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/blog" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
            <Link href="/metros" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Cities</Link>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Add to Chrome</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>Find Direct Ordering for Any Restaurant</h1>
          <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>
            Search 13,000+ restaurants across 30 cities. Skip DoorDash fees and order direct.
          </p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search restaurants... (e.g. Chipotle, Wingstop)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', fontSize: 16,
                border: '2px solid #e5e7eb', borderRadius: 12,
                outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box' as const,
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <select
            value={metro}
            onChange={e => setMetro(e.target.value)}
            style={{ padding: '14px 16px', fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 12, background: '#fff', cursor: 'pointer', minWidth: 160 }}
          >
            <option value="">All Cities</option>
            {METROS.map(m => <option key={m} value={m}>{METRO_LABELS[m]}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading && <p style={{ textAlign: 'center' as const, color: '#9ca3af' }}>Searching...</p>}
        
        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center' as const, padding: 40, color: '#6b7280' }}>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No results found</p>
            <p>Try a different restaurant name or select a city.</p>
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((r, i) => (
              <div key={`${r.slug}-${i}`} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{r.name}</span>
                    <PlatformBadge platform={r.platform} />
                  </div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>
                    {r.metros.map(m => METRO_LABELS[m] || m).join(', ')}
                    {r.category !== 'restaurant' && ` · ${r.category}`}
                  </div>
                </div>
                {r.directUrl ? (
                  <a
                    href={r.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(r)}
                    style={{
                      background: '#16a34a', color: '#fff', padding: '10px 20px',
                      borderRadius: 8, fontSize: 14, fontWeight: 700,
                      textDecoration: 'none', whiteSpace: 'nowrap' as const,
                    }}
                  >
                    Order Direct →
                  </a>
                ) : (
                  <span style={{ color: '#d1d5db', fontSize: 13, fontWeight: 500 }}>No direct link yet</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!searched && (
          <div style={{ background: '#f9fafb', borderRadius: 16, padding: 32, textAlign: 'center' as const, marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Why Order Direct?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 24, textAlign: 'left' as const }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Save 20-30%</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>No menu markups, no service fees, no platform commissions</div>
              </div>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🍕</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Same Food</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Identical menu, same kitchen, same delivery to your door</div>
              </div>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>❤️</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Support Restaurants</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Restaurants keep 85-100% vs. 70% on delivery apps</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
