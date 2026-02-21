import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works — Eddy',
  description: 'Learn how Eddy helps you save $5-15 per order by finding direct ordering links for restaurants in your city.',
  openGraph: {
    title: 'How Eddy Works',
    description: 'Skip delivery app fees. Order directly from restaurants and save.',
  },
};

export default function HowItWorksPage() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            ← Home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>How It Works</h1>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40, lineHeight: 1.7 }}>
          Eddy finds direct ordering links for your favorite restaurants so you pay restaurant prices — not delivery app prices.
        </p>

        {/* Steps */}
        {[
          { num: '1', emoji: '🔍', title: 'Find Your Restaurant', desc: 'Browse 9,000+ restaurants across 30 cities. Search by name, cuisine, or neighborhood.' },
          { num: '2', emoji: '🏪', title: 'Click "Order Direct"', desc: 'We link you to the restaurant\'s own ordering system — Toast, ChowNow, Square, or their website.' },
          { num: '3', emoji: '💰', title: 'Save $5-15 Per Order', desc: 'No service fees, no inflated menu prices, no hidden charges. The restaurant keeps more too.' },
        ].map(step => (
          <div key={step.num} className="glass-card" style={{ padding: 24, marginBottom: 16, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {step.emoji}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>STEP {step.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          </div>
        ))}

        {/* The Problem */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>The Problem With Delivery Apps</h2>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <h4 style={{ color: '#ef4444', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🔴 Ordering via DoorDash</h4>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 2 }}>
                  <div>Menu price: <span style={{ textDecoration: 'line-through' }}>$12.99</span> → $15.49</div>
                  <div>Service fee: $3.49</div>
                  <div>Delivery fee: $4.99</div>
                  <div>Small order fee: $2.00</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, marginTop: 8, color: '#ef4444', fontWeight: 700, fontSize: 16 }}>Total: $25.97</div>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#10b981', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🟢 Ordering Direct (Toast)</h4>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 2 }}>
                  <div>Menu price: $12.99</div>
                  <div>Service fee: $0.00</div>
                  <div>Delivery fee: $2.99</div>
                  <div>Small order fee: $0.00</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, marginTop: 8, color: '#10b981', fontWeight: 700, fontSize: 16 }}>Total: $15.98</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, padding: '12px 0', background: 'rgba(16,185,129,0.05)', borderRadius: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>You save $9.99</span>
              <span style={{ fontSize: 13, color: '#64748b', marginLeft: 8 }}>on this one order</span>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Platforms We Index</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            We find ordering links from 12+ restaurant ordering platforms:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Toast', 'ChowNow', 'Square', 'Popmenu', 'Owner.com', 'Menufy', 'Olo', 'Slice', 'BentoBox', 'GloriaFood', 'Clover', 'EZCater'].map(p => (
              <span key={p} className="glass-card" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>{p}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Link href="/restaurants" className="btn-glow" style={{ padding: '14px 32px', fontSize: 16 }}>
            🍽️ Find Restaurants in Your City
          </Link>
        </div>
      </div>
    </main>
  );
}
