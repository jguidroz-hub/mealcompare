'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Chain {
  name: string;
  slug: string;
  category: string;
  itemCount: number;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  burgers: '🍔', chicken: '🍗', mexican: '🌮', pizza: '🍕',
  sandwiches: '🥪', cafe: '☕', wings: '🍗', chinese: '🥡',
  mediterranean: '🧆', healthy: '🥗', restaurant: '🍽️',
};

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/menu-compare')
      .then(r => r.json())
      .then(d => {
        setChains(d.chains || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(chains.map(c => c.category))];
  const filtered = filter === 'all' ? chains : chains.filter(c => c.category === filter);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}>← Home</Link>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>Chain Menu Prices</span>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            🔍 Chain Menu Price Comparison
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
            See exactly how much delivery apps mark up your favorite chains. Item-by-item, no guessing.
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: filter === cat ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                background: filter === cat ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                color: filter === cat ? '#10b981' : '#94a3b8',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {CATEGORY_EMOJIS[cat] ?? ''} {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#475569' }}>Loading chains...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {filtered.map(chain => (
              <Link
                key={chain.slug}
                href={`/chains/${chain.slug}`}
                className="glass-card glass-card-hover"
                style={{ padding: 16, textDecoration: 'none', color: '#e2e8f0', display: 'block' }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>
                  {CATEGORY_EMOJIS[chain.category] ?? '🍽️'}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{chain.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {chain.itemCount} items tracked · {chain.category}
                </div>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 8 }}>
                  Compare prices →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* SEO / info */}
        <div className="glass-card" style={{ padding: 24, marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>How It Works</h2>
          <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
            <p>Eddy tracks menu prices across delivery platforms for the top {chains.length} chains in real time.</p>
            <p style={{ marginTop: 8 }}>
              We compare each item&apos;s delivery app price against the typical in-store price so you can see exactly how much you&apos;re paying extra.
              Some chains don&apos;t mark up their menus on apps — but <strong>most do by 10-30%</strong>, and that&apos;s before the delivery fee, service fee, and tip.
            </p>
            <p style={{ marginTop: 8 }}>
              The takeaway? <strong style={{ color: '#10b981' }}>Order direct when you can.</strong> You&apos;ll pay the restaurant&apos;s real prices and they&apos;ll keep more of your money instead of giving 30% to the app.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
