import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in San Francisco (2026): Skip the App Tax — Eddy Blog',
  description: 'SF food delivery fees are among the highest in the US. We compared DoorDash, Uber Eats, and direct ordering for popular Bay Area restaurants.',
  keywords: ['cheapest food delivery San Francisco', 'SF food delivery', 'cheap delivery San Francisco', 'DoorDash SF prices', 'Uber Eats San Francisco', 'food delivery Bay Area'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-sf' },
  openGraph: {
    title: 'Cheapest Food Delivery in San Francisco (2026)',
    description: 'Real price comparisons for SF restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliverySFPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fdf4ff', color: '#a21caf', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>San Francisco</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in San Francisco (2026): Skip the App Tax
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>San Francisco food is already expensive. A burrito that costs $14 at the counter becomes $22+ on DoorDash after markups, service fees, and delivery charges. In a city where the average tech worker orders delivery 3-4 times a week, that adds up to <strong>thousands of dollars a year in unnecessary fees</strong>.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>SF&apos;s Fee Cap Didn&apos;t Fix Pricing</h2>

          <p>San Francisco capped delivery app commissions at 15% in 2020. Like NYC, apps responded by shifting costs to consumers — higher service fees, higher delivery fees, and restaurants still mark up menu prices to cover even the reduced commission.</p>

          <p>The result: you&apos;re still paying 20-30% more on delivery apps than ordering direct.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Bay Area Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito bowl + chips & guac</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.18</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.20</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.98 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Shake Shack — ShackBurger + fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$22.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (shakeshack.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.19</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.65 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Sweetgreen — Harvest Bowl</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$23.42</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (sweetgreen.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.25</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $6.17 (26%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>SF/Bay Area Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Chipotle", "Shake Shack", "Sweetgreen", "Cava",
              "Wingstop", "Chick-fil-A", "Domino's", "Papa John's",
              "Panera Bread", "Five Guys", "Blaze Pizza", "MOD Pizza",
              "Souvla", "The Halal Guys", "Ike's Sandwiches", "Philz Coffee",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>SF-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>SF sales tax: 8.625%</strong> — applied on inflated app prices, adding $1-2 extra per order</li>
            <li style={{ marginBottom: 8 }}><strong>Toast is huge in the Bay</strong> — hundreds of SF restaurants use Toast for their own online ordering</li>
            <li style={{ marginBottom: 8 }}><strong>DoorDash is headquartered in SF</strong> — ironic that locals overpay the most on their hometown app</li>
            <li style={{ marginBottom: 8 }}><strong>SFSU/Berkeley students:</strong> direct ordering 3-4x/week saves $700-900/semester</li>
          </ul>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stop overpaying in DoorDash&apos;s hometown</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. 180+ Bay Area Toast restaurants indexed.</p>
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
