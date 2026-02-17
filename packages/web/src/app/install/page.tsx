import type { Metadata } from 'next';
import Link from 'next/link';
import WaitlistForm from './WaitlistForm';

export const metadata: Metadata = {
  title: 'Install SkipTheFee — Chrome Extension',
  description: 'Install the SkipTheFee Chrome extension and start saving on food delivery.',
};

export default function InstallPage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back link */}
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '40px' }}>
          ← Back to SkipTheFee
        </Link>

        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Install SkipTheFee
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          SkipTheFee is in early access. Install it directly in Chrome in under 60 seconds.
          We&apos;re submitting to the Chrome Web Store soon — for now, use Developer Mode.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '32px' }}>
          <Step
            number={1}
            title="Download the extension"
            description="Click below to download the SkipTheFee extension ZIP file."
          >
            <a
              href="/skipthefee-extension.zip"
              download
              style={{
                background: '#10b981', color: 'white', padding: '12px 24px',
                borderRadius: '8px', textDecoration: 'none', fontWeight: 700,
                fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              ⬇️ Download SkipTheFee v0.1.0
            </a>
          </Step>

          <Step
            number={2}
            title="Unzip the file"
            description="Extract the downloaded ZIP file. You'll get a folder called 'skipthefee-extension'."
          />

          <Step
            number={3}
            title="Open Chrome Extensions"
            description={undefined}
          >
            <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
              <p>In Chrome, go to <code style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>chrome://extensions</code></p>
              <p style={{ marginTop: '8px' }}>Or: Chrome menu → Extensions → Manage Extensions</p>
            </div>
          </Step>

          <Step
            number={4}
            title="Enable Developer Mode"
            description="Toggle the 'Developer mode' switch in the top-right corner of the Extensions page."
          />

          <Step
            number={5}
            title='Click "Load unpacked"'
            description="Click the 'Load unpacked' button that appears, then select the unzipped folder."
          />

          <Step
            number={6}
            title="You're set! 🎉"
            description="Browse DoorDash, Uber Eats, or Grubhub. SkipTheFee will automatically detect your cart and show you cheaper options."
          >
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', marginTop: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                <strong style={{ color: '#e2e8f0' }}>Pro tip:</strong> Pin SkipTheFee to your toolbar for easy access.
                Click the puzzle piece icon (🧩) in Chrome and pin SkipTheFee.
              </div>
            </div>
          </Step>
        </div>

        {/* Settings */}
        <div style={{ marginTop: '48px', padding: '24px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>⚙️ Settings</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
            After installation, right-click the SkipTheFee icon and select &quot;Options&quot; to set your city:
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.8, marginTop: '8px' }}>
            SkipTheFee works across <strong style={{ color: '#e2e8f0' }}>30 cities</strong> including NYC, Chicago, LA, SF, Boston, Miami, DC, Austin, Houston, Atlanta, Seattle, Denver, Dallas, Phoenix, Portland, Nashville, New Orleans, and more.
          </p>
        </div>

        {/* Waitlist for Chrome Web Store */}
        <WaitlistForm />
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
