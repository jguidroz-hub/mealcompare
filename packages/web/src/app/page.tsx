import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SkipTheFee — Stop Overpaying for Food Delivery',
  description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering. See delivery fees, service fees, and menu markups. Save $5-15 on every order.',
  openGraph: {
    title: 'SkipTheFee — Stop Overpaying for Food Delivery',
    description: 'The same order. Different prices. Find the cheapest way to get your food delivered.',
    type: 'website',
    url: 'https://skipthefee.app',
  },
};

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💰</span>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>SkipTheFee</span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="#how" className="desktop-only" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' }}>How It Works</a>
            <a href="#fees" className="desktop-only" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Hidden Fees</a>
            <Link href="/savings" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>💰 Calculator</Link>
            <Link href="/restaurants" style={{ color: '#10b981', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Restaurants</Link>
            <Link href="/favorites" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>❤️</Link>
            <Link href="/for-restaurants" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>For Restaurants</Link>
            <Link href="/install" className="btn-glow" style={{ padding: '8px 20px', fontSize: 13, borderRadius: 10 }}>
              Install Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-glow hero-section" style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <div className="fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 100, padding: '6px 18px', fontSize: 13, color: '#10b981', fontWeight: 600, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Average savings: $5–15 per order
          </div>

          <h1 className="hero-title" style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Stop overpaying for{' '}
            <span className="gradient-text">food delivery</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px' }}>
            The same order costs different amounts on every platform. SkipTheFee shows you the cheapest option — including{' '}
            <span style={{ color: '#94a3b8' }}>direct ordering</span> — in one click.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/install" className="btn-glow">
              🧩 Install Extension — Free
            </Link>
            <Link href="/restaurants" className="btn-outline">
              Browse Restaurants
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#334155', marginTop: 20, fontWeight: 500 }}>
            30 cities · 10,000+ restaurants · 8,700+ direct ordering links
          </p>
        </div>
      </section>

      {/* Live Comparison Card */}
      <section className="comparison-card" style={{ maxWidth: 560, margin: '0 auto 100px', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real comparison</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>📍 Chipotle — 3 items</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1 }}>$12.10</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>saved</div>
              </div>
            </div>
          </div>

          {/* Quotes */}
          <div style={{ padding: '12px 16px 16px' }}>
            <QuoteRow name="Direct Order" total="$46.08" fees="No markup · Delivery: $4.99" tag="BEST" tagColor="#10b981" icon="🏪" best />
            <QuoteRow name="Grubhub" total="$55.12" fees="Service: $4.93 · Delivery: $4.99" tag="+$9.04" tagColor="#ef4444" icon="🟠" />
            <QuoteRow name="Uber Eats" total="$58.18" fees="Service: $6.38 · Delivery: $4.99" tag="+$12.10" tagColor="#ef4444" icon="🟢" />
            <QuoteRow name="DoorDash" total="$57.43" fees="Service: $5.87 · Delivery: $3.99" tag="+$11.35" tagColor="#ef4444" icon="🔴" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="section-title" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            How it <span className="gradient-text">works</span>
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 500, margin: '0 auto' }}>
            SkipTheFee runs in the background. Zero extra steps.
          </p>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { num: '01', icon: '🛒', title: 'Add to cart', desc: 'Browse DoorDash, Uber Eats, or Grubhub. Shop like normal.' },
            { num: '02', icon: '⚡', title: 'Auto-compare', desc: 'SkipTheFee detects your cart and checks every platform + direct ordering.' },
            { num: '03', icon: '📊', title: 'See all fees', desc: 'Full cost breakdown: food + markup + service fee + delivery + tax.' },
            { num: '04', icon: '💰', title: 'Switch & save', desc: 'One click to order on the cheaper platform. Deep links pre-fill your cart.' },
          ].map((step) => (
            <div key={step.num} className="glass-card glass-card-hover" style={{ padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', marginBottom: 16 }}>{step.num}</div>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{step.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hidden Fees */}
      <section id="fees" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
              The fees they <span className="gradient-text-warm">don&apos;t show you</span>
            </h2>
            <p style={{ fontSize: 16, color: '#475569' }}>
              Here&apos;s what delivery apps actually charge — beyond the menu price.
            </p>
          </div>

          <div className="fee-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Menu Markup', value: '15–20%', desc: 'Platforms charge restaurants 28–33%. Restaurants raise menu prices to cover it.', color: '#ef4444' },
              { label: 'Service Fee', value: '$2–10', desc: 'A % of your subtotal. Goes to the platform — not your driver or restaurant.', color: '#f59e0b' },
              { label: 'Delivery Fee', value: '$2–8', desc: 'Varies by distance and demand. Surge pricing is real.', color: '#8b5cf6' },
              { label: 'Small Order Fee', value: '$2–3', desc: 'Under $12? You get surcharged. Direct ordering has no minimum.', color: '#ec4899' },
            ].map((fee) => (
              <div key={fee.label} className="glass-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: fee.color, marginBottom: 4, letterSpacing: '-0.02em' }}>{fee.value}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{fee.label}</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{fee.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 15, color: '#94a3b8', fontWeight: 500 }}>
            <strong style={{ color: '#10b981' }}>Ordering direct saves 20–30% on average.</strong>{' '}
            SkipTheFee finds the link for you.
          </p>
        </div>
      </section>

      {/* Real Savings */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Real savings, <span className="gradient-text">real orders</span>
          </h2>
          <p style={{ fontSize: 14, color: '#475569' }}>Actual comparisons from supported cities.</p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { restaurant: 'Chipotle (Family, 3 items)', city: 'DC', savings: '$12.10', best: 'Direct', worst: 'Uber Eats' },
            { restaurant: 'Whataburger (#1 Combo)', city: 'Austin', savings: '$4.87', best: 'Direct', worst: 'DoorDash' },
            { restaurant: 'CAVA (Bowl + Pita Chips)', city: 'DC', savings: '$6.23', best: 'Grubhub', worst: 'Uber Eats' },
            { restaurant: "Torchy's Tacos (2 tacos + queso)", city: 'Austin', savings: '$5.40', best: 'Direct', worst: 'Uber Eats' },
          ].map((ex) => (
            <div key={ex.restaurant} className="glass-card glass-card-hover savings-card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.restaurant}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>📍 {ex.city} · Best: {ex.best}</div>
              </div>
              <div className="savings-badge" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '6px 14px', flexShrink: 0 }}>
                <span style={{ fontWeight: 800, color: '#10b981', fontSize: 14 }}>{ex.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: 650, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48 }}>
          FAQ
        </h2>
        {[
          { q: 'Is it really free?', a: 'Yes. The app, extension, and restaurant listings are free. We offer optional featured placement for restaurants ($29/mo) — that\'s how we keep the lights on.' },
          { q: 'How do you get the prices?', a: 'Public APIs and menu data. Uber Eats prices come from their API. DoorDash and Grubhub are estimated from known fee models and verified with real orders.' },
          { q: 'What cities?', a: '30 cities including NYC, Chicago, LA, SF, Boston, Miami, DC, Austin, Houston, Atlanta, Seattle, Denver, Dallas, Phoenix, Portland, Nashville, New Orleans, and more. 10,000+ restaurants with 8,700+ direct ordering links.' },
          { q: 'What is "direct ordering"?', a: "Many restaurants let you order delivery through their own website (Toast, Square, etc.). No 28-33% platform commission = 10-20% cheaper for you." },
          { q: 'DashPass / Uber One / GH+ support?', a: 'Coming soon. Currently compares standard (non-subscriber) pricing.' },
        ].map((faq) => (
          <div key={faq.q} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#e2e8f0' }}>{faq.q}</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="bg-glow" style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="bottom-cta-title" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Start <span className="gradient-text">saving</span> today
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 440, margin: '0 auto 32px' }}>
            Free forever. No account. Install and save on your next order.
          </p>
          <Link href="/install" className="btn-glow">
            🧩 Install Chrome Extension — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="status-bar">
        <span><span className="status-dot" />System Online</span>
        <a href="mailto:hello@skipthefee.app">Contact</a>
        <Link href="/privacy">Privacy</Link>
        <Link href="/restaurants">Restaurants</Link>
        <span>© 2026 SkipTheFee</span>
      </footer>
    </main>
  );
}

function QuoteRow({ name, total, fees, tag, tagColor, icon, best }: {
  name: string; total: string; fees: string; tag: string; tagColor: string; icon: string; best?: boolean;
}) {
  return (
    <div className="quote-row" style={{
      background: best ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 6,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: best ? '1px solid rgba(16,185,129,0.15)' : '1px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <div className="quote-name" style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div className="quote-fees" style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fees}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
        <div className="quote-total" style={{ fontWeight: 700, fontSize: 15 }}>{total}</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: tagColor, padding: '2px 6px', borderRadius: 4 }}>{tag}</span>
      </div>
    </div>
  );
}
