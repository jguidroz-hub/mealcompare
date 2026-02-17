'use client';
import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage_cta' }),
      });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p style={{ fontSize: 13, color: '#10b981', marginTop: 24, fontWeight: 600 }}>
        ✅ You&apos;re on the list! We&apos;ll let you know when we launch the mobile app.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 28, maxWidth: 400, margin: '28px auto 0' }}>
      <p style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>
        📱 Want the mobile app? Get notified when it launches:
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
            color: '#e2e8f0', fontSize: 14, outline: 'none',
          }}
        />
        <button type="submit" disabled={status === 'loading'} style={{
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 10, padding: '10px 18px', color: '#10b981', fontSize: 13,
          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          {status === 'loading' ? '...' : 'Notify Me'}
        </button>
      </div>
      {status === 'error' && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Something went wrong. Try again?</p>}
    </form>
  );
}
