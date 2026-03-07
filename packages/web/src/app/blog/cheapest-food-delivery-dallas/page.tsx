import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Dallas (2026): Stop Overpaying — Eddy Blog',
  description: 'DoorDash and Uber Eats charge 15-30% more than ordering direct. We compared real prices for popular Dallas restaurants.',
  keywords: ['cheapest food delivery Dallas', 'Dallas food delivery', 'cheap delivery Dallas TX', 'DoorDash Dallas prices', 'Uber Eats Dallas', 'food delivery Dallas Texas'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-dallas' },
  openGraph: {
    title: 'Cheapest Food Delivery in Dallas (2026)',
    description: 'Real price comparisons for Dallas restaurants across delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliveryDallasPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Dallas</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in Dallas (2026): Stop Overpaying
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>DFW is one of the biggest food delivery markets in the country. DoorDash, Uber Eats, and Grubhub are all competing for your orders — but they&apos;re all charging you more than you need to pay.</p>

          <p>We compared delivery prices for popular Dallas-Fort Worth restaurants across platforms. <strong>Direct ordering wins nearly every time.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>How Much Are You Overpaying?</h2>

          <p>Delivery apps charge restaurants 15-30% commission per order. Restaurants pass that cost to you through inflated menu prices. On top of that, you pay delivery fees, service fees, and sometimes a &quot;small order fee.&quot;</p>

          <p>The total markup on an average DoorDash order in Dallas: <strong>25-40% more</strong> than ordering the same food direct from the restaurant.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Dallas Price Comparisons</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>In-N-Out — Double-Double combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.82</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Pickup (no delivery)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$9.45</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>DoorDash charges 78% more (In-N-Out doesn&apos;t do delivery)</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 boneless wings + fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$22.34</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.19</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.15 (23%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito bowl + chips & guac</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$21.47</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.80</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.67 (22%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>DFW Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Whataburger", "Raising Cane's", "Wingstop", "Chipotle",
              "Chick-fil-A", "Fuzzy's Taco Shop", "Jason's Deli", "Dickey's BBQ",
              "McAlister's Deli", "MOD Pizza", "Newk's Eatery", "Potbelly",
              "Zaxby's", "Freebirds", "Pie Five", "Which Wich",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>DFW-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>Dallas sales tax is 8.25%</strong> — that&apos;s calculated on the inflated price, so you&apos;re paying extra tax on the markup</li>
            <li style={{ marginBottom: 8 }}><strong>Favor is popular here</strong> — but still marks up menu items at many restaurants</li>
            <li style={{ marginBottom: 8 }}><strong>Many DFW restaurants offer free delivery</strong> over $20-25 when ordering from their own site</li>
            <li style={{ marginBottom: 8 }}><strong>Check for restaurant apps</strong> — chains like Whataburger and Chick-fil-A have their own apps with rewards programs</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings in DFW</h2>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $520-728/year saved</li>
              <li><strong>3x/week:</strong> $780-1,092/year saved</li>
              <li><strong>College student (SMU/UNT/UTD):</strong> $480-672/semester saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stop overpaying for DFW delivery</p>
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
