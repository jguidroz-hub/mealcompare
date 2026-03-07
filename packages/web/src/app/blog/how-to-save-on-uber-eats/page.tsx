import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '9 Ways to Save Money on Uber Eats in 2026 — Eddy Blog',
  description: 'Cut your Uber Eats bill by 25-40%. From Uber One math to the direct ordering trick that saves the most money.',
  keywords: ['save money Uber Eats', 'Uber Eats tips', 'Uber Eats cheaper', 'Uber Eats hacks 2026', 'reduce Uber Eats fees', 'Uber One worth it'],
  alternates: { canonical: 'https://eddy.delivery/blog/how-to-save-on-uber-eats' },
  openGraph: { title: '9 Ways to Save Money on Uber Eats in 2026', description: 'Cut your Uber Eats bill by 25-40%.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Tips</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>9 Ways to Save Money on Uber Eats in 2026</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 8 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Uber Eats is the second-largest delivery platform in the US, and like DoorDash, it&apos;s not cheap. Between inflated menu prices, service fees, delivery fees, and the &quot;small cart fee,&quot; a $12 meal often becomes $20+.</p>
          <p>Here&apos;s how to actually reduce what you&apos;re paying:</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>1. Order Direct From the Restaurant (Saves 15-30%)</h2>
          <p>The same trick that works for DoorDash works for Uber Eats — and it&apos;s the single biggest money saver. Uber Eats charges restaurants 15-30% commission. Restaurants pass that cost to you through higher menu prices.</p>
          <p>When you order from the restaurant&apos;s own website or app, you pay the real menu price.</p>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <p style={{ margin: 0 }}><strong>Real example:</strong> Wingstop 10-piece combo costs $17.99 on Uber Eats vs. $14.99 on wingstop.com. That&apos;s $3.00 in menu markup alone — before Uber adds $3.49 service fee and $2.99 delivery fee.</p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>2. Is Uber One Worth It? (Do the Math)</h2>
          <p>Uber One costs <strong>$9.99/month</strong> and gives you:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
            <li>$0 delivery fee on eligible orders over $15</li>
            <li>5% off eligible orders</li>
            <li>Reduced service fees</li>
          </ul>
          <p>The math: if you save ~$4 per order on fees, you need <strong>3+ orders per month</strong> to break even. But Uber One doesn&apos;t fix inflated menu prices. If you&apos;re ordering 3+ times per month from restaurants that have their own ordering, switching to direct ordering saves more than Uber One.</p>
          <p><strong>Uber One makes sense if:</strong> you use Uber rides frequently (it covers both), AND the restaurants you order from don&apos;t have direct ordering.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>3. Use Priority vs. Standard Delivery</h2>
          <p>Uber Eats defaults to &quot;Priority&quot; delivery (direct to you). Switch to &quot;Standard&quot; delivery (grouped with other orders) and save $1-3 per order. Your food takes 10-15 minutes longer but costs meaningfully less.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>4. Order During Off-Peak Times</h2>
          <p>Like all delivery apps, Uber Eats uses surge pricing. Delivery fees spike during lunch (11:30 AM - 1 PM) and dinner (5:30 - 8 PM) rushes. Off-peak orders often have $0-2 delivery fees vs. $5-7 during peak.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>5. Stack Uber One With Credit Card Rewards</h2>
          <p>If you do use Uber One, pair it with a rewards card:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>Amex Gold:</strong> 4x points on restaurants (includes Uber Eats)</li>
            <li><strong>Capital One Savor:</strong> 4% cash back on dining</li>
            <li><strong>Amex Platinum:</strong> Includes $200/year Uber credit (covers Uber One + orders)</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>6. Check the &quot;Deals&quot; Tab</h2>
          <p>Uber Eats has a dedicated Deals section with restaurant-specific promos: BOGO, $5 off $20, free delivery, etc. Always check before ordering. These rotate weekly.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>7. Use Pickup</h2>
          <p>Uber Eats pickup eliminates the delivery fee entirely and often has lower service fees. If the restaurant is nearby, this is an easy save of $4-8 per order.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>8. Avoid the Small Cart Fee</h2>
          <p>Orders under $10 get hit with a &quot;small cart fee&quot; of $2-3. Always get above $10 — add a drink or side that costs less than the fee.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>9. Compare With DoorDash and Grubhub</h2>
          <p>Different apps charge different fees and have different promos for the same restaurant. Before placing a $25+ order, spend 30 seconds checking if DoorDash or Grubhub has a better deal.</p>
          <p>Or better yet — check if the restaurant has direct ordering and skip all three apps.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Real Math</h2>
          <p>If you order Uber Eats 3x/week and switch half those orders to direct ordering:</p>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 16 }}>
              <li><strong>Average savings per direct order:</strong> $5-7</li>
              <li><strong>Orders switched per week:</strong> 1.5</li>
              <li><strong>Annual savings:</strong> $390-546/year</li>
              <li><strong>Plus:</strong> you can cancel Uber One ($120/year)</li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Find direct ordering instantly</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Eddy checks 13,000+ restaurants for direct ordering links when you browse Uber Eats. Free Chrome extension.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
