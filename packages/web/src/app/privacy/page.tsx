import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — SkipTheFee',
  description: 'SkipTheFee privacy policy. We don\'t sell your data.',
};

export default function PrivacyPage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, marginBottom: 32, display: 'block' }}>
          ← Back to SkipTheFee
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 32 }}>Last updated: February 12, 2026</p>

        {[
          {
            title: 'What We Collect',
            text: `SkipTheFee collects minimal data to provide price comparisons:

• **Cart data** — When you add items to your cart on DoorDash, Uber Eats, or Grubhub, the extension reads your cart contents (restaurant name, item names, quantities, prices) to compare prices across platforms. This data is sent to our server for comparison and is not stored after the comparison is complete.

• **Metro preference** — Your selected metro area is stored locally in your browser using Chrome's storage API.

• **Usage stats** — Number of comparisons made and total savings found, stored locally in your browser. Never sent to our servers.`
          },
          {
            title: 'What We Don\'t Collect',
            text: `• No personal information (no name, email, address, payment info)
• No browsing history beyond the delivery app pages
• No cookies or tracking pixels
• No account creation required
• No data sold to third parties — ever`
          },
          {
            title: 'Chrome Extension Permissions',
            text: `• **storage** — Save your metro preference and usage stats locally
• **host_permissions** — Access DoorDash, Uber Eats, Grubhub, and Toast pages to detect your cart and compare prices

We request only the minimum permissions needed. We do NOT request access to all websites or your browsing activity.`
          },
          {
            title: 'Data Sharing',
            text: `We do not sell, rent, or share your data with anyone. Cart data is sent to our comparison API (hosted on Vercel) only to perform the price comparison and is immediately discarded after the response is sent.`
          },
          {
            title: 'Third-Party Services',
            text: `• **Vercel** — Hosts our web application and API
• **Chrome Web Store** — Distributes the extension

No analytics, advertising, or tracking services are used.`
          },
          {
            title: 'Your Rights',
            text: `Since we don't store personal data, there's nothing to delete. Your local preferences can be cleared by removing the extension. If you have questions, contact us at hello@skipthefee.app.`
          },
          {
            title: 'Changes',
            text: `We may update this policy. Changes will be posted here with an updated date. Continued use of SkipTheFee after changes constitutes acceptance.`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{section.title}</h2>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {section.text}
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, marginTop: 40, fontSize: 13, color: '#475569' }}>
          Contact: hello@skipthefee.app · SkipTheFee is a product of Greenbelt Ventures
        </div>
      </div>
    </main>
  );
}
