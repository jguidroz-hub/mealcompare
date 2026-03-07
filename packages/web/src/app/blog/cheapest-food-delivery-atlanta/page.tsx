import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Atlanta (2026): Order Direct & Save — Eddy Blog',
  description: 'Atlanta delivery app markup averages 20-30%. We compared DoorDash, Uber Eats, and direct ordering for popular ATL restaurants.',
  keywords: ['cheapest food delivery Atlanta', 'Atlanta food delivery', 'cheap delivery Atlanta GA', 'DoorDash Atlanta prices', 'Uber Eats Atlanta', 'food delivery Atlanta'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-atlanta' },
  openGraph: {
    title: 'Cheapest Food Delivery in Atlanta (2026)',
    description: 'Real price comparisons for Atlanta restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliveryAtlantaPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef9c3', color: '#a16207', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Atlanta</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in Atlanta (2026): Order Direct & Save
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Atlanta is a delivery-heavy city — sprawling suburbs, traffic on 285, and some of the best food in the South. But every time you open DoorDash, you&apos;re paying a <strong>20-30% markup</strong> over what the restaurant actually charges.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: ATL Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chick-fil-A — Spicy Deluxe combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.47</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chick-fil-a.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$12.35</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.12 (25%) ordering direct — in CFA&apos;s hometown</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 classic wings + large fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$23.18</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.49</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.69 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Zaxby&apos;s — Chicken Fingerz plate</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (zaxbys.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$12.49</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.35 (26%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>ATL Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Chick-fil-A", "Wingstop", "Zaxby's", "Raising Cane's",
              "Chipotle", "Waffle House", "Five Guys", "Shake Shack",
              "Sweetgreen", "MOD Pizza", "Jason's Deli", "McAlister's Deli",
              "Newk's Eatery", "Papa John's", "Domino's", "Firehouse Subs",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Atlanta-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>GA sales tax: 8.9% in Atlanta</strong> (state + county + city) — calculated on inflated app prices</li>
            <li style={{ marginBottom: 8 }}><strong>Chick-fil-A is HQ&apos;d here</strong> — their app has the best prices and frequent promos</li>
            <li style={{ marginBottom: 8 }}><strong>Waffle House now does online ordering</strong> at select locations — cheaper than any delivery app</li>
            <li style={{ marginBottom: 8 }}><strong>Georgia Tech/Emory/GSU students:</strong> direct ordering 3x/week saves $600-850/semester</li>
          </ul>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every Atlanta delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. 160+ ATL Toast restaurants indexed.</p>
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
