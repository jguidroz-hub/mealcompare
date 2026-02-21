import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eddy — Compare every delivery app. Order the cheapest.',
  description:
    'Eddy automatically compares DoorDash, Uber Eats, Grubhub, and direct restaurant ordering for 9,300+ restaurants. Find the cheapest option every time — free forever.',
  openGraph: {
    title: 'Eddy — The price comparison engine for food delivery',
    description: 'Why check one delivery app when Eddy checks all of them?',
    type: 'website',
    url: 'https://eddy.delivery',
    siteName: 'Eddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eddy — The price comparison engine for food delivery',
    description: 'Why check one delivery app when Eddy checks all of them?',
  },
};

/* Palette — shared across all inline styles */
const C = {
  black:      '#0B0B0B',
  card:       '#111111',
  card2:      '#161616',
  border:     '#1E1E1E',
  border2:    '#252525',
  red:        '#C62828',
  redDark:    '#A01E1E',
  redGlow:    'rgba(198,40,40,0.18)',
  gold:       '#F4A300',
  goldLight:  '#FFD166',
  goldGlow:   'rgba(244,163,0,0.14)',
  water:      '#22D3EE',   // the "current" — Eddy's detection/intelligence color
  waterGlow:  'rgba(34,211,238,0.08)',
  white:      '#FFFFFF',
  muted:      '#6B6B6B',
  mutedLight: '#9B9B9B',
};

export default function Home() {
  return (
    <main style={{ background: C.black, color: C.white, minHeight: '100vh' }}>

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,11,11,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1120, margin: '0 auto', padding: '0 24px',
          height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo: tilde (water) + eddy */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{
              fontSize: 22, fontWeight: 900, color: C.water,
              lineHeight: 1, letterSpacing: '-0.05em', marginRight: 2,
            }}>~</span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: C.white }}>eddy</span>
            <span style={{ fontSize: 13, color: C.muted, marginLeft: 1, fontWeight: 500 }}>.delivery</span>
          </div>

          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href="/restaurants" className="desktop-only" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 14px' }}>
              Browse
            </Link>
            <Link href="/for-restaurants" className="desktop-only" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 14px' }}>
              For Restaurants
            </Link>
            <Link href="/install" style={{
              marginLeft: 6,
              background: C.red, color: C.white,
              padding: '8px 22px', borderRadius: 8,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              boxShadow: `0 2px 14px ${C.redGlow}`,
              letterSpacing: '-0.01em',
            }}>
              Add to Chrome
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO — two-column: copy left, browser mockup right
          Honey design pillar: the extension overlay IS the hero visual
          Kayak pillar: headline leads with "compare every app"
          Water pillar: tilde + "find the current" + cyan detection color
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 24px 80px' }}>
        <div className="hero-grid">

          {/* LEFT: copy */}
          <div className="fade-in-up">
            {/* Water eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 30 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, color: C.water,
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>~ Find the current</span>
            </div>

            <h1 style={{
              fontSize: 58, fontWeight: 900, letterSpacing: '-0.04em',
              lineHeight: 1.04, marginBottom: 26,
            }}>
              Compare every<br />
              delivery app.<br />
              <span style={{ color: C.gold }}>Order the cheapest.</span>
            </h1>

            <p style={{
              fontSize: 18, color: C.mutedLight, lineHeight: 1.65,
              marginBottom: 14, maxWidth: 440,
            }}>
              Eddy checks DoorDash, Uber Eats, Grubhub, and direct restaurant
              ordering simultaneously — and surfaces the cheapest option every time.
            </p>

            <p style={{
              fontSize: 15, color: C.muted, lineHeight: 1.65,
              marginBottom: 38, maxWidth: 440,
            }}>
              Free forever. Works on any restaurant. No account required.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link href="/install" className="btn-primary" style={{ fontSize: 16 }}>
                🧩 Add to Chrome — Free
              </Link>
              <Link href="/restaurants" className="btn-outline" style={{ fontSize: 16 }}>
                Browse Restaurants
              </Link>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { v: '$11.40', l: 'avg saved / order' },
                { v: '9,300+', l: 'restaurants' },
                { v: '30',     l: 'US cities' },
              ].map(s => (
                <div key={s.v} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: C.white, letterSpacing: '-0.03em' }}>
                    {s.v}
                  </span>
                  <span style={{ fontSize: 12, color: C.muted }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: browser mockup */}
          <div className="hero-mockup-wrap fade-in-up" style={{ animationDelay: '0.15s' }}>
            <BrowserMockup />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PLATFORM STRIP
      ════════════════════════════════════════ */}
      <div style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: '#0D0D0D', padding: '18px 24px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: C.muted,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4,
          }}>
            We compare
          </span>
          {[
            '🔴 DoorDash',
            '🟢 Uber Eats',
            '🟠 Grubhub',
            '🏪 Toast Direct',
            '⬛ Square Direct',
            '🟡 ChowNow',
          ].map(p => (
            <span key={p} style={{ fontSize: 14, color: C.mutedLight, fontWeight: 600 }}>{p}</span>
          ))}
          <span style={{ fontSize: 12, color: C.muted }}>+ more</span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          KAYAK SECTION
          Kayak pillar: explicit price-comparison-engine positioning
          The PRODUCT DEMO is the Kayak UX pattern — search → ranked results → winner
      ════════════════════════════════════════ */}
      <section style={{ padding: '108px 24px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          {/* Left: copy */}
          <div>
            <div className="badge-water" style={{ display: 'inline-flex', marginBottom: 24 }}>
              The price comparison engine for food delivery
            </div>
            <h2 style={{
              fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em',
              lineHeight: 1.15, marginBottom: 22,
            }}>
              You wouldn&apos;t book a flight without{' '}
              <span style={{ color: C.gold }}>checking every airline.</span>
            </h2>
            <p style={{ fontSize: 17, color: C.mutedLight, lineHeight: 1.7, marginBottom: 16 }}>
              Price comparison is standard for flights, hotels, and insurance.
              Yet most people open one delivery app and order blind — paying
              20–30% more than they need to.
            </p>
            <p style={{
              fontSize: 17, color: C.white, fontWeight: 600,
              lineHeight: 1.6, marginBottom: 32,
              paddingLeft: 16,
              borderLeft: `3px solid ${C.water}`,
            }}>
              Eddy is the comparison engine food delivery has never had.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '✈️', label: 'Kayak checks 900+ airlines for your flight.' },
                { icon: '🏨', label: 'Trivago checks 400+ sites for your hotel.' },
                { icon: '🌊', label: 'Eddy checks every delivery app for your food.' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, marginTop: 1 }}>{row.icon}</span>
                  <span style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.5 }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Kayak-style comparison table demo */}
          <div>
            <KayakTable />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
          Water pillar: step language uses "current / flow / stream"
          Water pillar: explains what "eddy" means
      ════════════════════════════════════════ */}
      <section style={{
        padding: '88px 24px',
        background: '#0D0D0D',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontSize: 42, fontWeight: 900,
              letterSpacing: '-0.03em', marginBottom: 16,
            }}>
              How <span style={{ color: C.water }}>Eddy</span> works
            </h2>
            {/* Water definition — explains the brand */}
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              <em style={{ color: C.water, fontStyle: 'normal', fontWeight: 600 }}>eddy</em>
              {' '}(n.) — a current of water running counter to the main flow.
              <br />We run counter to delivery app fees.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              {
                num: '01',
                icon: '🛒',
                title: 'Open any delivery app',
                desc: 'Browse DoorDash, Uber Eats, or Grubhub like you always have. Eddy runs silently in the background.',
              },
              {
                num: '02',
                icon: '🌊',
                title: 'Eddy reads the current',
                desc: 'Auto-detects your restaurant. Simultaneously checks every platform plus direct ordering in seconds.',
              },
              {
                num: '03',
                icon: '📊',
                title: 'All paths revealed',
                desc: 'Full breakdown: food price + markup + service fee + delivery + tax. Every platform, side by side.',
              },
              {
                num: '04',
                icon: '💰',
                title: 'Flow to the best price',
                desc: 'One click. Deep link pre-fills your cart on the cheapest option. You save before you even notice.',
              },
            ].map(step => (
              <div key={step.num} className="card card-hover" style={{ padding: 28 }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: C.water,
                  letterSpacing: '0.1em', marginBottom: 20,
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{step.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHAT THEY CHARGE
          Honey pillar: real dollar amounts dominate, not features
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', maxWidth: 880, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="badge-red" style={{ display: 'inline-flex', marginBottom: 20 }}>
            The real cost
          </div>
          <h2 style={{
            fontSize: 42, fontWeight: 900,
            letterSpacing: '-0.03em', marginBottom: 16,
          }}>
            What they charge.<br />
            <span style={{ color: C.gold }}>What you could keep.</span>
          </h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
            A $35 DoorDash order is often a $27 direct order.
            Here&apos;s where the $8 disappears.
          </p>
        </div>

        <div className="fee-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            {
              label: 'Menu Markup',
              value: '15–20%',
              desc: 'Restaurants raise prices on delivery platforms to offset their 28–33% commission. You absorb it.',
              accent: C.red,
            },
            {
              label: 'Service Fee',
              value: '$2–10',
              desc: 'A percentage of your subtotal going straight to the platform — not to your driver, not to the restaurant.',
              accent: C.red,
            },
            {
              label: 'Delivery Fee',
              value: '$2–8',
              desc: 'Varies by distance and demand surge. Direct ordering via restaurant websites often beats platform rates.',
              accent: C.gold,
            },
            {
              label: 'Small Order Fee',
              value: '$2–3',
              desc: 'Order under $12 and platforms surcharge you for it. Direct restaurant ordering rarely has minimums.',
              accent: C.gold,
            },
          ].map(fee => (
            <div key={fee.label} className="card" style={{ padding: 26 }}>
              <div style={{
                fontSize: 38, fontWeight: 900, color: fee.accent,
                marginBottom: 6, letterSpacing: '-0.03em',
              }}>
                {fee.value}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{fee.label}</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{fee.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 36, fontSize: 15, fontWeight: 600 }}>
          <span style={{ color: C.gold }}>Direct ordering saves 20–30% on average.</span>
          {' '}
          <span style={{ color: C.muted }}>Eddy finds the link so you don&apos;t have to.</span>
        </p>
      </section>

      {/* ════════════════════════════════════════
          REAL SAVINGS
          Honey pillar: real dollar numbers, verified, specific
      ════════════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: '#0D0D0D',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontSize: 38, fontWeight: 900,
              letterSpacing: '-0.03em', marginBottom: 10,
            }}>
              Real orders.{' '}
              <span style={{ color: C.gold }}>Real savings.</span>
            </h2>
            <p style={{ fontSize: 14, color: C.muted }}>
              Verified comparisons from supported cities.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { restaurant: 'Chipotle — Burrito bowl, chips, drink',   city: 'DC',     savings: '$12.10', best: 'Direct (Toast)' },
              { restaurant: 'Whataburger — #1 Combo + shake',         city: 'Austin',  savings: '$4.87',  best: 'Direct'        },
              { restaurant: 'CAVA — Bowl + pita chips + lemonade',     city: 'DC',     savings: '$6.23',  best: 'Grubhub'       },
              { restaurant: "Torchy's Tacos — 2 tacos, queso, drink",  city: 'Austin',  savings: '$5.40',  best: 'Direct (Square)' },
            ].map(ex => (
              <div key={ex.restaurant} className="card savings-card" style={{
                padding: '16px 22px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.restaurant}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    📍 {ex.city} · Best option: {ex.best}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(244,163,0,0.1)',
                  border: '1px solid rgba(244,163,0,0.22)',
                  borderRadius: 8, padding: '8px 16px', flexShrink: 0,
                }}>
                  <span style={{ fontWeight: 900, color: C.gold, fontSize: 16 }}>{ex.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SOCIAL PROOF
          Honey pillar: personal stories + specific savings amounts
          Water pillar: section headline "People found the current"
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontSize: 38, fontWeight: 900,
            letterSpacing: '-0.03em', marginBottom: 10,
          }}>
            People found the current.
          </h2>
          <p style={{ fontSize: 15, color: C.muted }}>
            You don&apos;t need a subscription. You just need Eddy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            {
              text: 'Saved $8 on my very first order. I felt dumb for using DoorDash for two years.',
              author: 'Marcus T.',
              city: 'Chicago',
              saved: '$8.00',
            },
            {
              text: 'I order Thai 3x a week. Eddy found the direct link every single time. That\'s $60/month back in my pocket.',
              author: 'Sarah K.',
              city: 'NYC',
              saved: '$60/mo',
            },
            {
              text: 'The fact that restaurants have their own ordering page and nobody tells you is genuinely wild.',
              author: 'James R.',
              city: 'Austin',
              saved: '$5.40',
            },
          ].map((t, i) => (
            <div key={i} className="card" style={{ padding: '24px 22px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 14,
              }}>
                <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, letterSpacing: '0.02em' }}>
                  ★★★★★
                </div>
                <div style={{
                  background: 'rgba(244,163,0,0.1)',
                  border: '1px solid rgba(244,163,0,0.22)',
                  borderRadius: 6, padding: '3px 10px',
                  fontSize: 12, fontWeight: 800, color: C.gold,
                }}>
                  {t.saved}
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.65, marginBottom: 14 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ fontSize: 12, color: C.muted }}>
                <strong style={{ color: C.white }}>{t.author}</strong> · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section style={{
        padding: '88px 24px',
        background: '#0D0D0D',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em',
            textAlign: 'center', marginBottom: 52,
          }}>
            FAQ
          </h2>
          {([
            {
              q: 'Is Eddy really free?',
              a: 'Yes — the extension, restaurant listings, and price comparisons are completely free forever. We offer optional featured placement for restaurant owners ($29/mo). That\'s our business model. Not your data.',
            },
            {
              q: 'How do you get the prices?',
              a: 'Public APIs, live menu data, and known fee models — verified with real orders. Prices are updated regularly and flagged when estimates are used vs. live pulls.',
            },
            {
              q: 'What is "direct ordering"?',
              a: 'Many restaurants take orders through their own site via Toast, Square, ChowNow, or similar. No 28–33% platform commission means food is 10–20% cheaper for you. Eddy finds the direct link so you don\'t have to go hunting.',
            },
            {
              q: 'What cities are supported?',
              a: '30 US cities: NYC, Chicago, LA, SF, Boston, Miami, DC, Austin, Houston, Atlanta, Seattle, Denver, Dallas, Phoenix, Nashville, Portland, and more. New cities added regularly.',
            },
            {
              q: 'Does it work with DashPass or Uber One?',
              a: 'Subscriber pricing is on the roadmap. Even without it, Eddy finds cheaper options in most cases — especially when direct ordering is available.',
            },
          ] as { q: string; a: string }[]).map((faq, i, arr) => (
            <div key={faq.q} style={{
              marginBottom: 28, paddingBottom: 28,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOTTOM CTA
          Honey pillar: "Add to Chrome in 2 seconds" — frictionless, personal
          Water pillar: water glow + "Find the current" closing line
      ════════════════════════════════════════ */}
      <section style={{ padding: '108px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Water glow behind CTA */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 640, height: 640,
          background: `radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: C.water,
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 22,
          }}>
            ~ Find the current
          </div>

          <div style={{
            fontSize: 84, fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 20,
          }}>
            eddy<span style={{ color: C.red }}>.</span>
          </div>

          <p style={{
            fontSize: 20, color: C.mutedLight, fontWeight: 400,
            lineHeight: 1.55, maxWidth: 380, margin: '0 auto 44px',
          }}>
            Add to Chrome in 2 seconds.<br />
            Save on your next order.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/install" className="btn-primary" style={{ fontSize: 17, padding: '16px 44px' }}>
              🧩 Add to Chrome — Free
            </Link>
            <Link href="/restaurants" className="btn-outline" style={{ fontSize: 17, padding: '16px 34px' }}>
              Browse Restaurants
            </Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: C.muted }}>
            No account · No signup · Works instantly · 9,300+ restaurants
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="status-bar">
        <span>
          <span className="status-dot" />
          All systems online
        </span>
        <Link href="/for-restaurants">For Restaurants</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="mailto:jon@eddy.delivery">Contact</a>
        <Link href="/restaurants">Restaurants</Link>
        <span>© 2026 Eddy</span>
      </footer>
    </main>
  );
}

/* ════════════════════════════════════════════
   BROWSER MOCKUP
   Honey pillar: extension overlay is the hero visual — shows the product
   working on a real delivery app page, just like Honey shows coupons applying
════════════════════════════════════════════ */
function BrowserMockup() {
  return (
    <div className="browser-mockup">
      {/* Chrome bar */}
      <div className="browser-chrome">
        <div className="browser-dots">
          <span className="browser-dot" style={{ background: '#FF5F57' }} />
          <span className="browser-dot" style={{ background: '#FFBD2E' }} />
          <span className="browser-dot" style={{ background: '#28C840' }} />
        </div>
        <div className="browser-url">doordash.com/store/chipotle-dc</div>
      </div>

      {/* Fake DoorDash page */}
      <div className="browser-page">
        {/* Restaurant header */}
        <div style={{
          background: '#FFF', borderRadius: 10, padding: '12px 14px',
          marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center',
          border: '1px solid #E8E8E8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: '#EB622A', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22,
          }}>
            🌯
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111', fontSize: 13 }}>
              Chipotle Mexican Grill
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
              4.7 ★ · 25–35 min
            </div>
            <div style={{ fontSize: 10, color: '#E53935', marginTop: 2, fontWeight: 600 }}>
              $3.99 delivery fee + $5.87 service fee
            </div>
          </div>
        </div>

        {/* Menu items */}
        {[
          { n: 'Burrito Bowl',   p: '$11.45', e: '🍚' },
          { n: 'Chips & Guac',   p: '$5.50',  e: '🥑' },
          { n: 'Fountain Drink', p: '$3.15',  e: '🥤' },
        ].map(item => (
          <div key={item.n} style={{
            background: '#FFF', borderRadius: 8, padding: '9px 12px', marginBottom: 6,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: '1px solid #EBEBEB',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{item.e}</span>
              <span style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>{item.n}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{item.p}</span>
          </div>
        ))}

        {/* ── THE EDDY OVERLAY — this is the Honey moment ── */}
        <div className="eddy-overlay-card">
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10, paddingBottom: 10,
            borderBottom: '1px solid #1E1E1E',
          }}>
            <span style={{ fontSize: 16 }}>🌊</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 9, fontWeight: 800, color: '#22D3EE',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Eddy
              </div>
              <div style={{ fontSize: 10, color: '#9B9B9B' }}>
                Found a cheaper path
              </div>
            </div>
            {/* Savings badge — the dopamine hit */}
            <div style={{
              background: '#F4A300', color: '#0B0B0B',
              fontSize: 10, fontWeight: 900,
              padding: '3px 8px', borderRadius: 6,
              whiteSpace: 'nowrap',
            }}>
              Save $12.10
            </div>
          </div>

          {/* Comparison rows */}
          {[
            { icon: '🏪', name: 'Direct Order', total: '$46.08', diff: 'BEST',    diffBg: '#F4A300', diffColor: '#000', best: true  },
            { icon: '🟠', name: 'Grubhub',      total: '$55.12', diff: '+$9.04',  diffBg: '#C62828', diffColor: '#FFF', best: false },
            { icon: '🔴', name: 'DoorDash',      total: '$57.43', diff: '+$11.35', diffBg: '#C62828', diffColor: '#FFF', best: false },
            { icon: '🟢', name: 'Uber Eats',     total: '$58.18', diff: '+$12.10', diffBg: '#C62828', diffColor: '#FFF', best: false },
          ].map(row => (
            <div key={row.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 7px', borderRadius: 7, marginBottom: 3,
              background: row.best ? 'rgba(244,163,0,0.08)' : 'transparent',
              border:     row.best ? '1px solid rgba(244,163,0,0.2)' : '1px solid transparent',
            }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontSize: 9 }}>{row.icon}</span>
                <span style={{
                  fontSize: 10,
                  color:      row.best ? '#FFFFFF' : '#6B6B6B',
                  fontWeight: row.best ? 700 : 400,
                }}>
                  {row.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, fontWeight: 800,
                  color: row.best ? '#F4A300' : '#6B6B6B',
                }}>
                  {row.total}
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 800,
                  color:      row.diffColor,
                  background: row.diffBg,
                  padding: '1px 4px', borderRadius: 3,
                }}>
                  {row.diff}
                </span>
              </div>
            </div>
          ))}

          {/* Action button */}
          <div style={{
            marginTop: 10, background: '#F4A300',
            borderRadius: 8, padding: '9px 10px', textAlign: 'center', cursor: 'pointer',
          }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#0B0B0B' }}>
              Order direct → Save $12.10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   KAYAK-STYLE COMPARISON TABLE
   Kayak pillar: the UX pattern of ranked results with a clear winner
   This is the product demo — makes it immediately obvious what Eddy does
════════════════════════════════════════════ */
function KayakTable() {
  const rows = [
    {
      icon:  '🏪',
      name:  'Direct Order (Toast)',
      fees:  'No markup · $4.99 delivery',
      total: '$46.08',
      diff:  'BEST',
      diffBg:    '#F4A300',
      diffColor: '#000',
      best:  true,
    },
    {
      icon:  '🟠',
      name:  'Grubhub',
      fees:  'Service: $4.93 · Delivery: $4.99',
      total: '$55.12',
      diff:  '+$9.04',
      diffBg:    '#C62828',
      diffColor: '#FFF',
      best:  false,
    },
    {
      icon:  '🔴',
      name:  'DoorDash',
      fees:  'Service: $5.87 · Delivery: $3.99',
      total: '$57.43',
      diff:  '+$11.35',
      diffBg:    '#C62828',
      diffColor: '#FFF',
      best:  false,
    },
    {
      icon:  '🟢',
      name:  'Uber Eats',
      fees:  'Service: $6.38 · Delivery: $4.99',
      total: '$58.18',
      diff:  '+$12.10',
      diffBg:    '#C62828',
      diffColor: '#FFF',
      best:  false,
    },
  ];

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Search bar — Kayak-style */}
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid #1E1E1E`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, background: '#0D0D0D', borderRadius: 8,
          padding: '10px 14px', fontSize: 13, color: '#666',
          border: '1px solid #252525', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13 }}>🔍</span>
          <span>Chipotle · Washington, DC · 3 items</span>
        </div>
        <div style={{
          background: '#C62828', borderRadius: 8, padding: '10px 16px',
          fontSize: 13, fontWeight: 700, color: '#FFF', cursor: 'pointer',
          whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(198,40,40,0.3)',
        }}>
          Compare
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        padding: '9px 18px 7px',
        display: 'flex', justifyContent: 'space-between',
        borderBottom: `1px solid #1A1A1A`,
      }}>
        <span style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Platform
        </span>
        <span style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Total with all fees
        </span>
      </div>

      {/* Result rows */}
      {rows.map(row => (
        <div
          key={row.name}
          className={row.best ? 'kayak-table-row-best' : 'kayak-table-row'}
          style={{ padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>{row.icon}</span>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: row.best ? 700 : 500,
                color:      row.best ? '#FFF' : '#9B9B9B',
              }}>
                {row.name}
              </div>
              <div className="kayak-table-fees" style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                {row.fees}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: 16, fontWeight: 800,
              color: row.best ? '#F4A300' : '#666',
              marginBottom: 3,
            }}>
              {row.total}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800,
              color:      row.diffColor,
              background: row.diffBg,
              padding: '2px 6px', borderRadius: 4,
            }}>
              {row.diff}
            </span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{
        padding: '11px 18px',
        borderTop: `1px solid #1E1E1E`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#555' }}>
          Checked 4 platforms · 2 seconds
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F4A300' }}>
          You save $12.10 →
        </span>
      </div>
    </div>
  );
}
