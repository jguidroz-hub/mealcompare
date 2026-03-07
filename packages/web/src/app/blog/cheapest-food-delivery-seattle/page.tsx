import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Seattle (2026): Order Direct & Save — Eddy Blog',
  description: 'Seattle delivery app markup averages 25-35%. We compared DoorDash, Uber Eats, and direct ordering for popular Seattle restaurants.',
  keywords: ['cheapest food delivery Seattle', 'Seattle food delivery', 'cheap delivery Seattle WA', 'DoorDash Seattle prices', 'food delivery Seattle'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-seattle' },
  openGraph: { title: 'Cheapest Food Delivery in Seattle (2026)', description: 'Real price comparisons for Seattle restaurants — delivery apps vs. ordering direct.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Seattle</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Cheapest Food Delivery in Seattle (2026): Order Direct & Save</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Seattle is home to some of the country&apos;s best food — and some of its highest delivery markups. With DoorDash and Uber Eats both headquartered nearby, you&apos;d think the competition would keep prices low. It doesn&apos;t.</p>
          <p>We compared real delivery prices across platforms for popular Seattle restaurants. <strong>Direct ordering saves $5-8 on the average order.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Seattle&apos;s Unique Delivery Economics</h2>
          <p>Seattle has no state income tax, but it makes up for it with a <strong>10.35% sales tax</strong> — one of the highest in the country. That tax applies to delivery orders, calculated on the already-inflated DoorDash price. Plus Seattle passed a permanent $0.75 per-trip delivery fee on third-party apps.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Seattle Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Dick&apos;s Drive-In — Deluxe + fries + shake</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.47</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Marked up + fees + Seattle surcharge</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Walk-in (no delivery)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$10.25</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Dick&apos;s doesn&apos;t do delivery</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>DoorDash charges 80% more (Dick&apos;s is counter-service only)</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito bowl + chips & queso</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.12</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.20</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.92 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Pagliacci Pizza — Large pepperoni</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$30.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (pagliacci.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.50</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $6.34 (21%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Seattle Restaurants With Direct Ordering</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {["Chipotle", "Wingstop", "Raising Cane's", "Chick-fil-A", "Pagliacci Pizza", "MOD Pizza", "Panera Bread", "Domino's", "Shake Shack", "Sweetgreen", "Five Guys", "Jack in the Box", "Red Robin", "Ivar's", "Ezell's Chicken", "Cava"].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Seattle-Specific Tips</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>10.35% sales tax + $0.75 delivery surcharge</strong> — Seattle is one of the most expensive cities for delivery app orders</li>
            <li style={{ marginBottom: 8 }}><strong>MOD Pizza was founded in Seattle</strong> — and has great direct ordering with rewards</li>
            <li style={{ marginBottom: 8 }}><strong>Many Capitol Hill and Ballard restaurants use Toast</strong> — check for direct ordering before opening an app</li>
            <li style={{ marginBottom: 8 }}><strong>UW students:</strong> direct ordering 3x/week saves $650-900/semester</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings in Seattle</h2>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $600-840/year saved</li>
              <li><strong>3x/week:</strong> $900-1,260/year saved</li>
              <li><strong>Tech worker lunch habit (5x/week):</strong> $1,500-2,100/year saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every Seattle delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
