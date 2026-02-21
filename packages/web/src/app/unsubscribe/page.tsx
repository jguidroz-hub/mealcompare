'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending');

  useEffect(() => {
    if (!email) {
      setStatus('done');
      return;
    }
    // Auto-submit on page load — one-click unsubscribe (CAN-SPAM compliant)
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(r => r.ok ? setStatus('done') : setStatus('error'))
      .catch(() => setStatus('error'));
  }, [email]);

  return (
    <main style={{
      background: '#0f172a', color: '#e2e8f0', minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        {status === 'pending' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Unsubscribing...</h1>
            <p style={{ color: '#94a3b8' }}>Just a moment.</p>
          </>
        )}

        {status === 'done' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>You&apos;re unsubscribed</h1>
            <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
              {email ? (
                <><strong style={{ color: '#e2e8f0' }}>{email}</strong> has been removed from our list.</>
              ) : (
                <>You&apos;ve been removed from our list.</>
              )}
              {' '}You won&apos;t hear from us again.
            </p>
            <Link href="/" style={{
              display: 'inline-block', padding: '10px 24px',
              background: '#1e293b', color: '#94a3b8',
              borderRadius: 8, textDecoration: 'none', fontSize: 14,
            }}>
              ← Back to SkipTheFee
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: 24 }}>
              Please email <a href="mailto:jon@skipthefee.app" style={{ color: '#10b981' }}>jon@skipthefee.app</a> and we&apos;ll remove you manually within 24 hours.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
