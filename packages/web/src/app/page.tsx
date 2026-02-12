import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MealCompare — Stop Overpaying for Food Delivery',
  description: 'Compare prices across DoorDash, Uber Eats, Grubhub & direct ordering. Save $5-15 on every order. Free Chrome extension.',
  openGraph: {
    title: 'MealCompare — Stop Overpaying for Food Delivery',
    description: 'The same order. Different prices. Find the cheapest way to get your food delivered.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px' }}>🍔</span>
          <span style={{ fontSize: '20px', fontWeight: 800 }}>MealCompare</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>How It Works</a>
          <a href="#savings" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Savings</a>
          <a href="#" style={{ background: '#10b981', color: 'white', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Add to Chrome — Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1e293b', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#10b981', fontWeight: 600, marginBottom: '24px' }}>
          💰 Average savings: $5-15 per order
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Stop Overpaying for<br />Food Delivery
        </h1>
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 40px' }}>
          The same order costs different amounts on every platform. MealCompare shows you the cheapest option — including direct ordering — in one click.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{ background: '#10b981', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            🧩 Add to Chrome — It&apos;s Free
          </a>
          <a href="#how-it-works" style={{ background: '#1e293b', color: '#e2e8f0', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '16px', border: '1px solid #334155' }}>
            See How It Works
          </a>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', marginTop: '16px' }}>Available in Austin, TX and Washington, DC</p>
      </section>

      {/* Live Example */}
      <section style={{ maxWidth: '640px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Comparing prices for</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>📍 Chipotle — 3 items</div>
            </div>
            <div style={{ background: '#10b981', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>$12.10</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>saved</div>
            </div>
          </div>

          {[
            { name: 'Direct Order', total: '$46.08', service: '$0', delivery: '$4.99', tag: 'BEST PRICE', tagColor: '#10b981', icon: '🏪' },
            { name: 'Grubhub', total: '$55.12', service: '$4.93', delivery: '$4.99', tag: '+$9.04', tagColor: '#ef4444', icon: '🟠' },
            { name: 'Uber Eats', total: '$58.18', service: '$6.38', delivery: '$4.99', tag: '+$12.10', tagColor: '#ef4444', icon: '🟢' },
          ].map((q, i) => (
            <div key={i} style={{ background: i === 0 ? 'rgba(16, 185, 129, 0.1)' : '#0f172a', borderRadius: '10px', padding: '14px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>{q.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{q.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Service: {q.service} · Delivery: {q.delivery}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{q.total}</div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'white', background: q.tagColor, padding: '2px 6px', borderRadius: '4px' }}>{q.tag}</span>
              </div>
            </div>
          ))}
          <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center', marginTop: '12px' }}>
            Real prices from live comparison · Washington, DC
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { step: '1', icon: '🛒', title: 'Browse & Add to Cart', desc: 'Shop on DoorDash, Uber Eats, or Grubhub like you normally would. Add your items to the cart.' },
            { step: '2', icon: '⚡', title: 'Instant Comparison', desc: 'MealCompare automatically checks the same order on every other platform — including direct restaurant ordering.' },
            { step: '3', icon: '💰', title: 'Switch & Save', desc: 'See exactly how much you\'d save. One click takes you to the cheapest option with your order ready.' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{s.icon}</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, marginBottom: '8px' }}>STEP {s.step}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Prices Differ */}
      <section id="savings" style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '16px' }}>Why You&apos;re Overpaying</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '16px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Delivery platforms charge restaurants 28-33% commission. Restaurants pass that cost to you through higher menu prices, service fees, and hidden markups.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {[
            { label: 'Menu Markup', value: '10-15%', desc: 'Restaurants charge more on delivery apps to offset platform commissions' },
            { label: 'Service Fee', value: '$2-8', desc: 'Platform fee on top of your food cost — varies by order size and demand' },
            { label: 'Delivery Fee', value: '$0-8', desc: 'Changes based on distance, demand, and whether you have a subscription' },
            { label: 'Small Order Fee', value: '$2-3', desc: 'Penalty for orders under $10-15 — most people don\'t even notice it' },
          ].map((fee, i) => (
            <div key={i} style={{ background: '#1e293b', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{fee.label}</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>{fee.value}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{fee.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 80px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Start Saving on Every Order</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px' }}>Free Chrome extension. No account needed. Works instantly.</p>
        <a href="#" style={{ background: '#10b981', color: 'white', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '18px', display: 'inline-block' }}>
          Add to Chrome — Free
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#475569' }}>
          © 2026 MealCompare · Prices are estimates and may vary · Not affiliated with DoorDash, Uber Eats, or Grubhub
        </p>
      </footer>
    </main>
  );
}
