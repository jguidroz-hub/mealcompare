'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
  metro: string;
  metroLabel: string;
}

const METROS: Record<string, string> = {
  nyc: 'New York', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans', dallas: 'Dallas',
  phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit', minneapolis: 'Minneapolis',
  charlotte: 'Charlotte', tampa: 'Tampa', sandiego: 'San Diego', stlouis: 'St Louis',
  pittsburgh: 'Pittsburgh', columbus: 'Columbus', indianapolis: 'Indianapolis',
  milwaukee: 'Milwaukee', raleigh: 'Raleigh', baltimore: 'Baltimore',
};

const CATEGORY_EMOJI: Record<string, string> = {
  pizza: '🍕', mexican: '🌮', chinese: '🥡', burgers: '🍔', thai: '🍜',
  indian: '🍛', japanese: '🍣', italian: '🍝', bbq: '🔥', seafood: '🦞',
  wings: '🍗', breakfast: '🥞', cafe: '☕', korean: '🥘', mediterranean: '🧆',
  deli: '🥪', poke: '🐟', bakery: '🧁', vietnamese: '🍲', steakhouse: '🥩',
  southern: '🍗', chicken: '🍗', healthy: '🥗', vegan: '🌱', dessert: '🍦',
  tea: '🧋', juice: '🧃', latin: '🫔', restaurant: '🍽️',
};

function addUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'eddy');
    u.searchParams.set('ref', 'eddy');
    return u.toString();
  } catch { return url; }
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [metro, setMetro] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [allData, setAllData] = useState<Record<string, Restaurant[]>>({});
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showMetroPicker, setShowMetroPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Auto-detect city on mount
  useEffect(() => {
    const saved = localStorage.getItem('eddy_metro');
    if (saved && METROS[saved]) {
      setMetro(saved);
      return;
    }
    // Try geolocation
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const closest = findClosestMetro(latitude, longitude);
          setMetro(closest);
          localStorage.setItem('eddy_metro', closest);
          setDetectingLocation(false);
        },
        () => {
          setMetro('austin');
          setDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setMetro('austin');
      setDetectingLocation(false);
    }
  }, []);

  // Load restaurant data when metro changes
  useEffect(() => {
    if (!metro) return;
    if (allData[metro]) return;
    setLoading(true);
    fetch(`/api/restaurants?metro=${metro}&limit=1000`)
      .then(r => r.json())
      .then(data => {
        const restaurants = (data.restaurants || []).map((r: Restaurant) => ({
          ...r,
          metro,
          metroLabel: METROS[metro],
        }));
        setAllData(prev => ({ ...prev, [metro]: restaurants }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [metro, allData]);

  // Search with debounce
  const doSearch = useCallback((q: string) => {
    const data = allData[metro] || [];
    if (!q.trim()) {
      // Show popular (direct ordering available) when no query
      setResults(data.filter(r => r.directUrl).slice(0, 20));
      return;
    }
    const lower = q.toLowerCase();
    const matches = data.filter(r =>
      r.name.toLowerCase().includes(lower) ||
      r.category.toLowerCase().includes(lower)
    );
    // Sort: direct ordering first, then alphabetical
    matches.sort((a, b) => {
      if (a.directUrl && !b.directUrl) return -1;
      if (!a.directUrl && b.directUrl) return 1;
      return a.name.localeCompare(b.name);
    });
    setResults(matches.slice(0, 50));
  }, [metro, allData]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  // Show initial results when data loads
  useEffect(() => {
    if (allData[metro] && !query) {
      doSearch('');
    }
  }, [allData, metro, query, doSearch]);

  const selectMetro = (id: string) => {
    setMetro(id);
    localStorage.setItem('eddy_metro', id);
    setShowMetroPicker(false);
    setQuery('');
    inputRef.current?.focus();
  };

  const totalInCity = allData[metro]?.length || 0;
  const directInCity = allData[metro]?.filter(r => r.directUrl).length || 0;

  return (
    <main style={{
      background: '#FFFFFF', color: '#111', minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Sticky header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E5E7EB', padding: '12px 16px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Logo + city selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 4, textDecoration: 'none' }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#2563EB' }}>~</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>eddy</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>.delivery</span>
            </Link>
            <button
              onClick={() => setShowMetroPicker(!showMetroPicker)}
              style={{
                background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 20,
                padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#374151',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              📍 {detectingLocation ? 'Detecting...' : (METROS[metro] || 'Select city')}
              <span style={{ fontSize: 10 }}>▼</span>
            </button>
          </div>

          {/* Search input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: 12,
            padding: '12px 16px', transition: 'border-color 0.2s',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${totalInCity.toLocaleString()} restaurants in ${METROS[metro] || 'your city'}...`}
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 16, color: '#111',
              }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                style={{
                  background: '#E5E7EB', border: 'none', borderRadius: '50%',
                  width: 24, height: 24, fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            )}
          </div>
        </div>
      </header>

      {/* Metro picker overlay */}
      {showMetroPicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setShowMetroPicker(false)}>
          <div
            style={{
              background: '#FFF', borderRadius: '20px 20px 0 0',
              maxWidth: 600, width: '100%', maxHeight: '70vh',
              overflow: 'auto', padding: '24px 20px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 2, margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Choose your city</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>30 cities available</p>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 8,
            }}>
              {Object.entries(METROS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => selectMetro(id)}
                  style={{
                    padding: '12px 10px', borderRadius: 10, border: 'none',
                    background: metro === id ? '#2563EB' : '#F3F4F6',
                    color: metro === id ? '#FFF' : '#374151',
                    fontWeight: metro === id ? 700 : 500,
                    fontSize: 14, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 100px' }}>
        {/* Stats bar */}
        {!loading && totalInCity > 0 && (
          <div style={{
            display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, color: '#9CA3AF',
          }}>
            <span>{totalInCity.toLocaleString()} restaurants</span>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{directInCity.toLocaleString()} with direct ordering</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌊</div>
            <p>Loading restaurants...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length === 0 && query && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤷</div>
            <p>No restaurants found for &ldquo;{query}&rdquo; in {METROS[metro]}</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Try a different search or city</p>
          </div>
        )}

        {!loading && !query && results.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>
              🏪 Save with direct ordering
            </h2>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              These restaurants have their own ordering — skip the DoorDash markup
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} metro={metro} />
          ))}
        </div>

        {/* Install CTA at bottom */}
        {!loading && results.length > 0 && (
          <div style={{
            marginTop: 32, padding: 24, borderRadius: 16,
            background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
            border: '1px solid #BFDBFE', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🧩</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: '#1E40AF' }}>
              Want automatic comparisons?
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.6 }}>
              The Eddy Chrome extension compares prices on DoorDash, Uber Eats &amp; Grubhub
              automatically while you browse. Free forever.
            </p>
            <Link
              href="/install"
              style={{
                background: '#2563EB', color: '#FFF', padding: '10px 24px',
                borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14,
                display: 'inline-block',
              }}
            >
              Add to Chrome — Free
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function RestaurantCard({ restaurant: r, metro }: { restaurant: Restaurant; metro: string }) {
  const emoji = CATEGORY_EMOJI[r.category] || '🍽️';
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const platforms = [];
  if (r.hasToast) platforms.push('Toast');
  if (r.hasSquare) platforms.push('Square');
  if (r.hasWebsite) platforms.push('Website');

  return (
    <div style={{
      background: '#FFF', borderRadius: 12, border: '1px solid #E5E7EB',
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: r.directUrl ? '#F0FDF4' : '#F9FAFB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, border: `1px solid ${r.directUrl ? '#BBF7D0' : '#E5E7EB'}`,
      }}>
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          href={`/restaurant/${metro}/${slug}`}
          style={{ textDecoration: 'none', color: '#111' }}
        >
          <div style={{
            fontWeight: 700, fontSize: 15,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {r.name}
          </div>
        </Link>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ textTransform: 'capitalize' }}>{r.category}</span>
          {r.directUrl && (
            <span style={{
              background: '#ECFDF5', color: '#059669', fontSize: 10, fontWeight: 700,
              padding: '1px 6px', borderRadius: 4,
            }}>
              DIRECT {platforms.length > 0 ? `· ${platforms[0]}` : ''}
            </span>
          )}
        </div>
      </div>
      {r.directUrl ? (
        <a
          href={addUtm(r.directUrl)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#10b981', color: '#FFF', padding: '8px 14px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 700,
            fontSize: 13, flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          Order direct
        </a>
      ) : (
        <Link
          href={`/restaurant/${metro}/${slug}`}
          style={{
            background: '#F3F4F6', color: '#6B7280', padding: '8px 14px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 600,
            fontSize: 13, flexShrink: 0,
          }}
        >
          Compare
        </Link>
      )}
    </div>
  );
}

// Rough geo distance to find closest metro
const METRO_COORDS: Record<string, [number, number]> = {
  nyc: [40.7128, -74.0060], chicago: [41.8781, -87.6298], la: [34.0522, -118.2437],
  sf: [37.7749, -122.4194], boston: [42.3601, -71.0589], miami: [25.7617, -80.1918],
  dc: [38.9072, -77.0369], austin: [30.2672, -97.7431], houston: [29.7604, -95.3698],
  atlanta: [33.7490, -84.3880], seattle: [47.6062, -122.3321], denver: [39.7392, -104.9903],
  philly: [39.9526, -75.1652], nashville: [36.1627, -86.7816], nola: [29.9511, -90.0715],
  dallas: [32.7767, -96.7970], phoenix: [33.4484, -112.0740], portland: [45.5152, -122.6784],
  detroit: [42.3314, -83.0458], minneapolis: [44.9778, -93.2650], charlotte: [35.2271, -80.8431],
  tampa: [27.9506, -82.4572], sandiego: [32.7157, -117.1611], stlouis: [38.6270, -90.1994],
  pittsburgh: [40.4406, -79.9959], columbus: [39.9612, -82.9988], indianapolis: [39.7684, -86.1581],
  milwaukee: [43.0389, -87.9065], raleigh: [35.7796, -78.6382], baltimore: [39.2904, -76.6122],
};

function findClosestMetro(lat: number, lng: number): string {
  let closest = 'austin';
  let minDist = Infinity;
  for (const [id, [mlat, mlng]] of Object.entries(METRO_COORDS)) {
    const d = Math.sqrt((lat - mlat) ** 2 + (lng - mlng) ** 2);
    if (d < minDist) { minDist = d; closest = id; }
  }
  return closest;
}
