'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { trackPageView, trackOrderClick } from '@/lib/analytics';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

const CATEGORY_MAP: Record<string, { emoji: string; label: string }> = {
  pizza: { emoji: '🍕', label: 'Pizza' }, mexican: { emoji: '🌮', label: 'Mexican' },
  chinese: { emoji: '🥡', label: 'Chinese' }, burgers: { emoji: '🍔', label: 'Burgers' },
  thai: { emoji: '🍜', label: 'Thai' }, indian: { emoji: '🍛', label: 'Indian' },
  japanese: { emoji: '🍣', label: 'Japanese' }, italian: { emoji: '🍝', label: 'Italian' },
  bbq: { emoji: '🔥', label: 'BBQ' }, seafood: { emoji: '🦞', label: 'Seafood' },
  wings: { emoji: '🍗', label: 'Wings' }, breakfast: { emoji: '🥞', label: 'Breakfast' },
  cafe: { emoji: '☕', label: 'Café' }, korean: { emoji: '🥘', label: 'Korean' },
  mediterranean: { emoji: '🧆', label: 'Mediterranean' }, deli: { emoji: '🥪', label: 'Deli' },
  poke: { emoji: '🐟', label: 'Poké' }, bakery: { emoji: '🧁', label: 'Bakery' },
  vietnamese: { emoji: '🍲', label: 'Vietnamese' }, steakhouse: { emoji: '🥩', label: 'Steakhouse' },
  southern: { emoji: '🍗', label: 'Southern' }, chicken: { emoji: '🍗', label: 'Chicken' },
  healthy: { emoji: '🥗', label: 'Healthy' }, vegan: { emoji: '🌱', label: 'Vegan' },
  dessert: { emoji: '🍦', label: 'Dessert' }, tea: { emoji: '🧋', label: 'Tea & Boba' },
  juice: { emoji: '🧃', label: 'Juice' }, latin: { emoji: '🫔', label: 'Latin' },
  restaurant: { emoji: '🍽️', label: 'Restaurant' },
};

const METRO_NAMES: Record<string, string> = {
  nyc: 'New York', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans', dallas: 'Dallas',
  phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit', minneapolis: 'Minneapolis',
  charlotte: 'Charlotte', tampa: 'Tampa', sandiego: 'San Diego', stlouis: 'St Louis',
  pittsburgh: 'Pittsburgh', columbus: 'Columbus', indianapolis: 'Indianapolis',
  milwaukee: 'Milwaukee', raleigh: 'Raleigh', baltimore: 'Baltimore',
};

// Removed fake per-restaurant savings function

function addUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'eddy');
    u.searchParams.set('ref', 'eddy');
    return u.toString();
  } catch { return url; }
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const metro = (params?.metro as string) || 'nyc';
  const slug = (params?.slug as string) || '';
  const cityName = METRO_NAMES[metro] || metro;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [similar, setSimilar] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    trackPageView({ metro, slug, page: 'restaurant_detail' });
    fetch(`/api/restaurants?metro=${metro}`)
      .then(r => r.json())
      .then(data => {
        const rs: Restaurant[] = data.restaurants || [];
        const match = rs.find(r => r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') === slug);
        setRestaurant(match || null);
        if (match) {
          setSimilar(rs.filter(r => r.category === match.category && r.name !== match.name && r.directUrl).slice(0, 6));
          setFaved(isFavorite(slug, metro));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [metro, slug]);

  // No fake per-restaurant savings — we don't have actual price data

  const platform = restaurant?.hasToast ? 'Toast' : restaurant?.hasSquare ? 'Square' : 'Direct';
  const catInfo = CATEGORY_MAP[(restaurant?.category || 'restaurant').toLowerCase()] || { emoji: '🍽️', label: 'Restaurant' };

  const handleFav = () => {
    if (!restaurant) return;
    const added = toggleFavorite(slug, restaurant.name, metro, restaurant.directUrl);
    setFaved(added);
  };

  const handleOrder = () => {
    if (!restaurant?.directUrl) return;
    trackOrderClick(restaurant.name, metro, platform.toLowerCase(), restaurant.directUrl);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant: restaurant.name, slug, metro, source: 'detail', directUrl: restaurant.directUrl }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#475569' }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🍽️</p>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>Restaurant not found</p>
          <Link href={`/restaurants/${metro}`} className="btn-glow" style={{ padding: '10px 24px', fontSize: 14 }}>
            Browse {cityName} restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/restaurants/${metro}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            ← {cityName}
          </Link>
          <button onClick={handleFav} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>
            {faved ? '❤️' : '🤍'}
          </button>
        </div>
      </header>

      {/* Restaurant info */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{catInfo.emoji}</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>{restaurant.name}</h1>
          <div style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>{catInfo.label}</span>
            <span>·</span>
            <span>📍 {cityName}</span>
            {restaurant.directUrl && (
              <>
                <span>·</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>via {platform}</span>
              </>
            )}
          </div>
        </div>

        {/* Why order direct — honest, no fake numbers */}
        {restaurant.directUrl && (
          <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 12 }}>
              Why order direct?
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
              Delivery apps typically charge restaurants 28-33%, which often gets passed to you as higher menu prices. They also add service fees ($2-10) and delivery fees ($2-8).
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginTop: 8 }}>
              Ordering direct through <strong style={{ color: '#10b981' }}>{platform}</strong> means you pay the restaurant&apos;s actual prices — no middleman markup. Not every restaurant marks up on apps, but the platform fees alone can add $5-15 to your order.
            </div>
          </div>
        )}

        {/* Order CTA */}
        {restaurant.directUrl ? (
          <a
            href={addUtm(restaurant.directUrl)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOrder}
            className="btn-glow"
            style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '16px 24px', fontSize: 16, marginBottom: 20 }}
          >
            🏪 Order Direct — Skip the Fees
          </a>
        ) : (
          <div className="glass-card" style={{ padding: 20, textAlign: 'center', marginBottom: 20 }}>
            <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              This restaurant doesn&apos;t have direct ordering yet
            </p>
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              They could save their customers money and keep more of every order by setting up direct ordering.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/get-direct-ordering" style={{ padding: '10px 20px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10b981', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                🏪 Are you the owner? Get direct ordering
              </Link>
              <Link href="/for-restaurants" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#64748b', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                Know their ordering URL? Submit it
              </Link>
            </div>
          </div>
        )}

        {/* How fees work — industry averages, not per-restaurant claims */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>How delivery app fees typically work</h3>
          <p style={{ fontSize: 11, color: '#475569', marginBottom: 12 }}>Industry averages — actual fees vary by restaurant and platform</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <div>
              <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>🔴 Via delivery apps</div>
              <ul style={{ paddingLeft: 16, color: '#64748b', lineHeight: 1.7 }}>
                <li>Some restaurants mark up menus</li>
                <li>$2-10 service fee</li>
                <li>$2-8 delivery fee</li>
                <li>Possible small order fee</li>
              </ul>
            </div>
            <div>
              <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 4 }}>🟢 Direct via {platform}</div>
              <ul style={{ paddingLeft: 16, color: '#64748b', lineHeight: 1.7 }}>
                <li>Restaurant&apos;s own prices</li>
                <li>No service fee</li>
                <li>Usually lower delivery fee</li>
                <li>Restaurant keeps more</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar restaurants */}
        {similar.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              More {catInfo.label.toLowerCase()} in {cityName}
            </h3>
            {similar.map((r, i) => {
              const rSlug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
              return (
                <Link
                  key={`${r.name}-${i}`}
                  href={`/restaurant/${metro}/${rSlug}`}
                  className="glass-card glass-card-hover"
                  style={{ padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: '#e2e8f0' }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#10b981' }}>Order direct</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Order Direct →</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Restaurant owner CTA */}
        <div className="glass-card" style={{ padding: 20, marginTop: 24, textAlign: 'center', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Own this restaurant?</p>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Claim your listing to verify info and get analytics</p>
          <Link href="/for-restaurants" style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            🏪 Claim Your Listing — Free →
          </Link>
        </div>
      </div>
    </main>
  );
}
