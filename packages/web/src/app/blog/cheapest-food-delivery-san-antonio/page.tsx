import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in San Antonio (2026): Real Prices Compared — Eddy Blog',
  description: 'We compared DoorDash, Uber Eats, and direct ordering prices for popular San Antonio restaurants. Order direct and save 15-30% every time.',
  keywords: ['cheapest food delivery San Antonio', 'San Antonio food delivery', 'cheap delivery San Antonio TX', 'DoorDash San Antonio', 'food delivery San Antonio Texas'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-san-antonio' },
  openGraph: {
    title: 'Cheapest Food Delivery in San Antonio (2026)',
    description: 'Real price comparisons for San Antonio restaurants — delivery apps vs. ordering direct.',
    type: 'article',
  },
};

export default function CheapestDeliverySanAntonioPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>San Antonio</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Cheapest Food Delivery in San Antonio (2026): Real Prices Compared
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>San Antonio is a top-10 US city by population, and delivery apps are booming here. But between DoorDash, Uber Eats, Grubhub, and Favor, you&apos;re probably paying way more than you need to.</p>

          <p>We priced identical orders across platforms for popular SA restaurants. <strong>Ordering direct from the restaurant saves 15-30% almost every time.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Why San Antonio Delivery Is So Expensive</h2>

          <p>Delivery apps charge restaurants 15-30% commission. Most restaurants pass that cost to you through higher menu prices. Then the app stacks on:</p>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>Service fee:</strong> 10-15% of your subtotal</li>
            <li><strong>Delivery fee:</strong> $1.99-5.99</li>
            <li><strong>Small order fee:</strong> $2-3 on orders under $12</li>
            <li><strong>SA sales tax (8.25%):</strong> calculated on the already-inflated price</li>
          </ul>

          <p>A $15 meal becomes $22-28 on DoorDash. The same meal ordered from the restaurant? $15-18.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: SA Favorites</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Bill Miller Bar-B-Q — Brisket plate</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$18.94</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Inflated menu + fees</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (billmillerbbq.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$13.99</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Real menu price + lower fees</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.95 (26%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Whataburger — Patty Melt combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.73</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (whataburger.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$12.29</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.44 (27%) ordering direct</p>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Raising Cane&apos;s — Box Combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (raisingcanes.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$13.59</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.25 (24%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>SA Restaurants With Direct Ordering</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {[
              "Whataburger", "Bill Miller Bar-B-Q", "Raising Cane's", "Chick-fil-A",
              "Chipotle", "Wingstop", "Jason's Deli", "McAlister's Deli",
              "Freebirds", "MOD Pizza", "Pei Wei", "Taco Cabana",
              "Church's Chicken", "Popeyes", "Papa John's", "Domino's",
            ].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>San Antonio-Specific Tips</h2>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>Favor is huge in SA</strong> — it&apos;s Texas-born (Austin) and has deep SA coverage, but still marks up menu prices</li>
            <li style={{ marginBottom: 8 }}><strong>Bill Miller, Taco Cabana, and Whataburger</strong> all have their own apps with rewards programs and lower prices</li>
            <li style={{ marginBottom: 8 }}><strong>UTSA students:</strong> ordering direct 3x/week saves ~$600/semester</li>
            <li style={{ marginBottom: 8 }}><strong>Military families:</strong> many SA restaurants near bases offer their own delivery — check before using an app</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Savings</h2>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>2x/week:</strong> $520-728/year saved</li>
              <li><strong>3x/week:</strong> $780-1,092/year saved</li>
              <li><strong>UTSA/Trinity student:</strong> $480-672/semester saved</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every San Antonio delivery</p>
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
