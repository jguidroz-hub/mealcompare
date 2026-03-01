'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MenuComparison from '@/app/components/MenuComparison';

export default function ChainDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [chainName, setChainName] = useState('');
  const [metro, setMetro] = useState('austin');
  const [loading, setLoading] = useState(true);

  const METROS = [
    { value: 'austin', label: 'Austin' },
    { value: 'nyc', label: 'New York' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'houston', label: 'Houston' },
    { value: 'dallas', label: 'Dallas' },
    { value: 'atlanta', label: 'Atlanta' },
    { value: 'miami', label: 'Miami' },
    { value: 'dc', label: 'Washington DC' },
    { value: 'denver', label: 'Denver' },
    { value: 'seattle', label: 'Seattle' },
    { value: 'boston', label: 'Boston' },
    { value: 'phoenix', label: 'Phoenix' },
    { value: 'sf', label: 'San Francisco' },
  ];

  useEffect(() => {
    // Resolve chain name from slug
    fetch('/api/menu-compare')
      .then(r => r.json())
      .then(d => {
        const chain = (d.chains || []).find((c: any) => c.slug === slug);
        if (chain) setChainName(chain.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </main>
    );
  }

  if (!chainName) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🍽️</p>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>Chain not found</p>
          <Link href="/chains" className="btn-glow" style={{ padding: '10px 24px', fontSize: 14 }}>
            Browse all chains
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/chains" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}>← All Chains</Link>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{chainName}</span>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {chainName} — Menu Prices
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8' }}>
            Item-by-item delivery app markup comparison
          </p>
        </div>

        {/* Metro selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>📍 City:</span>
          <select
            value={metro}
            onChange={e => setMetro(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {METROS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Key forces re-mount on metro change */}
        <MenuComparison key={`${chainName}-${metro}`} restaurantName={chainName} metro={metro} />

        {/* Direct ordering CTA */}
        <div className="glass-card" style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#10b981' }}>
            🏪 Skip the markup — order direct
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 }}>
            Most chains have their own ordering websites with lower prices and no service fees.
            Check {chainName}&apos;s website for direct ordering.
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(chainName + ' order online direct')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow"
            style={{ display: 'inline-block', padding: '12px 24px', fontSize: 14 }}
          >
            Find {chainName} Direct Ordering →
          </a>
        </div>
      </div>
    </main>
  );
}
