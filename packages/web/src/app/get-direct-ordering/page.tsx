'use client';
import Link from 'next/link';

async function trackPlatformClick(platform: string) {
  try {
    await fetch('/api/track-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform }),
    });
  } catch { /* never block UX for tracking */ }
}

const platforms = [
  {
    name: 'Toast',
    logo: '🍞',
    tagline: 'The #1 restaurant POS & online ordering platform',
    pricing: 'Starts free — pay as you grow',
    features: ['Online ordering & delivery', 'POS system', 'Contactless payments', 'Marketing & loyalty', 'Commission-free ordering'],
    cta: 'https://pos.toasttab.com/pricing',
    highlight: 'Most popular — 5,000+ restaurants in our database use Toast',
  },
  {
    name: 'ChowNow',
    logo: '🥡',
    tagline: 'Commission-free online ordering for restaurants',
    pricing: 'From $149/mo',
    features: ['Branded ordering apps', 'Direct Google ordering', 'Marketing automation', 'No commissions on orders', 'Loyalty programs'],
    cta: 'https://get.chownow.com/',
    highlight: 'Great for branded experience',
  },
  {
    name: 'Owner.com',
    logo: '🏪',
    tagline: 'All-in-one restaurant marketing & ordering',
    pricing: 'Custom pricing',
    features: ['Website + online ordering', 'Google & social ads management', 'Automated remarketing', 'Loyalty & rewards', 'AI-powered upsells'],
    cta: 'https://www.owner.com/',
    highlight: 'Best for marketing-focused restaurants',
  },
  {
    name: 'Square Online',
    logo: '⬛',
    tagline: 'Free online ordering integrated with Square POS',
    pricing: 'Free plan available',
    features: ['Online ordering page', 'QR code ordering', 'Delivery via DoorDash integration', 'Instagram & Google integration', 'No monthly fees on free plan'],
    cta: 'https://squareup.com/us/en/online-store/restaurants',
    highlight: 'Best free option — if you already use Square POS',
  },
];

export default function GetDirectOrderingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0' }}>
      {/* Hero */}
      <section style={{ padding: '80px 20px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 14, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          For Restaurant Owners
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
          Stop paying <span style={{ color: '#ef4444' }}>28-33%</span> to delivery apps
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px' }}>
          DoorDash, Uber Eats, and Grubhub charge you up to 33% per order — and often mark up your menu prices to customers. 
          Set up direct ordering and keep the revenue you earn.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 500, margin: '0 auto 48px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>9,300+</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Restaurants in our database</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>7,100+</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>With direct ordering</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>30</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>US cities covered</div>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section style={{ padding: '40px 20px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>
          What delivery apps cost you
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 14 }}>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', marginBottom: 12 }}>🔴 With DoorDash/UberEats</div>
            <ul style={{ paddingLeft: 16, color: '#94a3b8', lineHeight: 2 }}>
              <li>15-30% commission per order</li>
              <li>They own the customer data</li>
              <li>They set the delivery fees</li>
              <li>Menu markups hurt your reputation</li>
              <li>Competing against your own food</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginBottom: 12 }}>🟢 With Direct Ordering</div>
            <ul style={{ paddingLeft: 16, color: '#94a3b8', lineHeight: 2 }}>
              <li>0-5% processing fee</li>
              <li>You own customer relationships</li>
              <li>You control the experience</li>
              <li>Customers see your real prices</li>
              <li>Build repeat business & loyalty</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SkipTheFee pitch */}
      <section style={{ padding: '48px 20px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: '32px 24px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            We send customers directly to you
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 20px' }}>
            SkipTheFee helps thousands of diners find restaurants with direct ordering — so they skip the delivery app fees and order from you instead. 
            Get listed and start receiving customers who <strong style={{ color: '#e2e8f0' }}>want</strong> to order direct.
          </p>
          <Link 
            href="/for-restaurants" 
            style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontWeight: 800, borderRadius: 12, textDecoration: 'none', fontSize: 15 }}
          >
            Claim Your Restaurant →
          </Link>
        </div>
      </section>

      {/* Platform comparison */}
      <section style={{ padding: '48px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
          Choose a direct ordering platform
        </h2>
        <p style={{ fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 32 }}>
          We recommend these platforms based on what thousands of restaurants in our database use
        </p>

        <div style={{ display: 'grid', gap: 20 }}>
          {platforms.map((p) => (
            <div key={p.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
                    {p.logo} {p.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{p.tagline}</div>
                  {p.highlight && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                      ⭐ {p.highlight}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {p.pricing}
                </div>
              </div>

              <ul style={{ marginTop: 16, paddingLeft: 16, fontSize: 13, color: '#94a3b8', lineHeight: 1.8, columns: 2 }}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <a
                href={p.cta}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPlatformClick(p.name)}
                style={{
                  display: 'inline-block', marginTop: 16, padding: '10px 24px',
                  border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10,
                  color: '#10b981', fontWeight: 700, fontSize: 13, textDecoration: 'none',
                }}
              >
                Learn more about {p.name} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '48px 20px 80px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
          Need help choosing?
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
          We&apos;ve helped thousands of restaurants get discovered through direct ordering. 
          Claim your restaurant on SkipTheFee and we&apos;ll help you pick the right platform.
        </p>
        <Link
          href="/for-restaurants"
          style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontWeight: 800, borderRadius: 12, textDecoration: 'none', fontSize: 15 }}
        >
          Claim Your Restaurant →
        </Link>
      </section>
    </main>
  );
}
