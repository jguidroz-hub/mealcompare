import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Is Uber Eats So Expensive? The Real Math Behind the Fees (2026) — Eddy Blog',
  description: 'Uber Eats charges 30-45% more than ordering direct. We break down every fee — menu markup, service fee, delivery fee, and priority fee — with real numbers.',
  keywords: ['why is Uber Eats so expensive', 'Uber Eats fees', 'Uber Eats expensive', 'Uber Eats service fee', 'Uber Eats markup', 'Uber Eats vs ordering direct'],
  alternates: { canonical: 'https://eddy.delivery/blog/why-is-uber-eats-so-expensive' },
  openGraph: { title: 'Why Is Uber Eats So Expensive? (2026)', description: 'The real math behind Uber Eats fees and markups.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Research</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Why Is Uber Eats So Expensive? The Real Math</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>You open Uber Eats, order a $15 meal, and somehow pay $26. What happened? Let&apos;s break down every dollar.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The 5 Layers of Uber Eats Pricing</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Real example: Chipotle burrito bowl</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Restaurant price', '$10.50', '#374151'],
                ['Uber Eats menu price', '$12.50', '#dc2626', '+$2.00 markup (19%)'],
                ['Service fee (15%)', '+$1.88', '#dc2626', ''],
                ['Delivery fee', '+$2.99', '#dc2626', ''],
                ['Priority delivery (default)', '+$1.49', '#dc2626', 'Often pre-selected!'],
                ['Tax (on $12.50)', '+$1.06', '#dc2626', 'Tax on the inflated price'],
                ['Tip (20%)', '+$2.50', '#6b7280', ''],
              ].map(([label, amount, color, note]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    {note && <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 8 }}>{note}</span>}
                  </div>
                  <span style={{ fontWeight: 700, color: color as string }}>{amount}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '2px solid #111' }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>Total on Uber Eats</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#dc2626' }}>$22.42</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>Direct order (chipotle.com) + tip</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>$15.13</span>
              </div>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', marginTop: 16, marginBottom: 0, textAlign: 'center' as const }}>Uber Eats costs $7.29 more (48%)</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Layer 1: Menu Price Markup (15-25%)</h2>
          <p>Uber Eats charges restaurants a 15-30% commission on every order. Most restaurants raise their Uber Eats prices to compensate. A $10 item becomes $11.50-12.50 on the app.</p>
          <p><strong>This is the fee Uber Eats doesn&apos;t want you to see.</strong> It&apos;s hidden in the menu prices themselves.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Layer 2: Service Fee (15%)</h2>
          <p>Uber Eats charges a service fee of approximately 15% of your subtotal — the <em>already-inflated</em> subtotal. For a $25 order, that&apos;s $3.75. Uber One members get a 5% discount, but it&apos;s still significant.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Layer 3: Delivery Fee ($0.99-7.99)</h2>
          <p>This varies by distance, demand, and time of day. During lunch and dinner rush, delivery fees surge. Uber One eliminates delivery fees on orders over $15, but the other fees remain.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Layer 4: Priority Fee ($1-3)</h2>
          <p>Here&apos;s the sneaky one: <strong>Uber Eats defaults to &quot;Priority&quot; delivery</strong>, which adds $1-3 to your order. You have to manually switch to &quot;Standard&quot; to avoid it. Many people don&apos;t notice until they&apos;ve already checked out.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Layer 5: Tax on the Inflated Price</h2>
          <p>Sales tax is calculated on your subtotal — the inflated subtotal. So you&apos;re paying tax on the markup, tax on the service fee, and tax on everything else. It&apos;s a small amount per order but adds up over time.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Is Uber One Worth It?</h2>
          <p>Uber One costs $9.99/month and gives you:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
            <li style={{ marginBottom: 4 }}>$0 delivery fee on orders $15+</li>
            <li style={{ marginBottom: 4 }}>5% off orders over $15</li>
            <li style={{ marginBottom: 4 }}>Priority support</li>
          </ul>
          <p>If you order 4+ times per month on Uber Eats, Uber One pays for itself in delivery fee savings alone. But <strong>even with Uber One, you&apos;re still paying 15-20% more than ordering direct</strong> because of menu markups and service fees.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Actual Cheapest Option</h2>
          <p>Before opening Uber Eats, check if the restaurant has its own website or app. Major chains (Chipotle, Wingstop, Domino&apos;s, Chick-fil-A) all deliver directly at restaurant prices. Many local restaurants use Toast, Square, or ChowNow for direct ordering.</p>
          <p><strong>Same food. Same door. 20-45% less.</strong></p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stop overpaying on Uber Eats</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Eddy automatically finds direct ordering links for 13,000+ restaurants. Free Chrome extension.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
