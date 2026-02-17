'use client';
import { useState } from 'react';
import Link from 'next/link';

type FeedbackType = 'bug' | 'feature' | 'missing' | 'general';

const TYPES: { id: FeedbackType; label: string; emoji: string; desc: string; placeholder: string }[] = [
  { id: 'bug', label: 'Report a Bug', emoji: '🐛', desc: 'Something broken or not working as expected', placeholder: 'Describe what happened, what you expected, and any steps to reproduce...' },
  { id: 'feature', label: 'Request a Feature', emoji: '💡', desc: 'Something you wish SkipTheFee could do', placeholder: 'What feature would help you? How would you use it?' },
  { id: 'missing', label: 'Missing Restaurant', emoji: '🍽️', desc: 'A restaurant we should add or one with wrong info', placeholder: 'Restaurant name, city, and their direct ordering website if you know it...' },
  { id: 'general', label: 'General Feedback', emoji: '💬', desc: 'Anything else — compliments, suggestions, questions', placeholder: 'Tell us what you think...' },
];

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !type) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || undefined,
          page: '/feedback',
          meta: { source: 'feedback_page', timestamp: new Date().toISOString() },
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            ← Home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 16px' }}>
        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Thanks for your feedback!</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              We read every single submission and use it to make SkipTheFee better.
              {email && ' We\'ll follow up at your email if needed.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/restaurants" className="btn-glow" style={{ padding: '12px 24px', fontSize: 14 }}>
                Browse Restaurants
              </Link>
              <button
                onClick={() => { setStatus('idle'); setType(null); setMessage(''); setEmail(''); }}
                className="btn-outline"
                style={{ padding: '12px 24px', fontSize: 14 }}
              >
                Send More Feedback
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>
              We&apos;d love your feedback
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
              SkipTheFee is built for you. Tell us what&apos;s working, what&apos;s not, and what you want next. Every submission is read by a real person.
            </p>

            {/* Type cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className="glass-card"
                  style={{
                    padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
                    border: type === t.id ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    background: type === t.id ? 'rgba(16,185,129,0.06)' : undefined,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{t.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: type === t.id ? '#10b981' : '#e2e8f0', marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            {type && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    {TYPES.find(t => t.id === type)?.label} Details
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={TYPES.find(t => t.id === type)?.placeholder}
                    required
                    rows={5}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e2e8f0', fontSize: 15, resize: 'vertical', outline: 'none',
                      fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    Email <span style={{ fontWeight: 400, color: '#475569' }}>(optional — so we can follow up)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!message.trim() || status === 'sending'}
                  style={{
                    width: '100%', padding: '16px 24px', borderRadius: 14,
                    background: message.trim() ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.05)',
                    border: 'none', color: message.trim() ? 'white' : '#475569',
                    fontSize: 16, fontWeight: 800, cursor: message.trim() ? 'pointer' : 'default',
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Submit Feedback'}
                </button>
                {status === 'error' && (
                  <p style={{ fontSize: 13, color: '#ef4444', marginTop: 10, textAlign: 'center' }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
