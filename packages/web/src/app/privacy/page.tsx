import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — MealCompare',
  description: 'MealCompare privacy policy.',
};

export default function PrivacyPage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', marginBottom: '40px', display: 'block' }}>
          ← Back to MealCompare
        </Link>

        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '40px' }}>Last updated: February 12, 2026</p>

        <div style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginTop: '32px', marginBottom: '12px' }}>What We Collect</h2>
          <p><strong style={{ color: '#e2e8f0' }}>Cart data:</strong> When you use MealCompare, we temporarily process the items in your delivery app cart to compare prices across platforms. This data is sent to our comparison API, used to generate your price comparison, and then discarded. We do not store your cart history.</p>

          <p style={{ marginTop: '12px' }}><strong style={{ color: '#e2e8f0' }}>Settings:</strong> Your selected metro area (Austin or DC) is stored locally in Chrome&apos;s sync storage. This never leaves your browser.</p>

          <p style={{ marginTop: '12px' }}><strong style={{ color: '#e2e8f0' }}>Waitlist email:</strong> If you voluntarily join our waitlist, we store your email address to send you a one-time notification when MealCompare is available on the Chrome Web Store. We do not sell or share your email.</p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginTop: '32px', marginBottom: '12px' }}>What We Don&apos;t Collect</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>We do not collect your name, address, or payment information</li>
            <li>We do not track your browsing history</li>
            <li>We do not store your delivery orders</li>
            <li>We do not use cookies or tracking pixels</li>
            <li>We do not sell any data to third parties</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginTop: '32px', marginBottom: '12px' }}>Permissions</h2>
          <p>MealCompare requests the following Chrome permissions:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong style={{ color: '#e2e8f0' }}>activeTab:</strong> To detect cart items on delivery platform pages you&apos;re actively viewing</li>
            <li><strong style={{ color: '#e2e8f0' }}>storage:</strong> To save your metro area preference locally</li>
            <li><strong style={{ color: '#e2e8f0' }}>Host permissions (doordash.com, ubereats.com, grubhub.com, toast.site):</strong> To run content scripts that detect your cart items on these specific sites</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginTop: '32px', marginBottom: '12px' }}>Data Processing</h2>
          <p>When you compare prices, your cart items are sent to our API server (hosted on Vercel) via HTTPS. The server queries delivery platform APIs to find matching menu items and prices, then returns the comparison. No data is persisted on the server.</p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginTop: '32px', marginBottom: '12px' }}>Contact</h2>
          <p>Questions? Email us at <a href="mailto:hello@mealcompare.app" style={{ color: '#3b82f6' }}>hello@mealcompare.app</a></p>
        </div>
      </div>
    </main>
  );
}
