import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in NYC (2026): Dodge the App Fees — Eddy Blog',
  description: 'NYC food delivery app fees are the highest in the country. We compared DoorDash, Uber Eats, and direct ordering for popular NYC restaurants.',
  keywords: ['cheapest food delivery NYC', 'New York food delivery', 'cheap delivery NYC', 'DoorDash NYC prices', 'Uber Eats NYC', 'food delivery New York City'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-nyc' },
  openGraph: {
    title: 'Cheapest Food Delivery in NYC (2026)',
    description: 'Real price comparisons for NYC restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliveryNYCPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>NYC</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in NYC (2026): Dodge the App Fees
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>New York City is the biggest food delivery market in the US — and the most expensive. With sky-high rents already built into menu prices, adding DoorDash&apos;s 25-30% markup on top creates some truly painful totals.</p>

          <p>The good news: NYC also has <strong>more restaurants with their own ordering systems</strong> than any other city. Here&apos;s how to find them.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NYC&apos;s Fee Cap — And Why It Doesn&apos;t Help You</h2>

          <p>In 2021, NYC permanently capped delivery app commissions at 15% for delivery and 5% for marketing. Sounds great for restaurants, right?</p>

          <p>The problem: <strong>apps shifted costs to consumers</strong>. Service fees went up, delivery fees went up, and many restaurants still raise their app prices because 15% of every order is still a lot when your margins are already thin.</p>

          <p>NYC regulation helped restaurants survive, but your order still costs 20-30% more on delivery apps than direct.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: NYC Staples</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Shake Shack — ShackBurger + fries + shake</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$27.84</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Inflated menu + $3.99 delivery + $4.12 service</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (shakeshack.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$20.97</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Real prices + $2.99 delivery</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $6.87 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Sweetgreen — Harvest Bowl</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$22.15</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (sweetgreen.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.45</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.70 (26%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Joe&apos;s Pizza — 2 slices + drink</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Grubhub</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$15.48</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Walk-in / direct</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$9.00</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $6.48 (42%) — walk-in is king for pizza by the slice</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NYC Chains With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Shake Shack", "Sweetgreen", "Chipotle", "Chick-fil-A",
              "Wingstop", "Domino's", "Papa John's", "Panera Bread",
              "Potbelly", "Nando's", "Dig", "Just Salad",
              "Cava", "Dos Toros", "Halal Guys", "Five Guys",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NYC-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>NYC sales tax on prepared food: 8.875%</strong> — calculated on the inflated DoorDash price, so you&apos;re paying tax on the markup</li>
            <li style={{ marginBottom: 8 }}><strong>Many NYC restaurants use ChowNow, Toast, or Slice</strong> — Slice is especially popular for NYC pizza shops</li>
            <li style={{ marginBottom: 8 }}><strong>The Seamless/Grubhub monopoly is fading</strong> — restaurants increasingly push their own ordering to keep more revenue</li>
            <li style={{ marginBottom: 8 }}><strong>NYU/Columbia/New School students:</strong> in a city this expensive, direct ordering 4x/week saves $700-900/semester</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings in NYC</h2>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $620-870/year saved</li>
              <li><strong>3x/week:</strong> $930-1,300/year saved</li>
              <li><strong>Heavy user (5x/week):</strong> $1,550-2,170/year saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stop overpaying for NYC delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{
              display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px',
              borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none',
            }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
