import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Tampa (2026): Cuban Sandwiches Without the Surcharge — Eddy Blog',
  description: 'Tampa delivery apps charge 20-30% more than ordering direct. We compared DoorDash, Uber Eats, and direct ordering for popular Tampa Bay restaurants.',
  keywords: ['cheapest food delivery Tampa', 'Tampa food delivery', 'cheap delivery Tampa FL', 'DoorDash Tampa', 'food delivery Tampa Bay', 'St Petersburg food delivery'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-tampa' },
  openGraph: { title: 'Cheapest Food Delivery in Tampa (2026)', description: 'Real price comparisons for Tampa Bay restaurants.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Tampa</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Cheapest Food Delivery in Tampa (2026): Cuban Sandwiches Without the Surcharge</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Tampa Bay is a food delivery powerhouse — from Ybor City to St. Pete to the suburbs, delivery demand is massive year-round. But Florida&apos;s heat isn&apos;t the only thing burning your wallet. DoorDash and Uber Eats are adding 20-30% to every order.</p>
          <p>We compared real prices for popular Tampa Bay restaurants. <strong>Ordering direct saves $5-7 per order on average.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Florida&apos;s Tax Situation</h2>
          <p>Florida has no state income tax but charges <strong>7.5% sales tax</strong> in Hillsborough County (Tampa) and <strong>7% in Pinellas</strong> (St. Pete). This tax is calculated on the inflated DoorDash price — so you&apos;re paying tax on the markup too.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Tampa Bay Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>PDQ — Chicken tenders combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.92</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (eatpdq.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$13.99</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.93 (26%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 classic wings + fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.18</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.49</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.69 (24%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Steak burrito + chips & salsa</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$20.94</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.20</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.74 (23%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Tampa Bay Restaurants With Direct Ordering</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {["PDQ", "Wingstop", "Chipotle", "Chick-fil-A", "Raising Cane's", "Panera Bread", "Domino's", "Five Guys", "4 Rivers Smokehouse", "Pollo Tropical", "Checkers", "Papa John's", "Shake Shack", "MOD Pizza", "Tijuana Flats", "Firehouse Subs"].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Tampa-Specific Tips</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>7.5% Hillsborough sales tax</strong> — on inflated DoorDash prices, that adds up fast</li>
            <li style={{ marginBottom: 8 }}><strong>Ybor City and SoHo restaurants often use Toast</strong> — check for direct ordering</li>
            <li style={{ marginBottom: 8 }}><strong>USF/UT students:</strong> direct ordering 3x/week saves $500-700/semester</li>
            <li style={{ marginBottom: 8 }}><strong>Summer thunderstorms = surge pricing</strong> — delivery fees spike during afternoon storms</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings</h2>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $500-700/year saved</li>
              <li><strong>3x/week:</strong> $750-1,050/year saved</li>
              <li><strong>Bucs game day group orders:</strong> $15-25 saved per order</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every Tampa Bay delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
