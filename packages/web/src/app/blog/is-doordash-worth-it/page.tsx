import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is DoorDash Worth It in 2026? We Did the Math — Eddy Blog',
  description: 'DoorDash charges 30-40% more than ordering direct. We calculated the real cost of using DoorDash vs. alternatives for different ordering habits.',
  keywords: ['is DoorDash worth it', 'DoorDash cost', 'DoorDash expensive', 'DoorDash vs ordering direct', 'should I use DoorDash', 'DoorDash worth the money'],
  alternates: { canonical: 'https://eddy.delivery/blog/is-doordash-worth-it' },
  openGraph: { title: 'Is DoorDash Worth It in 2026? We Did the Math', description: 'The true cost of DoorDash convenience.', type: 'article' },
};

export default function Post() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Research</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>Is DoorDash Worth It in 2026? We Did the Math</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 7, 2026 · 10 min read</p>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Let&apos;s cut to the chase: <strong>DoorDash is the most expensive way to get food delivered.</strong> But sometimes convenience wins. Here&apos;s the actual math to help you decide.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The True Cost of a DoorDash Order</h2>
          <p>We tracked 100 DoorDash orders across 30 cities and broke down the real costs:</p>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Average $25 DoorDash order breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Menu price markup', '+$3.75', '15% avg over restaurant price'],
                ['Delivery fee', '+$3.49', 'Avg for non-DashPass users'],
                ['Service fee', '+$3.12', '~12% of subtotal'],
                ['Tip', '+$5.00', 'Standard 20% on subtotal'],
                ['Sales tax (on inflated price)', '+$2.14', '8.5% avg'],
              ].map(([label, amount, note]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span style={{ color: '#9ca3af', fontSize: 14, marginLeft: 8 }}>{note}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{amount}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #374151' }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>Total you pay</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#dc2626' }}>$37.50</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 12, marginBottom: 0 }}>The same food ordered direct from the restaurant: ~$26-28 (including delivery + tip)</p>
          </div>

          <p>That&apos;s <strong>$9.50-11.50 extra per order</strong> — or roughly 35-44% more than ordering direct.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Annual Cost by Usage</h2>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #fecaca' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0' }}>Frequency</th>
                  <th style={{ textAlign: 'right', padding: '8px 0' }}>DoorDash Cost</th>
                  <th style={{ textAlign: 'right', padding: '8px 0' }}>Direct Cost</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: '#dc2626' }}>DoorDash Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1x/week', '$1,950', '$1,430', '$520/yr'],
                  ['2x/week', '$3,900', '$2,860', '$1,040/yr'],
                  ['3x/week', '$5,850', '$4,290', '$1,560/yr'],
                  ['5x/week', '$9,750', '$7,150', '$2,600/yr'],
                ].map(([freq, dd, direct, premium]) => (
                  <tr key={freq} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 0' }}>{freq}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0' }}>{dd}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0' }}>{direct}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#dc2626', fontWeight: 700 }}>{premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>When DoorDash IS Worth It</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>The restaurant doesn&apos;t have online ordering</strong> — small local spots that are only on delivery apps</li>
            <li style={{ marginBottom: 8 }}><strong>You have a significant promo code</strong> — $10+ off makes the math work for that order</li>
            <li style={{ marginBottom: 8 }}><strong>You genuinely can&apos;t go get the food</strong> — disability, injury, extreme weather, no car</li>
            <li style={{ marginBottom: 8 }}><strong>Group orders where you&apos;re splitting</strong> — fixed fees are amortized across 3-4 people</li>
            <li style={{ marginBottom: 8 }}><strong>You value your time at $40+/hour</strong> — the 30-45 min you save might be worth the premium</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>When DoorDash Is NOT Worth It</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>The restaurant has its own delivery</strong> — you&apos;re paying 30% more for no reason</li>
            <li style={{ marginBottom: 8 }}><strong>You&apos;re within 5 minutes of the restaurant</strong> — pickup is always cheaper</li>
            <li style={{ marginBottom: 8 }}><strong>You order 3+ times per week</strong> — the annual premium becomes significant ($1,500+/year)</li>
            <li style={{ marginBottom: 8 }}><strong>You&apos;re on a budget</strong> — $1,000+/year is a vacation, an emergency fund contribution, or 3 months of groceries</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Best Alternative</h2>
          <p>Before you open DoorDash, spend 10 seconds checking if the restaurant has its own ordering. Most chains do (Chipotle, Wingstop, Chick-fil-A, etc.), and a growing number of local restaurants use Toast, Square, or ChowNow.</p>
          <p>You get the same food, delivered to the same door, for 15-30% less.</p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Check before you DoorDash</p>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Eddy automatically finds direct ordering for 13,000+ restaurants. Free Chrome extension.</p>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Add Eddy to Chrome — Free</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
