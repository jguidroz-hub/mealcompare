import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSearch from './components/HeroSearch';

export const metadata: Metadata = {
  title: 'SkipTheFee — Stop Overpaying for Food Delivery',
  description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering. See real fees. Save $5–15 on every order.',
  openGraph: {
    title: 'SkipTheFee — Stop Overpaying for Food Delivery',
    description: 'The same order. Different prices. Find the cheapest way to get your food.',
    type: 'website',
    url: 'https://skipthefee.app',
  },
};

const C = {
  red: '#C62828',
  black: '#0B0B0B',
  card: '#111111',
  border: '#1E1E1E',
  gold: '#F4A300',
  paleYellow: '#FFF4B5',
  white: '#FFFFFF',
  muted: '#6B6B6B',
  mutedLight: '#9B9B9B',
};

export default function Home() {
  return (
    <main style={{ background: C.black, color: C.white, minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,11,11,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
              Skip<span style={{ color: C.red }}>TheFee</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Link href="/how-it-works" className="desktop-only" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'color 0.15s' }}>How It Works</Link>
            <Link href="/restaurants" style={{ color: C.mutedLight, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>Restaurants</Link>
            <Link href="/for-restaurants" className="desktop-only" style={{ color: C.mutedLight, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>For Restaurants</Link>
            <Link href="/install" style={{
              marginLeft: 8,
              background: C.red, color: C.white,
              padding: '8px 20px', borderRadius: 8,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'background 0.15s',
            }}>
              Install Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section bg-glow" style={{ textAlign: 'center', padding: '96px 24px 72px', maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        <div className="fade-in-up" style={{ position: 'relative', zIndex: 1 }}>

          {/* Alert badge */}
          <div className="badge-red" style={{ display: 'inline-flex', marginBottom: 32 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, animation: 'pulse 2s infinite' }} />
            DoorDash charges up to 30% extra per order
          </div>

          <h1 className="hero-title" style={{
            fontSize: 60, fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.04em', marginBottom: 24,
          }}>
            Stop leaving{' '}
            <span style={{ color: C.gold }}>$12</span>
            {' '}on the table<br />every time you order
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 18, color: C.mutedLight, lineHeight: 1.7,
            maxWidth: 540, margin: '0 auto 44px',
          }}>
            SkipTheFee compares DoorDash, Uber Eats, Grubhub,
            and direct restaurant ordering — and shows you the cheapest option in seconds.
          </p>

          <HeroSearch />

          {/* City quick links */}
          <div style={{ maxWidth: 500, margin: '0 auto 32px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'nyc', label: '🗽 NYC' },
              { id: 'chicago', label: '🌆 Chicago' },
              { id: 'la', label: '🌴 LA' },
              { id: 'sf', label: '🌉 SF' },
              { id: 'miami', label: '🌊 Miami' },
              { id: 'austin', label: '🤘 Austin' },
              { id: 'dc', label: '🏛️ DC' },
              { id: 'seattle', label: '☕ Seattle' },
            ].map(c => (
              <Link key={c.id} href={`/restaurants/${c.id}`} className="pill">{c.label}</Link>
            ))}
            <Link href="/restaurants" style={{
              background: 'rgba(244,163,0,0.1)', border: `1px solid rgba(244,163,0,0.25)`,
              borderRadius: 100, padding: '6px 14px', fontSize: 13,
              color: C.gold, textDecoration: 'none', fontWeight: 700,
            }}>
              All 30 cities →
            </Link>
          </div>

          <div className="hero-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/install" className="btn-primary">
              🧩 Install Extension — Free
            </Link>
            <Link href="/for-restaurants" className="btn-outline">
              🏪 I Own a Restaurant
            </Link>
          </div>

          <p style={{ fontSize: 13, color: C.muted, marginTop: 20 }}>
            9,300+ restaurants · 30 cities · No account required
          </p>
        </div>
      </section>

      {/* ── COMPARISON CARD ── */}
      <section className="comparison-card" style={{ maxWidth: 540, margin: '0 auto 100px', padding: '0 24px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Live comparison</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>📍 Chipotle — 3 items</div>
            </div>
            <div style={{ background: C.gold, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.black, lineHeight: 1 }}>$12.10</div>
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.6)', marginTop: 2, fontWeight: 600 }}>you save</div>
            </div>
          </div>
          <div style={{ padding: '12px 14px 14px' }}>
            <QuoteRow icon="🏪" name="Direct Order" total="$46.08" fees="No markup · Delivery: $4.99" tag="BEST" tagBg={C.gold} tagColor={C.black} best />
            <QuoteRow icon="🟠" name="Grubhub" total="$55.12" fees="Service: $4.93 · Delivery: $4.99" tag="+$9.04" tagBg={C.red} tagColor={C.white} />
            <QuoteRow icon="🔴" name="DoorDash" total="$57.43" fees="Service: $5.87 · Delivery: $3.99" tag="+$11.35" tagBg={C.red} tagColor={C.white} />
            <QuoteRow icon="🟢" name="Uber Eats" total="$58.18" fees="Service: $6.38 · Delivery: $4.99" tag="+$12.10" tagBg={C.red} tagColor={C.white} />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#0D0D0D', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '32px 24px' }}>
        <div className="stat-grid" style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { value: '$11.40', label: 'Average savings per order' },
            { value: '9,300+', label: 'Restaurants tracked' },
            { value: '30', label: 'US cities covered' },
            { value: '0', label: 'Dollars it costs you' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.gold, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge-gold" style={{ display: 'inline-flex', marginBottom: 20 }}>How It Works</div>
          <h2 className="section-title" style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Zero extra steps.<br /><span className="gradient-text">Just savings.</span>
          </h2>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { num: '01', icon: '🛒', title: 'Browse normally', desc: 'Open DoorDash, Uber Eats, or Grubhub. Shop like you always have.' },
            { num: '02', icon: '⚡', title: 'Auto-compare', desc: 'SkipTheFee detects your restaurant and checks every platform + direct ordering.' },
            { num: '03', icon: '📊', title: 'See real costs', desc: 'Full breakdown: food price + markup + service fee + delivery + tax.' },
            { num: '04', icon: '💰', title: 'Order cheaper', desc: 'One click to the best option. Deep links pre-fill your cart elsewhere.' },
          ].map((step) => (
            <div key={step.num} className="card card-hover" style={{ padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.red, letterSpacing: '0.1em', marginBottom: 20 }}>{step.num}</div>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{step.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIDDEN FEES ── */}
      <section style={{ padding: '80px 24px', background: '#0D0D0D', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="badge-red" style={{ display: 'inline-flex', marginBottom: 20 }}>The Real Cost</div>
            <h2 className="section-title" style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12 }}>
              Fees they hide<br /><span className="gradient-text-red">in plain sight</span>
            </h2>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>
              A $35 DoorDash order is often a $27 direct order. Here&apos;s where the difference goes.
            </p>
          </div>

          <div className="fee-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Menu Markup', value: '15–20%', desc: 'Restaurants raise menu prices on delivery apps to cover their 28–33% commission.', accent: C.red },
              { label: 'Service Fee', value: '$2–10', desc: 'A percentage of your subtotal going straight to the platform — not your driver.', accent: C.red },
              { label: 'Delivery Fee', value: '$2–8', desc: 'Varies by distance and surge demand. Direct ordering often beats these rates.', accent: C.gold },
              { label: 'Small Order Fee', value: '$2–3', desc: 'Under $12? You get surcharged. Direct ordering rarely has minimums.', accent: C.gold },
            ].map((fee) => (
              <div key={fee.label} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: fee.accent, marginBottom: 6, letterSpacing: '-0.03em' }}>{fee.value}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{fee.label}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{fee.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 36, fontSize: 15, fontWeight: 600 }}>
            <span style={{ color: C.gold }}>Direct ordering saves 20–30% on average.</span>
            {' '}<span style={{ color: C.muted }}>SkipTheFee finds the link so you don&apos;t have to.</span>
          </p>
        </div>
      </section>

      {/* ── REAL SAVINGS ── */}
      <section style={{ padding: '100px 24px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Real orders. <span className="gradient-text">Real savings.</span>
          </h2>
          <p style={{ fontSize: 14, color: C.muted }}>Verified comparisons from supported cities.</p>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { restaurant: 'Chipotle — 3 items', city: 'DC', savings: '$12.10', best: 'Direct (Toast)' },
            { restaurant: 'Whataburger — #1 Combo', city: 'Austin', savings: '$4.87', best: 'Direct' },
            { restaurant: 'CAVA — Bowl + Pita Chips', city: 'DC', savings: '$6.23', best: 'Grubhub' },
            { restaurant: "Torchy's Tacos — 2 tacos + queso", city: 'Austin', savings: '$5.40', best: 'Direct (Square)' },
          ].map((ex) => (
            <div key={ex.restaurant} className="card savings-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.restaurant}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>📍 {ex.city} · Best: {ex.best}</div>
              </div>
              <div className="savings-badge" style={{
                background: 'rgba(244,163,0,0.12)',
                border: `1px solid rgba(244,163,0,0.25)`,
                borderRadius: 8, padding: '6px 14px', flexShrink: 0,
              }}>
                <span style={{ fontWeight: 900, color: C.gold, fontSize: 15 }}>{ex.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { text: 'Saved $8 on my first order. I felt dumb for using DoorDash for so long.', author: 'Marcus T.', city: 'Chicago' },
            { text: 'I order Thai food 3x a week. This saves me like $60/month easily.', author: 'Sarah K.', city: 'NYC' },
            { text: 'The fact that restaurants have their own ordering and nobody tells you is wild.', author: 'James R.', city: 'Austin' },
          ].map((t, i) => (
            <div key={i} className="card" style={{ padding: '22px 20px' }}>
              <div style={{ fontSize: 13, color: C.gold, marginBottom: 10, fontWeight: 700 }}>★★★★★</div>
              <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.65, marginBottom: 12 }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ fontSize: 12, color: C.muted }}>
                <strong style={{ color: C.white }}>{t.author}</strong> · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', background: '#0D0D0D', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 48 }}>FAQ</h2>
          {[
            { q: 'Is it really free?', a: 'Yes. The app, extension, and restaurant listings are completely free. We offer optional featured placement for restaurant owners ($29/mo) — that\'s how we keep the lights on.' },
            { q: 'How do you get the prices?', a: 'Public APIs and menu data. Prices are pulled from live sources where available, and estimated from known fee models for others. Verified with real orders.' },
            { q: 'What cities are supported?', a: '30 US cities including NYC, Chicago, LA, SF, Boston, Miami, DC, Austin, Houston, Atlanta, Seattle, Denver, Dallas, Phoenix, Nashville, Portland and more.' },
            { q: 'What is "direct ordering"?', a: 'Many restaurants accept orders through their own website via Toast, Square, ChowNow, etc. No 28–33% platform commission means 10–20% cheaper for you.' },
            { q: 'Does it work with DashPass / Uber One?', a: 'Not yet. Currently compares standard pricing. Subscriber pricing is on our roadmap.' },
          ].map((faq, i, arr) => (
            <div key={faq.q} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: C.white }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-glow" style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="bottom-cta-title" style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Start saving<br /><span style={{ color: C.gold }}>on your next order</span>
          </h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Free forever. Works on DoorDash, Uber Eats, and Grubhub.
            No account needed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/install" className="btn-primary" style={{ fontSize: 17, padding: '16px 40px' }}>
              🧩 Install Extension — Free
            </Link>
            <Link href="/restaurants" className="btn-outline" style={{ fontSize: 17, padding: '16px 32px' }}>
              Browse Restaurants
            </Link>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: C.muted }}>
            Chrome extension · No signup · Instant savings
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="status-bar">
        <span><span className="status-dot" />System Online</span>
        <Link href="/for-restaurants">For Restaurants</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="mailto:jon@skipthefee.app">Contact</a>
        <Link href="/restaurants">Restaurants</Link>
        <span>© 2026 SkipTheFee</span>
      </footer>
    </main>
  );
}

function QuoteRow({ icon, name, total, fees, tag, tagBg, tagColor, best }: {
  icon: string; name: string; total: string; fees: string;
  tag: string; tagBg: string; tagColor: string; best?: boolean;
}) {
  return (
    <div className="quote-row" style={{
      background: best ? 'rgba(244,163,0,0.05)' : 'transparent',
      borderRadius: 10, padding: '12px 14px', marginBottom: 6,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: best ? '1px solid rgba(244,163,0,0.2)' : '1px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <div className="quote-name" style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div className="quote-fees" style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fees}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
        <div className="quote-total" style={{ fontWeight: 800, fontSize: 15 }}>{total}</div>
        <span style={{ fontSize: 10, fontWeight: 800, color: tagColor, background: tagBg, padding: '2px 6px', borderRadius: 4 }}>{tag}</span>
      </div>
    </div>
  );
}
