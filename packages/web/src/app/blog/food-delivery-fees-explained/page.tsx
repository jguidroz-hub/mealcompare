import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Food Delivery Fees Explained: Every Fee DoorDash, Uber Eats & Grubhub Charge — Eddy Blog',
  description: 'A complete breakdown of every fee delivery apps charge: service fees, delivery fees, small order fees, surge pricing, and hidden menu markups.',
  keywords: ['food delivery fees', 'DoorDash fees explained', 'Uber Eats service fee', 'delivery app fees breakdown', 'hidden delivery fees', 'why is DoorDash so expensive'],
  alternates: { canonical: 'https://eddy.delivery/blog/food-delivery-fees-explained' },
  openGraph: { title: 'Every Fee DoorDash, Uber Eats & Grubhub Charge (2026)', description: 'Complete breakdown of delivery app fees.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Research</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Food Delivery Fees Explained: Every Fee the Apps Charge</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Ever look at your delivery app receipt and wonder where all the fees came from? You&apos;re not alone. Delivery apps have <strong>at least 6 different fee types</strong>, and most people don&apos;t realize how much they add up.</p>
          <p>Here&apos;s every fee explained, how much each one costs, and how to avoid them.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>1. Menu Price Markup (The Hidden Fee)</h2>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#dc2626' }}>Cost: 10-25% of your food</p>
            <p style={{ margin: 0, fontSize: 15 }}>This is the fee most people don&apos;t know about. Restaurants raise their prices on DoorDash/Uber Eats to cover the 15-30% commission the app charges them. A $10 burger at the restaurant becomes $12-13 on the app.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>2. Delivery Fee</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Cost: $0.99-7.99</p>
            <p style={{ margin: 0, fontSize: 15 }}>The most visible fee. Varies by distance, demand, and whether you have a subscription. During peak hours, delivery fees can surge to $5-8+. DashPass and Uber One reduce this to $0 on eligible orders.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>3. Service Fee</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Cost: 10-15% of subtotal ($2-6+)</p>
            <p style={{ margin: 0, fontSize: 15 }}>This is the app&apos;s cut. It&apos;s a percentage of your order subtotal (the already-inflated subtotal). DashPass reduces it; Uber One gives 5% off. But it never goes to zero.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>4. Small Order Fee</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Cost: $2-3 on orders under $10-12</p>
            <p style={{ margin: 0, fontSize: 15 }}>Ordering a single coffee? You&apos;ll pay this. It&apos;s designed to discourage small orders that aren&apos;t profitable for the app. Add items to get above $10-12 and it disappears.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>5. Priority/Express Fee</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Cost: $1-3 (often pre-selected)</p>
            <p style={{ margin: 0, fontSize: 15 }}>Uber Eats defaults to &quot;Priority&quot; delivery. Switch to &quot;Standard&quot; to avoid this. DoorDash has a similar &quot;Express&quot; option. Always check before confirming your order.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>6. Regulatory/City Fees</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Cost: $0.27-1.50 per order</p>
            <p style={{ margin: 0, fontSize: 15 }}>Some cities charge specific fees on delivery app orders: Chicago ($0.75-1.25), Seattle ($0.75), Colorado ($0.27). These are often passed to consumers and appear as separate line items.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Total Fee Stack on a $20 Meal</h2>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Menu markup', '+$3.00', '15%'],
                ['Delivery fee', '+$3.99', ''],
                ['Service fee', '+$2.76', '12% of inflated subtotal'],
                ['Tax (on inflated price)', '+$1.95', '8.5%'],
                ['Tip', '+$4.60', '20%'],
              ].map(([label, amt, note]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #fecaca', paddingBottom: 8 }}>
                  <span>{label} <span style={{ color: '#9ca3af', fontSize: 13 }}>{note}</span></span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{amt}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>You pay</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#dc2626' }}>$36.30</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 12, marginBottom: 0 }}>Direct ordering + tip: ~$25.50. <strong>You pay $10.80 extra (42%)</strong></p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>How to Minimize Every Fee</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>Fee</th>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>How to Avoid/Reduce</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Menu markup', 'Order direct from restaurant'],
                ['Delivery fee', 'DashPass/Uber One, or order during off-peak'],
                ['Service fee', 'Subscriptions reduce it; direct ordering eliminates it'],
                ['Small order fee', 'Order $12+ worth of food'],
                ['Priority fee', 'Switch to Standard delivery'],
                ['City fee', 'Can\'t avoid, but smaller when ordering direct'],
              ].map(([fee, fix]) => (
                <tr key={fee} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{fee}</td>
                  <td style={{ padding: '10px 0' }}>{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Skip the fee stack entirely</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Eddy finds direct ordering for 13,000+ restaurants. No menu markup, no service fee, no small order fee.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
