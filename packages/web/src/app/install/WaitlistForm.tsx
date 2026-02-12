'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: '#10b981', fontWeight: 700 }}>
          ✅ You&apos;re on the list! We&apos;ll email you when MealCompare hits the Chrome Web Store.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '48px', textAlign: 'center' }}>
      <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '16px' }}>
        Prefer a one-click install? We&apos;re submitting to the Chrome Web Store.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
            padding: '12px 16px', color: '#e2e8f0', fontSize: '15px', width: '280px',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: '#3b82f6', color: 'white', padding: '12px 24px',
            borderRadius: '8px', border: 'none', fontWeight: 700,
            fontSize: '15px', cursor: 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? 'Joining...' : 'Notify Me'}
        </button>
      </form>
      {status === 'error' && (
        <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '8px' }}>Something went wrong. Try again.</p>
      )}
    </div>
  );
}
