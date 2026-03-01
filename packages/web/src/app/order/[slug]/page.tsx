'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CartBuilder from '@/app/components/CartBuilder';

interface Chain {
  name: string;
  slug: string;
  category: string;
  itemCount: number;
}

interface MenuItem {
  name: string;
  category: string;
  basePrice: number;
}

export default function OrderPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [chain, setChain] = useState<Chain | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
    // Fetch chain info and menu
    fetch('/api/menu-compare')
      .then(r => r.json())
      .then(d => {
        const found = (d.chains || []).find((c: Chain) => c.slug === slug);
        setChain(found || null);
        if (found) {
          // Fetch the chain's menu items
          fetch(`/api/menu-compare?chain=${encodeURIComponent(found.name)}&metro=${metro}`)
            .then(r => r.json())
            .then(data => {
              if (data.items) {
                setMenuItems(data.items.map((item: any) => ({
                  name: item.canonicalName,
                  category: item.category,
                  basePrice: item.basePrice,
                })).filter((item: MenuItem) => item.basePrice > 0));
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [slug, metro]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#475569' }}>Loading menu...</p>
        </div>
      </main>
    );
  }

  if (!chain) {
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
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/chains" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}>← Chains</Link>
            <span style={{ color: '#334155' }}>/</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{chain.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>📍</span>
            <select
              value={metro}
              onChange={e => setMetro(e.target.value)}
              style={{
                padding: '6px 10px', borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#e2e8f0', fontSize: 13, cursor: 'pointer',
              }}
            >
              {METROS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
            🧮 {chain.name} — Build Your Order
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            Add items to see the real cost on every delivery platform
          </p>
        </div>

        <CartBuilder
          chainName={chain.name}
          menuItems={menuItems}
          metro={metro}
        />
      </div>
    </main>
  );
}
