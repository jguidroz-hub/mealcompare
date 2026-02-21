import { Pool } from 'pg';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Unsubscribe — SkipTheFee' };
export const dynamic = 'force-dynamic';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { email } = await searchParams;
  let success = false;
  let error = false;

  if (email) {
    try {
      await pool.query(
        `INSERT INTO email_unsubscribes (email, source)
         VALUES ($1, 'email_campaign')
         ON CONFLICT (email) DO NOTHING`,
        [email.toLowerCase().trim()]
      );
      success = true;
    } catch (err) {
      console.error('Unsubscribe error:', err);
      error = true;
    }
  } else {
    success = true; // No email = nothing to do, just show confirmation
  }

  return (
    <main style={{
      background: '#0f172a', color: '#e2e8f0', minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        {success && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>You&apos;re unsubscribed</h1>
            <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
              {email
                ? <><strong style={{ color: '#e2e8f0' }}>{email}</strong> has been removed from our list. You won&apos;t hear from us again.</>
                : <>You&apos;ve been removed from our list. You won&apos;t hear from us again.</>
              }
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
        {error && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8' }}>
              Email <a href="mailto:jon@skipthefee.app" style={{ color: '#10b981' }}>jon@skipthefee.app</a> and we&apos;ll remove you within 24 hours.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
