import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DoorDash Markup Explained: Why Your Food Costs 30% More — Eddy Blog',
  description: 'DoorDash charges restaurants 15-30% commission, and restaurants raise menu prices to cover it. Here\'s exactly how much more you\'re paying.',
  keywords: ['DoorDash markup', 'DoorDash prices higher', 'DoorDash commission', 'why is DoorDash expensive', 'DoorDash hidden fees'],
  alternates: { canonical: 'https://eddy.delivery/blog/doordash-markup-explained' },
  openGraph: {
    title: 'DoorDash Markup Explained: Why Your Food Costs 30% More',
    description: 'The hidden math behind delivery app pricing.',
    type: 'article',
  },
};

export default function DoorDashMarkupPost() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Back to Blog</Link>
        
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>Research</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          DoorDash Markup Explained: Why Your Food Costs 30% More
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>March 6, 2026 · 7 min read</p>

        <div style={{ fontSize: 17, lineHeight: 1.8, color: '#374151' }}>
          <p>Ever notice that your Chipotle burrito costs more on DoorDash than in the store? You&apos;re not imagining it. Here&apos;s exactly what&apos;s happening.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>The Commission Structure</h2>

          <p>DoorDash charges restaurants a commission on every order. The rates vary by plan:</p>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>DoorDash Basic:</strong> 15% commission (delivery by restaurant)</li>
            <li><strong>DoorDash Plus:</strong> 25% commission (DoorDash handles delivery)</li>
            <li><strong>DoorDash Premier:</strong> 30% commission (priority placement + marketing)</li>
          </ul>

          <p>Most restaurants on DoorDash are on the Plus or Premier plan, meaning <strong>25-30% of every order goes to DoorDash</strong>. Restaurants have two choices: absorb that cost (and lose money on every order) or raise their menu prices.</p>

          <p>Most raise prices.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Real Price Differences We Found</h2>

          <p>We compared menu prices on DoorDash vs. the restaurant&apos;s own website for popular Austin restaurants:</p>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 700 }}>Item</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 700 }}>DoorDash</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 700 }}>Direct</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 700, color: '#059669' }}>You Save</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Chipotle Burrito Bowl', '$11.75', '$10.25', '$1.50'],
                  ['Via 313 Detroit Pepperoni', '$19.99', '$16.99', '$3.00'],
                  ['Pluckers 10-Piece Wings', '$18.49', '$15.99', '$2.50'],
                  ["Torchy's Trailer Park", '$6.75', '$5.95', '$0.80'],
                  ['Wingstop 10-Piece Combo', '$17.99', '$14.99', '$3.00'],
                ].map(([item, dd, direct, save]) => (
                  <tr key={item} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 0' }}>{item}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#dc2626' }}>{dd}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0' }}>{direct}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#059669', fontWeight: 600 }}>{save}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>And that&apos;s just the menu price difference. On top of that, DoorDash adds:</p>

          <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>Service fee:</strong> Typically 10-15% of your subtotal ($1.50-4.00)</li>
            <li><strong>Delivery fee:</strong> $1.99-5.99 depending on distance and demand</li>
            <li><strong>Small order fee:</strong> $2.00-3.00 for orders under $12</li>
          </ul>

          <p>A $15 meal becomes $22-28 on DoorDash. The same meal ordered direct? $15-18.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Why Restaurants Don&apos;t Just Leave</h2>

          <p>Restaurants stay on DoorDash because that&apos;s where customers are. It&apos;s a visibility play — they lose money on delivery orders but hope to convert you into a walk-in customer. Many restaurants have told us they&apos;d prefer you order from their own website.</p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>How to Stop Overpaying</h2>

          <p>The fix is simple: before you order on DoorDash, check if the restaurant has its own ordering system. Most do — through Toast, Square, ChowNow, or their own website.</p>

          <p>Or install <Link href="/" style={{ color: '#2563eb', fontWeight: 600 }}>Eddy</Link>, which does this automatically. When you browse a restaurant on DoorDash, Eddy checks our database of 9,500+ restaurants and shows you the direct ordering link if one exists.</p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, marginTop: 40, textAlign: 'center' as const }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stop paying the DoorDash tax</p>
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
