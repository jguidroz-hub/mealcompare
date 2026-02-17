'use client';
import Link from 'next/link';

const METROS = [
  { id: 'nyc', label: 'New York', emoji: '🗽', restaurants: '800+' },
  { id: 'chicago', label: 'Chicago', emoji: '🌆', restaurants: '600+' },
  { id: 'la', label: 'Los Angeles', emoji: '🌴', restaurants: '500+' },
  { id: 'sf', label: 'San Francisco', emoji: '🌉', restaurants: '350+' },
  { id: 'boston', label: 'Boston', emoji: '🏛️', restaurants: '350+' },
  { id: 'miami', label: 'Miami', emoji: '🌊', restaurants: '400+' },
  { id: 'dc', label: 'Washington DC', emoji: '🏛️', restaurants: '400+' },
  { id: 'austin', label: 'Austin', emoji: '🤘', restaurants: '300+' },
  { id: 'houston', label: 'Houston', emoji: '🚀', restaurants: '350+' },
  { id: 'atlanta', label: 'Atlanta', emoji: '🍑', restaurants: '350+' },
  { id: 'seattle', label: 'Seattle', emoji: '☕', restaurants: '350+' },
  { id: 'denver', label: 'Denver', emoji: '🏔️', restaurants: '300+' },
  { id: 'philly', label: 'Philadelphia', emoji: '🔔', restaurants: '350+' },
  { id: 'nashville', label: 'Nashville', emoji: '🎸', restaurants: '250+' },
  { id: 'nola', label: 'New Orleans', emoji: '⚜️', restaurants: '250+' },
  { id: 'dallas', label: 'Dallas', emoji: '⛳', restaurants: '350+' },
  { id: 'phoenix', label: 'Phoenix', emoji: '🌵', restaurants: '300+' },
  { id: 'portland', label: 'Portland', emoji: '🌲', restaurants: '250+' },
  { id: 'detroit', label: 'Detroit', emoji: '🚗', restaurants: '250+' },
  { id: 'minneapolis', label: 'Minneapolis', emoji: '❄️', restaurants: '250+' },
  { id: 'charlotte', label: 'Charlotte', emoji: '👑', restaurants: '250+' },
  { id: 'tampa', label: 'Tampa', emoji: '🌞', restaurants: '250+' },
  { id: 'sandiego', label: 'San Diego', emoji: '🏖️', restaurants: '250+' },
  { id: 'stlouis', label: 'St Louis', emoji: '🏗️', restaurants: '250+' },
  { id: 'pittsburgh', label: 'Pittsburgh', emoji: '🌉', restaurants: '250+' },
  { id: 'columbus', label: 'Columbus', emoji: '🏈', restaurants: '200+' },
  { id: 'indianapolis', label: 'Indianapolis', emoji: '🏎️', restaurants: '200+' },
  { id: 'milwaukee', label: 'Milwaukee', emoji: '🍺', restaurants: '200+' },
  { id: 'raleigh', label: 'Raleigh', emoji: '🌳', restaurants: '200+' },
  { id: 'baltimore', label: 'Baltimore', emoji: '🦀', restaurants: '200+' },
];

export default function RestaurantsCityPicker() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>SkipTheFee</span>
          </Link>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Link href="/savings" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>💰 Calculator</Link>
            <Link href="/for-restaurants" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>For Restaurants</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '48px 16px 32px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Choose your <span className="gradient-text">city</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>
            10,000+ restaurants · 8,700+ direct ordering links · 30 cities
          </p>
        </div>
      </div>

      {/* City grid */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 }}>
          {METROS.map(m => (
            <Link
              key={m.id}
              href={`/restaurants/${m.id}`}
              className="glass-card glass-card-hover"
              style={{ padding: '16px 14px', textDecoration: 'none', color: '#e2e8f0', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</span>
              </div>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                {m.restaurants} restaurants
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
          Don&apos;t see your city? We&apos;re expanding fast.
        </p>
        <Link href="/install" className="btn-glow" style={{ padding: '12px 28px', fontSize: 14 }}>
          🧩 Install Extension — Works Everywhere
        </Link>
      </div>
    </main>
  );
}
