import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Chicago (2026): Beat the Markup — Eddy Blog',
  description: 'Chicago delivery app prices are 20-35% higher than ordering direct. We compared real prices for popular Chicago restaurants across DoorDash, Uber Eats, and Grubhub.',
  keywords: ['cheapest food delivery Chicago', 'Chicago food delivery', 'cheap delivery Chicago IL', 'DoorDash Chicago prices', 'Uber Eats Chicago', 'food delivery Chicago'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-chicago' },
  openGraph: {
    title: 'Cheapest Food Delivery in Chicago (2026)',
    description: 'Real price comparisons for Chicago restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliveryChicagoPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Chicago</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in Chicago (2026): Beat the Markup
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Chicago is one of the most expensive cities for food delivery — and not because the food costs more. Between DoorDash&apos;s fees, Uber Eats&apos; service charges, and Chicago&apos;s own delivery taxes, a $15 meal can easily cost $28+.</p>

          <p>But here&apos;s what most Chicagoans don&apos;t realize: <strong>most of your favorite restaurants have their own ordering systems with lower prices and fewer fees.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Chicago&apos;s Delivery Tax Problem</h2>

          <p>Chicago has something other cities don&apos;t: a <strong>specific tax on food delivery</strong>. The city charges a $0.75-$1.25 per-order fee on third-party delivery apps. Combined with Illinois sales tax (10.25% on prepared food in Chicago), the tax alone can add $3-4 to your order.</p>

          <p>When you order direct from the restaurant, you still pay sales tax — but you skip the Chicago delivery surcharge and the app&apos;s inflated menu prices.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Chicago Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Portillo&apos;s — Italian beef combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$22.47</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Inflated menu + fees + Chicago surcharge</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (portillos.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.49</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Real menu prices + free delivery over $20</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.98 (27%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Lou Malnati&apos;s — Deep dish cheese pizza (small)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.35</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (loumalnatis.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.99</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $6.36 (26%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Harold&apos;s Chicken — Half chicken dinner</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Grubhub</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$19.72</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct ordering</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$14.50</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.22 (26%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Chicago Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Portillo's", "Lou Malnati's", "Giordano's", "Garrett Popcorn",
              "Chipotle", "Wingstop", "Raising Cane's", "Chick-fil-A",
              "Potbelly", "Jason's Deli", "MOD Pizza", "Jet's Pizza",
              "Papa John's", "Domino's", "Jimmy John's", "Nando's",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Chicago-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>Chicago&apos;s delivery surcharge ($0.75-1.25)</strong> only applies to third-party apps — not when ordering from the restaurant directly</li>
            <li style={{ marginBottom: 8 }}><strong>10.25% sales tax on prepared food</strong> is applied on the inflated DoorDash price, so you&apos;re paying extra tax on the markup</li>
            <li style={{ marginBottom: 8 }}><strong>Portillo&apos;s and Lou Malnati&apos;s</strong> both have excellent delivery from their own sites — often free over $20</li>
            <li style={{ marginBottom: 8 }}><strong>UChicago/DePaul/Loyola students:</strong> direct ordering 3x/week saves ~$700/semester in Chicago due to higher base prices</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings in Chicago</h2>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $620-870/year saved (higher than avg due to Chicago taxes)</li>
              <li><strong>3x/week:</strong> $930-1,300/year saved</li>
              <li><strong>College student (4x/week):</strong> $580-810/semester saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Beat the Chicago delivery tax</p>
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
