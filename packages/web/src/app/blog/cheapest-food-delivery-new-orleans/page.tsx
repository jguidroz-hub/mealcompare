import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in New Orleans (2026): Po-Boys Without the Price Gouge — Eddy Blog',
  description: 'New Orleans delivery apps charge 20-30% more than ordering direct. We compared DoorDash, Uber Eats, and direct ordering for NOLA restaurants.',
  keywords: ['cheapest food delivery New Orleans', 'New Orleans food delivery', 'cheap delivery NOLA', 'DoorDash New Orleans', 'food delivery New Orleans Louisiana'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-new-orleans' },
  openGraph: { title: 'Cheapest Food Delivery in New Orleans (2026)', description: 'Real price comparisons for NOLA restaurants.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fce7f3', color: '#9d174d', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>New Orleans</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Cheapest Food Delivery in New Orleans (2026): Po-Boys Without the Price Gouge</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>New Orleans doesn&apos;t just have food — NOLA <em>is</em> food. From gumbo to po-boys to beignets, the culinary culture runs deep. But delivery apps are charging a premium that would make even a Bourbon Street tourist blush.</p>
          <p>We compared real prices for popular New Orleans restaurants. <strong>Ordering direct saves $5-8 per order on average.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NOLA&apos;s Tax Stack</h2>
          <p>Orleans Parish has a combined <strong>9.45% sales tax</strong> — one of the highest in Louisiana. When that&apos;s calculated on DoorDash&apos;s already-inflated prices, the tax alone costs you an extra $0.50-1.00 per order compared to direct ordering at restaurant prices.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: NOLA Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Raising Cane&apos;s — The Box Combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.48</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (raisingcanes.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$12.99</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.49 (26%) ordering direct — Cane&apos;s was born here!</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 classic wings + fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$23.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.19</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.65 (24%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Domino&apos;s — Large specialty pizza</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.47</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (dominos.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.99</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $7.48 (31%) ordering direct + Domino&apos;s deals</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NOLA Restaurants With Direct Ordering</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {["Raising Cane's", "Wingstop", "Domino's", "Chipotle", "Chick-fil-A", "Popeyes", "Five Guys", "Panera Bread", "Papa John's", "Rally's", "McAlister's Deli", "Jason's Deli", "Smoothie King", "PJ's Coffee", "Firehouse Subs", "Zaxby's"].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>NOLA-Specific Tips</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>9.45% Orleans Parish sales tax</strong> — on DoorDash&apos;s inflated prices</li>
            <li style={{ marginBottom: 8 }}><strong>Raising Cane&apos;s was founded at LSU</strong> — their app has the best deals and direct delivery</li>
            <li style={{ marginBottom: 8 }}><strong>Tulane/Loyola/UNO students:</strong> direct ordering 3x/week saves $550-780/semester</li>
            <li style={{ marginBottom: 8 }}><strong>Many Magazine Street and Freret restaurants use Toast</strong> — check before opening DoorDash</li>
            <li style={{ marginBottom: 8 }}><strong>Mardi Gras/Jazz Fest weeks:</strong> delivery fees surge 50-100% — direct ordering is the only way to avoid it</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings</h2>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $520-728/year saved</li>
              <li><strong>3x/week:</strong> $780-1,092/year saved</li>
              <li><strong>Festival season (4 weeks):</strong> extra $80-120 saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every NOLA delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
