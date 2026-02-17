'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ForRestaurants() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>SkipTheFee</span>
          </Link>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link href="/restaurants" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>For Diners</Link>
            <a href="#claim" className="btn-glow" style={{ padding: '8px 20px', fontSize: 13, borderRadius: 10 }}>
              Claim Your Listing
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-glow" style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 100, padding: '6px 18px', fontSize: 13, color: '#3b82f6', fontWeight: 600, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} /> Free for restaurants
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Stop losing <span className="gradient-text">30%</span> to delivery apps
          </h1>

          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            SkipTheFee sends hungry customers <strong style={{ color: '#94a3b8' }}>directly to your website</strong>.
            No commissions. No middlemen. More profit on every order.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#claim" className="btn-glow">
              🏪 Claim Your Restaurant — Free
            </a>
            <a href="#how" className="btn-outline">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            The <span className="gradient-text-warm">delivery app tax</span>
          </h2>
          <p style={{ fontSize: 15, color: '#475569', maxWidth: 500, margin: '0 auto' }}>
            For every $100 in delivery orders, here&apos;s what you actually keep:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600, margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: 28, textAlign: 'center', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ fontSize: 14, color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>Via DoorDash/Uber Eats</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ef4444', letterSpacing: '-0.03em' }}>$67</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              After 28–33% commission
            </div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 12 }}>
              + you lose the customer relationship<br />
              + they might order from your competitor next
            </div>
          </div>
          <div className="glass-card" style={{ padding: 28, textAlign: 'center', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ fontSize: 14, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>Via Direct Ordering</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981', letterSpacing: '-0.03em' }}>$95</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Only ~5% processing fee
            </div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 12 }}>
              + you own the customer data<br />
              + build loyalty, send promos direct
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 15, fontWeight: 600, color: '#f59e0b' }}>
          That&apos;s $28 more per $100 in orders. On $10K/month in delivery? That&apos;s $2,800 back.
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            How <span className="gradient-text">SkipTheFee</span> helps you
          </h2>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {[
            { icon: '🔗', title: 'We link to YOUR ordering system', desc: 'Toast, ChowNow, Square, Popmenu — whatever you use. We deep-link customers straight to your order page.' },
            { icon: '👥', title: 'Thousands of hungry users', desc: 'Our app, Chrome extension, and PWA show users the cheapest way to order — which is usually YOU. Direct ordering saves them 15–30%.' },
            { icon: '💰', title: 'Zero commission, ever', desc: 'We never take a cut of your orders. Your food, your customer, your money. Period.' },
            { icon: '📊', title: 'See your referral traffic', desc: 'Track how many orders we send your way. Real data, real results.' },
            { icon: '⭐', title: 'Featured placement (optional)', desc: 'Want to be the top result in your area? Featured listings start at $29/month. But the basic listing is free forever.' },
          ].map(item => (
            <div key={item.title} className="glass-card glass-card-hover" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', background: 'rgba(16,185,129,0.03)', borderTop: '1px solid rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24, textAlign: 'center' }}>
          {[
            { value: '10,000+', label: 'Restaurants Listed' },
            { value: '30', label: 'Cities Covered' },
            { value: '12+', label: 'Ordering Platforms' },
            { value: '$0', label: 'Cost to Restaurants' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Claim form */}
      <section id="claim" style={{ padding: '80px 24px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Claim your <span className="gradient-text">listing</span>
        </h2>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>
          Already listed? Claim it to verify your info and unlock analytics.
          Not listed? We&apos;ll add you for free.
        </p>

        <ClaimFormComponent />

        <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>
          No credit card. No contracts. No commissions. Ever.
        </p>
      </section>

      {/* Footer */}
      <footer className="status-bar">
        <span><span className="status-dot" />System Online</span>
        <Link href="/">For Diners</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/restaurants">Restaurants</Link>
        <span>© 2026 SkipTheFee</span>
      </footer>
    </main>
  );
}

function ClaimFormComponent() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [restaurant, setRestaurant] = useState('');
  const [city, setCity] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant, city, url, email }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-card" style={{ padding: 36, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Claim submitted!</h3>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          We&apos;ll verify your listing and reach out to <strong style={{ color: '#e2e8f0' }}>{email}</strong> within 24 hours.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0',
    fontSize: 15, outline: 'none' as const, boxSizing: 'border-box' as const,
  };

  return (
    <div className="glass-card" style={{ padding: 28, textAlign: 'left' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Restaurant Name *</label>
          <input value={restaurant} onChange={e => setRestaurant(e.target.value)} required placeholder="e.g. Joe's Pizza" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City *</label>
          <input value={city} onChange={e => setCity(e.target.value)} required placeholder="e.g. New York" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your Direct Ordering URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} type="url" placeholder="https://order.toasttab.com/..." style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="owner@restaurant.com" style={inputStyle} />
        </div>
        <button type="submit" className="btn-glow" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'sending'}>
          {status === 'sending' ? '⏳ Submitting...' : '🏪 Claim My Listing — Free'}
        </button>
        {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8, textAlign: 'center' }}>Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
