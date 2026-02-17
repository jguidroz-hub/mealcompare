import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return neon(url);
}

/**
 * Initialize all tables. Call once on first deploy.
 */
export async function ensureSchema() {
  const sql = getDb();

  // Referral clicks
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
  await sql`CREATE INDEX IF NOT EXISTS idx_referral_clicks_slug ON referral_clicks(restaurant_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_referral_clicks_created ON referral_clicks(created_at)`;

  // Restaurant claims (B2B funnel)
  await sql`
    CREATE TABLE IF NOT EXISTS restaurant_claims (
      id SERIAL PRIMARY KEY,
      restaurant_name TEXT NOT NULL,
      city TEXT,
      direct_url TEXT,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Analytics events
  await sql`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      event TEXT NOT NULL,
      props JSONB DEFAULT '{}',
      session_id TEXT,
      referrer TEXT,
      path TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      is_mobile BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_event ON analytics_events(event)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id)`;

  // Waitlist
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      metro TEXT,
      source TEXT DEFAULT 'web',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // User favorites (localStorage backup for future auth)
  await sql`
    CREATE TABLE IF NOT EXISTS user_favorites (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      restaurant_slug TEXT NOT NULL,
      metro TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(session_id, restaurant_slug, metro)
    )
  `;
}
