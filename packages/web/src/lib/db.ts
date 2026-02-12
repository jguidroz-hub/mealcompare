import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return neon(url);
}

/**
 * Initialize the referral_clicks table if it doesn't exist.
 * Call this once on first deploy or manually.
 */
export async function ensureSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS referral_clicks (
      id SERIAL PRIMARY KEY,
      restaurant_name TEXT NOT NULL,
      restaurant_slug TEXT NOT NULL,
      metro TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'pwa',
      direct_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_referral_clicks_slug ON referral_clicks(restaurant_slug)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_referral_clicks_created ON referral_clicks(created_at)
  `;
}
