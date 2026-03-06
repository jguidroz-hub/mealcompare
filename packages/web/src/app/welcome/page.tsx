import type { Metadata } from 'next';
import Link from 'next/link';
import RefCapture from './RefCapture';

export const metadata: Metadata = {
  title: 'Welcome to Eddy!',
  description: 'You just installed Eddy. Here\'s how to start saving.',
};

export default function WelcomePage() {
  return (
    <>
    <RefCapture />
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 500, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Eddy is installed!
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>
          You&apos;re ready to save $5–15 on every food delivery order.
        </p>

        <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto 40px' }}>
          {[
            { icon: '🛒', title: 'Browse a delivery app', desc: 'Go to DoorDash, Uber Eats, or Grubhub' },
            { icon: '➕', title: 'Add items to your cart', desc: 'Shop like you normally would' },
            { icon: '💰', title: 'See the savings', desc: 'Eddy automatically compares prices across platforms + direct ordering' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < 2 ? '1px solid #1e293b' : 'none' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{step.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.doordash.com" style={{ background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
            Try it on DoorDash →
          </a>
          <Link href="/restaurants" style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid #334155' }}>
            Browse Restaurants
          </Link>
        </div>

        <p style={{ fontSize: 12, color: '#475569', marginTop: 24 }}>
          Tip: Click the Eddy icon in your toolbar anytime to see comparisons
        </p>
      </div>
    </main>
    </>
  );
}
