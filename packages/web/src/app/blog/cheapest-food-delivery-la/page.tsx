import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Los Angeles (2026): Save on Every Order — Eddy Blog',
  description: 'LA food delivery markup averages 25-35%. We compared DoorDash, Uber Eats, Postmates, and direct ordering for popular LA restaurants.',
  keywords: ['cheapest food delivery Los Angeles', 'LA food delivery', 'cheap delivery LA', 'DoorDash Los Angeles prices', 'Uber Eats LA', 'food delivery Los Angeles'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-la' },
  openGraph: {
    title: 'Cheapest Food Delivery in Los Angeles (2026)',
    description: 'Real price comparisons for LA restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliveryLAPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fff7ed', color: '#c2410c', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Los Angeles</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in Los Angeles (2026): Save on Every Order
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>LA is the delivery capital of the West Coast. Between long commutes and traffic, Angelenos order delivery more than almost any other city. But DoorDash and Uber Eats are taking a massive cut of every order.</p>

          <p>We compared real prices across platforms for popular LA restaurants. <strong>Direct ordering saves $5-8 per order on average.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>LA&apos;s Delivery Ecosystem</h2>

          <p>LA has every delivery platform fighting for market share:</p>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>DoorDash:</strong> Dominant. Best suburban coverage (Valley, OC, IE).</li>
            <li><strong>Uber Eats / Postmates:</strong> Uber acquired Postmates in 2020. Strong in West LA, Hollywood, DTLA.</li>
            <li><strong>Grubhub:</strong> Smaller but present. Better for some local restaurants.</li>
            <li><strong>Direct ordering:</strong> Huge in LA — In-N-Out, Raising Cane&apos;s, Chipotle, and hundreds of local spots use Toast/Square/ChowNow.</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: LA Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>In-N-Out — Double-Double combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.23</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Marked up + $3.99 delivery + service fee</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Pickup (in-n-out.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$9.90</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Menu price, no delivery (In-N-Out is pickup only)</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>DoorDash charges 74% more (In-N-Out doesn&apos;t do their own delivery)</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito + chips & guac</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$23.18</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.45</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.73 (25%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 boneless wings + large fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$23.47</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.89</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.58 (24%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>LA Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Chipotle", "Wingstop", "Raising Cane's", "Chick-fil-A",
              "Shake Shack", "Sweetgreen", "Cava", "El Pollo Loco",
              "The Halal Guys", "Panera Bread", "Blaze Pizza", "MOD Pizza",
              "Domino's", "Papa John's", "Five Guys", "Jack in the Box",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>LA-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>LA County sales tax: 9.5%</strong> — that&apos;s on the already-inflated price, adding $1-2 extra per order</li>
            <li style={{ marginBottom: 8 }}><strong>In-N-Out doesn&apos;t deliver</strong> — any In-N-Out on DoorDash is a third party marking it up 50-80%</li>
            <li style={{ marginBottom: 8 }}><strong>Many taco shops and local restaurants use Toast or Square</strong> — check their website before opening DoorDash</li>
            <li style={{ marginBottom: 8 }}><strong>UCLA/USC/CSUN students:</strong> direct ordering 3-4x/week saves $600-800/semester</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings in LA</h2>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $570-800/year saved</li>
              <li><strong>3x/week:</strong> $858-1,200/year saved</li>
              <li><strong>Family of 4:</strong> $1,400-1,950/year saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every LA delivery order</p>
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
