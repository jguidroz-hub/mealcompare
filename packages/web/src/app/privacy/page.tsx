import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Eddy',
  description: 'Eddy privacy policy. We collect minimal data and never sell it.',
};

export default function PrivacyPage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, marginBottom: 32, display: 'block' }}>
          ← Back to Eddy
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 32 }}>Last updated: February 21, 2026</p>

        {[
          {
            title: 'What We Collect',
            text: `When you visit a restaurant page on DoorDash, Uber Eats, or Grubhub, the Eddy extension sends the restaurant name and your approximate metro area to our servers (eddy.delivery) to check whether that restaurant has a direct ordering option.

We do not collect your name, email address, IP address, browsing history, purchase history, or any personally identifiable information.`
          },
          {
            title: 'What We Don\'t Collect',
            text: `• No personal information
• No browsing history
• No cart contents or order data
• No payment information
• No location beyond metro-level (e.g. "nyc"), stored locally in your browser
• No cookies or tracking pixels
• No account required`
          },
          {
            title: 'Local Storage',
            text: `The extension stores a list of recently-shown restaurant names in your browser's local storage to avoid showing repeat notifications. This data never leaves your device and is cleared when you remove the extension.`
          },
          {
            title: 'Chrome Extension Permissions',
            text: `• storage — Saves which restaurants you've already been shown, locally in your browser
• host_permissions (doordash.com, ubereats.com, grubhub.com) — Reads the restaurant name from the page to check our database
• host_permissions (eddy.delivery) — Calls our API to look up direct ordering options

We request only the minimum permissions required. We do not access your full browsing history or any pages outside of delivery app restaurant pages.`
          },
          {
            title: 'Data Sharing',
            text: `We do not sell, rent, or share your data with any third parties. Restaurant name lookups are used only to serve you the direct ordering result and are not retained in association with any user identity.`
          },
          {
            title: 'Third-Party Services',
            text: `Eddy is hosted on our own infrastructure. We do not use Google Analytics, Facebook Pixel, or any advertising or tracking services.`
          },
          {
            title: 'Your Rights',
            text: `Since we do not store personal data, there is nothing to delete. Your local preferences and notification history can be cleared by removing the extension from Chrome. For any questions, contact us at jon@eddy.delivery.`
          },
          {
            title: 'Changes to This Policy',
            text: `We may update this policy from time to time. Changes will be posted here with an updated date. Continued use of Eddy after changes constitutes acceptance of the updated policy.`
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
          Contact: jon@eddy.delivery · Eddy is a product of Greenbelt Ventures
        </div>
      </div>
    </main>
  );
}
