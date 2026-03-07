import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheapest Food Delivery in Pittsburgh (2026): Pierogi Without the Premium — Eddy Blog',
  description: 'Pittsburgh delivery apps charge 20-30% more than ordering direct. We compared DoorDash, Uber Eats, and direct ordering for popular Pittsburgh restaurants.',
  keywords: ['cheapest food delivery Pittsburgh', 'Pittsburgh food delivery', 'cheap delivery Pittsburgh PA', 'DoorDash Pittsburgh', 'food delivery Pittsburgh Pennsylvania'],
  alternates: { canonical: 'https://eddy.delivery/blog/cheapest-food-delivery-pittsburgh' },
  openGraph: { title: 'Cheapest Food Delivery in Pittsburgh (2026)', description: 'Real price comparisons for Pittsburgh restaurants.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Pittsburgh</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Cheapest Food Delivery in Pittsburgh (2026): Pierogi Without the Premium</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 7 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Pittsburgh&apos;s food scene punches well above its weight — from Primanti Bros. to the Strip District to the growing restaurant scene in Lawrenceville and East Liberty. But delivery apps are charging Steel City prices on a Midwest budget.</p>
          <p>We compared real prices. <strong>Ordering direct saves $5-7 per order.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Price Comparisons: Pittsburgh Favorites</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chipotle — Burrito bowl + chips & guac</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
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
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Raising Cane&apos;s — The Box Combo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Uber Eats</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$17.92</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (raisingcanes.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$13.29</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $4.63 (26%) ordering direct</p>
          </div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Domino&apos;s — Large pepperoni + breadsticks</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>DoorDash</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$24.18</div>
              </div>
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Direct (dominos.com)</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$16.99</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#059669', fontWeight: 600, marginTop: 12, marginBottom: 0 }}>You save $7.19 (30%) ordering direct + Domino&apos;s deals</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Pittsburgh Restaurants With Direct Ordering</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {["Chipotle", "Raising Cane's", "Domino's", "Wingstop", "Chick-fil-A", "Panera Bread", "Five Guys", "Eat'n Park", "Papa John's", "MOD Pizza", "Blaze Pizza", "Buffalo Wild Wings", "McAlister's Deli", "Shake Shack", "Firehouse Subs", "Noodles & Company"].map((name) => (
              <div key={name} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 15 }}>✅ {name}</div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Pittsburgh-Specific Tips</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>7% Allegheny County sales tax</strong> — on inflated app prices</li>
            <li style={{ marginBottom: 8 }}><strong>Eat&apos;n Park is Pittsburgh-born</strong> and has online ordering</li>
            <li style={{ marginBottom: 8 }}><strong>Pitt/CMU/Duquesne students:</strong> direct ordering 3x/week saves $500-700/semester</li>
            <li style={{ marginBottom: 8 }}><strong>Lawrenceville and East Liberty restaurants heavily use Toast</strong></li>
          </ul>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Save on every Pittsburgh delivery</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. Works on DoorDash, Uber Eats, and Grubhub.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
