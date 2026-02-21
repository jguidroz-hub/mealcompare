'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function SavingsCalculator() {
  const [ordersPerWeek, setOrdersPerWeek] = useState(3);
  const [avgOrder, setAvgOrder] = useState(35);

  const savings = useMemo(() => {
    const avgFeeRate = 0.22; // avg 22% extra on delivery apps (markup + service + delivery)
    const perOrder = avgOrder * avgFeeRate;
    const weekly = perOrder * ordersPerWeek;
    const monthly = weekly * 4.33;
    const yearly = monthly * 12;
    return { perOrder: perOrder.toFixed(2), weekly: weekly.toFixed(0), monthly: monthly.toFixed(0), yearly: yearly.toFixed(0) };
  }, [ordersPerWeek, avgOrder]);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>Eddy</span>
          </Link>
          <Link href="/restaurants" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>Browse Restaurants</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '48px 16px 32px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            How much are you <span className="gradient-text-warm">overpaying?</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
            Delivery apps charge 15–35% more than ordering direct. See what that costs you.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
        <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
          {/* Orders per week */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Orders per week</label>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>{ordersPerWeek}</span>
            </div>
            <input
              type="range" min={1} max={10} step={1}
              value={ordersPerWeek}
              onChange={(e) => setOrdersPerWeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 4 }}>
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>

          {/* Average order */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Average order total</label>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#3b82f6' }}>${avgOrder}</span>
            </div>
            <input
              type="range" min={15} max={80} step={5}
              value={avgOrder}
              onChange={(e) => setAvgOrder(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 4 }}>
              <span>$15</span><span>$45</span><span>$80</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 4 }}>
              You&apos;re overpaying by
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '20px 16px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Per Order</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>${savings.perOrder}</div>
            </div>
            <div style={{ padding: '20px 16px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Monthly</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>${savings.monthly}</div>
            </div>
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Yearly</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>${savings.yearly}</div>
            </div>
          </div>

          {/* Big yearly number */}
          <div style={{ padding: '28px 24px', textAlign: 'center', background: 'rgba(16,185,129,0.04)' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981', letterSpacing: '-0.03em', marginBottom: 4 }}>
              ${savings.yearly}
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              saved per year by ordering direct
            </div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 8 }}>
              That&apos;s {Math.round(Number(savings.yearly) / avgOrder)} free meals! 🎉
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Where the fees hide</h3>
          {[
            { label: 'Menu markup', pct: '15–20%', desc: 'Apps charge restaurants 28–33%. They raise prices to cover it.', color: '#ef4444' },
            { label: 'Service fee', pct: '5–15%', desc: 'Goes to the platform. Not your driver. Not the restaurant.', color: '#f59e0b' },
            { label: 'Delivery fee', pct: '$2–8', desc: 'Varies by distance and surge pricing.', color: '#8b5cf6' },
            { label: 'Small order fee', pct: '$2–3', desc: 'Order under $12? Extra surcharge.', color: '#ec4899' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: f.color }}>{f.pct}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link href="/restaurants" className="btn-glow" style={{ marginBottom: 12 }}>
            🍽️ Find Direct Ordering Near You
          </Link>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 12 }}>
            Or <Link href="/install" style={{ color: '#10b981' }}>install the extension</Link> for auto-compare on every order
          </p>
        </div>
      </div>
    </main>
  );
}
