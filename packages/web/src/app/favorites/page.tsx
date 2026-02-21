'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllFavorites, toggleFavorite, type Favorite } from '@/lib/favorites';
import { trackPageView } from '@/lib/analytics';

const METRO_NAMES: Record<string, string> = {
  nyc: 'NYC', chicago: 'Chicago', la: 'LA', sf: 'SF', boston: 'Boston', miami: 'Miami',
  dc: 'DC', austin: 'Austin', houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle',
  denver: 'Denver', philly: 'Philly', nashville: 'Nashville', nola: 'NOLA', dallas: 'Dallas',
  phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit', minneapolis: 'Minneapolis',
  charlotte: 'Charlotte', tampa: 'Tampa', sandiego: 'San Diego', stlouis: 'St Louis',
  pittsburgh: 'Pittsburgh', columbus: 'Columbus', indianapolis: 'Indy',
  milwaukee: 'Milwaukee', raleigh: 'Raleigh', baltimore: 'Baltimore',
};

function addUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'eddy');
    u.searchParams.set('ref', 'eddy');
    return u.toString();
  } catch { return url; }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    trackPageView({ page: 'favorites' });
    setFavorites(getAllFavorites());
  }, []);

  const handleRemove = (slug: string, name: string, metro: string) => {
    toggleFavorite(slug, name, metro, null);
    setFavorites(getAllFavorites());
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>Eddy</span>
          </Link>
          <Link href="/restaurants" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>Browse Restaurants</Link>
        </div>
      </header>

      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '36px 16px 24px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Your <span className="gradient-text">Favorites</span> ❤️
          </h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            {favorites.length} saved restaurant{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🤍</p>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>No favorites yet</p>
            <Link href="/restaurants" className="btn-glow" style={{ padding: '10px 24px', fontSize: 14 }}>
              Browse Restaurants
            </Link>
          </div>
        ) : (
          favorites.map(fav => (
            <div key={`${fav.slug}-${fav.metro}`} className="glass-card glass-card-hover" style={{ padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{fav.name}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>
                    📍 {METRO_NAMES[fav.metro] || fav.metro}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {fav.directUrl && (
                    <a href={addUtm(fav.directUrl)} target="_blank" rel="noopener noreferrer" style={{
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white', padding: '8px 14px', borderRadius: 10,
                      fontSize: 12, fontWeight: 700, textDecoration: 'none',
                    }}>
                      Order Direct
                    </a>
                  )}
                  <button onClick={() => handleRemove(fav.slug, fav.name, fav.metro)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4,
                  }}>
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
