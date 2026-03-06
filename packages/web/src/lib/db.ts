import { Pool } from 'pg';

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL not set');
    _pool = new Pool({ connectionString: url });
  }
  return _pool;
}

/**
 * Returns a tagged template literal SQL function backed by Hetzner Postgres (pg Pool).
 * Drop-in replacement for neon() from @neondatabase/serverless.
 */
export function getDb() {
  const pool = getPool();
  return async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
    let text = '';
    const params: unknown[] = [];
    strings.forEach((str, i) => {
      text += str;
      if (i < values.length) {
        params.push(values[i]);
        text += `$${params.length}`;
      }
    });
    const result = await pool.query(text, params);
    return result.rows;
  };
}

/**
 * Initialize all tables. Call once on first deploy via POST /api/init
 */
export async function ensureSchema() {
  const pool = getPool();

  // Referral clicks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS referral_clicks (
      id SERIAL PRIMARY KEY,
      restaurant_name TEXT NOT NULL,
      restaurant_slug TEXT NOT NULL,
      metro TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'pwa',
      direct_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_referral_clicks_slug ON referral_clicks(restaurant_slug)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_referral_clicks_created ON referral_clicks(created_at)`);

  // Restaurant claims (B2B funnel)
  await pool.query(`
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
  `);

  // Analytics events
  await pool.query(`
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
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_event ON analytics_events(event)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id)`);

  // Waitlist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      metro TEXT,
      source TEXT DEFAULT 'web',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Feedback
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'general',
      message TEXT NOT NULL,
      email TEXT,
      page TEXT,
      meta JSONB DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at)`);

  // User favorites (localStorage backup for future auth)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      restaurant_slug TEXT NOT NULL,
      metro TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(session_id, restaurant_slug, metro)
    )
  `);

  // Restaurants (live database — replaces compiled top-restaurants.ts)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'restaurant',
      metros TEXT[] NOT NULL DEFAULT '{}',
      toast_url TEXT,
      square_url TEXT,
      website_order_url TEXT,
      ubereats_slug TEXT,
      doordash_slug TEXT,
      is_chain BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_restaurants_metros ON restaurants USING GIN(metros)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_restaurants_name_lower ON restaurants(lower(name))`);

  // Telemetry events (unified tracking for monetization data)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS telemetry_events (
      id SERIAL PRIMARY KEY,
      event TEXT NOT NULL,
      session_id TEXT,
      ref TEXT,
      metro TEXT,
      campus TEXT,
      props JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_event ON telemetry_events(event)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_session ON telemetry_events(session_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_created ON telemetry_events(created_at)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_ref ON telemetry_events(ref)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_campus ON telemetry_events(campus)`);
}
