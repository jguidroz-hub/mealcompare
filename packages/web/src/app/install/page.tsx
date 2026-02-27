import type { Metadata } from 'next';
import Link from 'next/link';

const CWS_URL = 'https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob';

export const metadata: Metadata = {
  title: 'Install Eddy — Chrome Extension',
  description: 'Install the Eddy Chrome extension and start saving on food delivery. Free forever.',
};

export default function InstallPage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back link */}
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '40px' }}>
          ← Back to Eddy
        </Link>

        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Install Eddy
        </h1>

        <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
          Add Eddy to Chrome in one click. Free forever — no account required.
        </p>

        {/* Chrome Web Store link (primary) */}
        <a
          href={CWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            borderRadius: '12px', padding: '24px 28px', marginBottom: '40px',
            display: 'flex', alignItems: 'center', gap: '16px',
            textDecoration: 'none', color: 'white',
            boxShadow: '0 4px 24px rgba(59,130,246,0.3)',
            transition: 'transform 0.2s',
          }}
        >
          <span style={{ fontSize: '40px' }}>🧩</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>Add to Chrome — Free</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
              Chrome Web Store · One-click install · Automatic updates
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '24px' }}>→</span>
        </a>

        {/* How it works */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>How it works</h2>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '28px' }}>
            <Step
              number={1}
              title="Install from Chrome Web Store"
              description='Click the button above and hit "Add to Chrome". That\'s it — Eddy is ready.'
            />

            <Step
              number={2}
              title="Set your city"
              description={undefined}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                <p>Right-click the Eddy icon in your toolbar and select &quot;Options&quot; to choose your city.</p>
                <p style={{ marginTop: '8px' }}>
                  Available in <strong style={{ color: '#e2e8f0' }}>30 cities</strong> including NYC, Chicago, LA, SF, Boston, Miami, DC, Austin, Houston, Atlanta, Seattle, Denver, Dallas, Phoenix, Portland, Nashville, New Orleans, and more.
                </p>
              </div>
            </Step>

            <Step
              number={3}
              title="Browse any delivery app"
              description="Open DoorDash, Uber Eats, or Grubhub like normal. Add items to your cart. Eddy automatically detects your order."
            />

            <Step
              number={4}
              title="See the cheapest option 💰"
              description="Click the Eddy icon to see a full price comparison — including direct ordering from the restaurant at 10-20% less."
            />
          </div>
        </div>

        {/* Pro tips */}
        <div style={{ marginTop: '48px', padding: '24px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>💡 Pro tips</h2>
          <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.8 }}>
            <p><strong style={{ color: '#e2e8f0' }}>Pin to toolbar:</strong> Click the puzzle piece icon (🧩) in Chrome and pin Eddy for easy access.</p>
            <p style={{ marginTop: '8px' }}><strong style={{ color: '#e2e8f0' }}>Direct ordering:</strong> Eddy finds restaurant websites (Toast, Square, ChowNow) where the same food is 10-20% cheaper with no service fee.</p>
            <p style={{ marginTop: '8px' }}><strong style={{ color: '#e2e8f0' }}>Average savings:</strong> $5-15 per order. For a family ordering twice a week, that&apos;s $500-1,500/year.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center' as const }}>
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#10b981', color: 'white', padding: '16px 40px',
              borderRadius: '10px', textDecoration: 'none', fontWeight: 800,
              fontSize: '17px', display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
            }}
          >
            🧩 Add to Chrome — Free
          </a>
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
            No account · No data selling · Free forever
          </p>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title, description, children }: {
  number: number; title: string; description?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: '#10b981', color: 'white', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '16px', flexShrink: 0,
      }}>
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
        {description && <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{description}</p>}
        {children}
      </div>
    </div>
  );
}
