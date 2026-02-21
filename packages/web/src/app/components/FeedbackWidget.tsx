'use client';
import { useState, useRef, useEffect } from 'react';

type FeedbackType = 'bug' | 'feature' | 'missing' | 'general';

const TYPES: { id: FeedbackType; label: string; emoji: string; placeholder: string }[] = [
  { id: 'bug', label: 'Something broken', emoji: '🐛', placeholder: 'What went wrong? What did you expect to happen?' },
  { id: 'feature', label: 'Feature request', emoji: '💡', placeholder: 'What would make Eddy better for you?' },
  { id: 'missing', label: 'Missing restaurant', emoji: '🍽️', placeholder: 'Which restaurant is missing? Include city if possible.' },
  { id: 'general', label: 'Other feedback', emoji: '💬', placeholder: 'Anything else you want to tell us...' },
];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSubmit = async () => {
    if (!message.trim() || !type) return;
    setStatus('sending');
    try {
      const page = typeof window !== 'undefined' ? window.location.pathname : '';
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || undefined,
          page,
          meta: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setType(null);
    setMessage('');
    setEmail('');
    setStatus('idle');
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Give feedback"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #059669, #10b981)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(16,185,129,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)'; }}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Modal overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          padding: 24,
        }}>
          <div
            ref={modalRef}
            style={{
              width: '100%', maxWidth: 420, maxHeight: '80vh',
              background: '#0f1729', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                  {status === 'done' ? '🎉 Thanks!' : 'Send us feedback'}
                </h3>
                <button onClick={reset} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>
              {status !== 'done' && (
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 0 }}>
                  We read every submission. Help us make Eddy better.
                </p>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '16px 24px 24px', overflowY: 'auto', flex: 1 }}>
              {status === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>
                    Your feedback has been saved. We&apos;ll use it to make Eddy better.
                  </p>
                  {email && (
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
                      We&apos;ll follow up at {email} if needed.
                    </p>
                  )}
                  <button
                    onClick={reset}
                    style={{
                      marginTop: 20, padding: '10px 24px',
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: 10, color: '#10b981', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Type selector */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 8 }}>What&apos;s this about?</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {TYPES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setType(t.id)}
                          style={{
                            padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                            border: type === t.id ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                            background: type === t.id ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                            color: type === t.id ? '#10b981' : '#94a3b8',
                            textAlign: 'left', fontSize: 13, fontWeight: 600,
                            transition: 'all 0.15s',
                          }}
                        >
                          <span style={{ marginRight: 6 }}>{t.emoji}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  {type && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 6 }}>Details</label>
                        <textarea
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder={TYPES.find(t => t.id === type)?.placeholder}
                          rows={4}
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#e2e8f0', fontSize: 14, resize: 'vertical', outline: 'none',
                            fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
                          }}
                          onFocus={e => (e.target.style.borderColor = 'rgba(16,185,129,0.3)')}
                          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                          autoFocus
                        />
                      </div>

                      {/* Email (optional) */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Email <span style={{ fontWeight: 400, color: '#334155' }}>(optional — for follow-up)</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={!message.trim() || status === 'sending'}
                        style={{
                          width: '100%', padding: '14px 24px', borderRadius: 12,
                          background: message.trim() ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.05)',
                          border: 'none', color: message.trim() ? 'white' : '#475569',
                          fontSize: 15, fontWeight: 700, cursor: message.trim() ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                        }}
                      >
                        {status === 'sending' ? 'Sending...' : status === 'error' ? 'Failed — Try Again' : 'Send Feedback'}
                      </button>
                      {status === 'error' && (
                        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8, textAlign: 'center' }}>
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
