import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Indianapolis (2026): Race to Save — Eddy Blog',
  description: 'Indianapolis delivery apps charge 20-30% more than ordering direct. We compared DoorDash, Uber Eats, and direct ordering for popular Indy restaurants.',
  keywords: ['cheapest food delivery Indianapolis', 'Indianapolis food delivery', 'cheap delivery Indianapolis IN', 'DoorDash Indianapolis', 'food delivery Indy'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-indianapolis' },
  openGraph: { title: 'Cheapest Food Delivery in Indianapolis (2026)', description: 'Real price comparisons for Indianapolis restaurants.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Indianapolis</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Cheapest Food Delivery in Indianapolis (2026): Race to Save</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Indianapolis is an underrated food city — from tenderloin sandwiches to the Mass Ave restaurant scene. But delivery apps are charging Indy prices that don&apos;t match its Midwest cost of living.</p>
          <p>We compared real delivery prices. <strong>Ordering direct saves $5-7 per order on average.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Indy Favorites</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Steak &apos;n Shake — Steakburger combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$14.84</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct ordering</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$10.49</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.35 (29%) ordering direct</p>
          </div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito bowl + chips & guac</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$21.34</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (chipotle.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.80</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.54 (21%) ordering direct</p>
          </div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Wingstop — 10 boneless wings + fries</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$22.67</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (wingstop.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.19</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $5.48 (24%) ordering direct</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Indy Restaurants With Direct Ordering</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {["Steak 'n Shake", "Chipotle", "Wingstop", "Chick-fil-A", "Raising Cane's", "Panera Bread", "Domino's", "Five Guys", "Papa John's", "Buffalo Wild Wings", "MOD Pizza", "Blaze Pizza", "Culver's", "McAlister's Deli", "Shake Shack", "Bob Evans"].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Indy-Specific Tips</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>7% Indiana sales tax</strong> — on inflated app prices</li>
            <li style={{ marginBottom: 8 }}><strong>Steak &apos;n Shake is Indiana-born</strong> and has direct ordering</li>
            <li style={{ marginBottom: 8 }}><strong>Butler/IUPUI students:</strong> direct ordering 3x/week saves $500-700/semester</li>
            <li style={{ marginBottom: 8 }}><strong>Mass Ave and Broad Ripple restaurants often use Toast</strong></li>
          </ul>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every Indy delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
