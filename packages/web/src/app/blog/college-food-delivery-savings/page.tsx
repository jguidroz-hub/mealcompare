import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How College Students Can Save $240/Semester on Food Delivery — Eddy Blog',
  description: 'The average college student spends $2,400/year on delivery apps. Here\'s the math on how to cut that by 30% without changing what you eat.',
  keywords: ['college food delivery savings', 'save money DoorDash college', 'cheap food delivery students', 'college budget food tips'],
  alternates: { canonical: 'https://eddy.delivery/blog/college-food-delivery-savings' },
  openGraph: {
    title: 'How College Students Can Save $240/Semester on Food Delivery',
    description: 'The math is simple: delivery apps charge 15-30% more. Here\'s how to stop paying it.',
    type: 'article',
    url: 'https://eddy.delivery/blog/college-food-delivery-savings',
  },
};

export default function CollegeSavingsPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Student Guide</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          How College Students Can Save $240/Semester on Food Delivery
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 6, 2026 · 6 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>If you order delivery 3 times a week (and let&apos;s be honest, most college students order more), you&apos;re spending roughly <strong>$2,400 per year</strong> on food delivery. That&apos;s not the food — that&apos;s the <em>markup</em> from delivery apps.</p>

          <p>Here&apos;s how it works, and how to stop overpaying.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Hidden Markup You&apos;re Paying</h2>

          <p>DoorDash, Uber Eats, and Grubhub all charge restaurants a commission of <strong>15-30%</strong> per order. Restaurants pass that cost to you through inflated menu prices. A $12 burrito at Chipotle&apos;s counter? That&apos;s $14-15 on DoorDash before fees.</p>

          <p>Then add:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>Service fee:</strong> 10-15% of your subtotal</li>
            <li><strong>Delivery fee:</strong> $1.99-5.99</li>
            <li><strong>Small order fee:</strong> $2-3 if your order is under $12</li>
            <li><strong>Tip:</strong> $3-5 (you should still tip your driver)</li>
          </ul>

          <p>That $12 burrito just became a $22 burrito.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Fix: Order Direct</h2>

          <p>Most restaurants you love have their own online ordering system. Torchy&apos;s has one. Raising Cane&apos;s has one. Pluckers, Via 313, Chick-fil-A — they all have apps or websites where you can order at <strong>regular menu prices</strong> with no service fee.</p>

          <p>The problem? Nobody knows these exist. Or if they do, it&apos;s too much effort to check every restaurant&apos;s website.</p>

          <p>That&apos;s why we built <Link href="/" style={{ color: '#2563eb', fontWeight: 600 }}>Eddy</Link> — a free Chrome extension that automatically checks if there&apos;s a cheaper direct ordering option when you&apos;re browsing DoorDash, Uber Eats, or Grubhub.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Math</h2>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <p style={{ margin: 0 }}>
              <strong>3 orders/week</strong> × <strong>$5 average savings</strong> × <strong>16 weeks/semester</strong> = <strong style={{ color: '#059669', fontSize: 20 }}>$240 saved per semester</strong>
            </p>
          </div>

          <p>That&apos;s $480/year. Over four years of college, that&apos;s <strong>$1,920</strong> — enough for a spring break trip, a new laptop, or 2 months of rent.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Other Tips</h2>

          <ol style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 12 }}><strong>Pick up when you can.</strong> Saves $5-8 per order instantly. If the restaurant is within walking distance, just go get it.</li>
            <li style={{ marginBottom: 12 }}><strong>Stack credit card rewards.</strong> The Chase Sapphire Preferred gives 3x points on dining. The Amex Gold gives 4x on restaurants. Use these on the orders you can&apos;t avoid.</li>
            <li style={{ marginBottom: 12 }}><strong>Skip the subscription trap.</strong> DashPass and Uber One seem like deals, but they lock you into one platform. Eddy finds the cheapest option across ALL platforms.</li>
            <li style={{ marginBottom: 12 }}><strong>Order with friends.</strong> Splitting a larger order eliminates small order fees and reduces the per-person delivery cost.</li>
          </ol>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Bottom Line</h2>

          <p>You&apos;re going to order delivery. That&apos;s fine. But you don&apos;t have to pay a 30% tax on it. Install <Link href="/install" style={{ color: '#2563eb', fontWeight: 600 }}>Eddy</Link>, order from your favorite restaurants, and keep the difference.</p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Ready to start saving?</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Free Chrome extension. No account. No data collected.</p>
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
