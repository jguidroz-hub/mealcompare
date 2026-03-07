import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DashPass vs Uber One vs Grubhub+: Which Delivery Subscription Is Worth It? — Eddy Blog',
  description: 'We did the math on all three delivery app subscriptions. The answer might be: none of them. Here\'s why direct ordering beats every subscription.',
  keywords: ['DashPass vs Uber One', 'DashPass worth it', 'Uber One worth it', 'Grubhub Plus worth it', 'delivery subscription comparison 2026', 'DoorDash subscription'],
  alternates: { canonical: 'https://eddy.delivery/blog/dashpass-vs-uber-one-vs-grubhub-plus' },
  openGraph: { title: 'DashPass vs Uber One vs Grubhub+: Which Is Worth It?', description: 'We did the math. The answer might surprise you.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Comparison</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>DashPass vs Uber One vs Grubhub+: Which Delivery Subscription Is Worth It?</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 10 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>All three major delivery apps want you to subscribe. DashPass, Uber One, and Grubhub+ all promise lower fees and free delivery. But do they actually save you money?</p>
          <p>We compared all three — and found that for most people, <strong>none of them beat simply ordering direct from the restaurant.</strong></p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Subscriptions at a Glance</h2>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24, overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 700 }}></th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 700, color: '#dc2626' }}>DashPass</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 700, color: '#111' }}>Uber One</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 700, color: '#16a34a' }}>Grubhub+</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Price', '$9.99/mo', '$9.99/mo', '$9.99/mo'],
                  ['Free Delivery', 'Orders $12+', 'Orders $15+', 'Orders $12+'],
                  ['Service Fee', 'Reduced', 'Reduced + 5% off', 'Reduced'],
                  ['Min Order', '$12', '$15', '$12'],
                  ['Extras', 'No-rush savings', 'Uber ride benefits', 'Donation matching'],
                  ['Free Trial', '1 month', '1 month', '1 month'],
                ].map(([label, dp, uo, gh]) => (
                  <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{dp}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{uo}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{gh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Math: When Each Subscription Pays For Itself</h2>
          <p>Average savings per order with a subscription: ~$3-4 (delivery fee waived + reduced service fee).</p>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>Break-even:</strong> 3 orders/month (~$3.33 saved per order)</li>
              <li><strong>5 orders/month:</strong> saves ~$6.65/mo net ($80/year)</li>
              <li><strong>10 orders/month:</strong> saves ~$23.30/mo net ($280/year)</li>
            </ul>
          </div>
          <p>Looks decent. But here&apos;s the catch...</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>What Subscriptions Don&apos;t Fix</h2>
          <p><strong>None of these subscriptions fix inflated menu prices.</strong></p>
          <p>DashPass removes the $3-5 delivery fee. But you&apos;re still paying 10-25% more per item than the restaurant&apos;s own website. On a $25 order, that&apos;s $2.50-6.25 in hidden markup — often more than the delivery fee you just saved.</p>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#dc2626' }}>The subscription trap:</p>
            <p style={{ margin: 0 }}>Subscriptions make you feel like you&apos;re getting a deal, which makes you order more often. The apps know this — that&apos;s why they offer them. You save $3-4 on fees while paying $5-8 more on inflated items every order.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Direct Ordering vs. Every Subscription</h2>
          <p>Let&apos;s compare a real scenario: 8 delivery orders per month, averaging $25 each.</p>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>DoorDash with DashPass:</p>
              <p style={{ color: '#6b7280', margin: 0 }}>$25 × 8 = $200 + ~$16 service fees - $9.99 subscription = <strong>~$206/mo</strong></p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>DoorDash without subscription:</p>
              <p style={{ color: '#6b7280', margin: 0 }}>$25 × 8 = $200 + ~$40 delivery fees + ~$32 service fees = <strong>~$272/mo</strong></p>
            </div>
            <div style={{ borderTop: '2px solid #059669', paddingTop: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 4, color: '#059669' }}>Direct ordering:</p>
              <p style={{ color: '#6b7280', margin: 0 }}>$20 × 8 = $160 + ~$16 delivery fees = <strong>~$176/mo</strong></p>
            </div>
          </div>
          <p><strong>Direct ordering saves $30/mo vs. DashPass and $96/mo vs. no subscription.</strong> That&apos;s $360/year vs. DashPass and $1,152/year vs. paying full price.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>When a Subscription DOES Make Sense</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>Uber One:</strong> If you use Uber rides frequently, the combined value is real. The 5% off food orders helps too.</li>
            <li style={{ marginBottom: 8 }}><strong>DashPass:</strong> If you only order from restaurants that DON&apos;T have their own ordering (rare for chains, common for small local spots).</li>
            <li style={{ marginBottom: 8 }}><strong>Grubhub+:</strong> If it&apos;s included with your Amazon Prime membership (check — it was bundled in some markets).</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Our Recommendation</h2>
          <ol style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}>First, check if your favorite restaurants have direct ordering. Most do.</li>
            <li style={{ marginBottom: 8 }}>For restaurants that don&apos;t have direct ordering, use whichever app has the best promo that week.</li>
            <li style={{ marginBottom: 8 }}>Only subscribe if you order 8+ times/month from restaurants without their own ordering system.</li>
          </ol>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Skip the subscription. Order direct.</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Eddy finds direct ordering for 13,000+ restaurants. Saves more than any subscription — and it&apos;s free.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
