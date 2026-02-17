'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const METRO_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  nyc: { lat: 40.7128, lng: -74.006, label: 'New York' },
  chicago: { lat: 41.8781, lng: -87.6298, label: 'Chicago' },
  la: { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
  sf: { lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
  boston: { lat: 42.3601, lng: -71.0589, label: 'Boston' },
  miami: { lat: 25.7617, lng: -80.1918, label: 'Miami' },
  dc: { lat: 38.9072, lng: -77.0369, label: 'Washington DC' },
  austin: { lat: 30.2672, lng: -97.7431, label: 'Austin' },
  houston: { lat: 29.7604, lng: -95.3698, label: 'Houston' },
  atlanta: { lat: 33.749, lng: -84.388, label: 'Atlanta' },
  seattle: { lat: 47.6062, lng: -122.3321, label: 'Seattle' },
  denver: { lat: 39.7392, lng: -104.9903, label: 'Denver' },
  philly: { lat: 39.9526, lng: -75.1652, label: 'Philadelphia' },
  nashville: { lat: 36.1627, lng: -86.7816, label: 'Nashville' },
  nola: { lat: 29.9511, lng: -90.0715, label: 'New Orleans' },
  dallas: { lat: 32.7767, lng: -96.797, label: 'Dallas' },
  phoenix: { lat: 33.4484, lng: -112.074, label: 'Phoenix' },
  portland: { lat: 45.5152, lng: -122.6784, label: 'Portland' },
  detroit: { lat: 42.3314, lng: -83.0458, label: 'Detroit' },
  minneapolis: { lat: 44.9778, lng: -93.265, label: 'Minneapolis' },
  charlotte: { lat: 35.2271, lng: -80.8431, label: 'Charlotte' },
  tampa: { lat: 27.9506, lng: -82.4572, label: 'Tampa' },
  sandiego: { lat: 32.7157, lng: -117.1611, label: 'San Diego' },
  stlouis: { lat: 38.627, lng: -90.1994, label: 'St Louis' },
  pittsburgh: { lat: 40.4406, lng: -79.9959, label: 'Pittsburgh' },
  columbus: { lat: 39.9612, lng: -82.9988, label: 'Columbus' },
  indianapolis: { lat: 39.7684, lng: -86.1581, label: 'Indianapolis' },
  milwaukee: { lat: 43.0389, lng: -87.9065, label: 'Milwaukee' },
  raleigh: { lat: 35.7796, lng: -78.6382, label: 'Raleigh' },
  baltimore: { lat: 39.2904, lng: -76.6122, label: 'Baltimore' },
};

function closestMetro(lat: number, lng: number): string {
  let best = 'nyc';
  let bestDist = Infinity;
  for (const [id, c] of Object.entries(METRO_COORDS)) {
    const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
    if (d < bestDist) { bestDist = d; best = id; }
  }
  return best;
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Try to detect city from saved preference or geolocation
    const saved = typeof window !== 'undefined' ? localStorage.getItem('stf_metro') : null;
    if (saved && METRO_COORDS[saved]) {
      setDetectedCity(saved);
      return;
    }

    if (navigator.geolocation) {
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const metro = closestMetro(pos.coords.latitude, pos.coords.longitude);
          setDetectedCity(metro);
          localStorage.setItem('stf_metro', metro);
          setDetecting(false);
          trackEvent('geo_detect', { metro });
        },
        () => setDetecting(false),
        { timeout: 5000, maximumAge: 3600000 }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const metro = detectedCity || 'nyc';
    if (query.trim()) {
      trackEvent('hero_search', { query, metro });
      router.push(`/restaurants/${metro}?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/restaurants/${metro}`);
    }
  };

  const handleCityClick = () => {
    const metro = detectedCity || 'nyc';
    router.push(`/restaurants/${metro}`);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto 28px' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={detectedCity ? `Search restaurants in ${METRO_COORDS[detectedCity]?.label}...` : 'Search pizza, sushi, Thai...'}
          style={{
            width: '100%', padding: '16px 120px 16px 48px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, color: '#e2e8f0', fontSize: 16, outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.4)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
        <button type="submit" style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white',
          border: 'none', borderRadius: 12, padding: '10px 20px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          Search
        </button>
      </form>

      {/* Detected city or pick city */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        {detecting ? (
          <span style={{ fontSize: 12, color: '#475569' }}>📍 Detecting your city...</span>
        ) : detectedCity ? (
          <button onClick={handleCityClick} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: '#10b981', fontWeight: 600,
          }}>
            📍 {METRO_COORDS[detectedCity]?.label} · <span style={{ color: '#64748b', fontWeight: 400 }}>Not your city? <span style={{ textDecoration: 'underline' }}>Change</span></span>
          </button>
        ) : (
          <a href="/restaurants" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
            📍 Pick your city to get started
          </a>
        )}
      </div>
    </div>
  );
}
