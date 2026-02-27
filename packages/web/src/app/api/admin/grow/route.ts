import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const ORDERING_PATTERNS = [
  { pattern: /https?:\/\/[\w-]+\.toast\.site[^\s"'<>]*/i, key: 'toast_url' },
  { pattern: /https?:\/\/order\.toasttab\.com\/online\/[\w-]+/i, key: 'toast_url' },
  { pattern: /https?:\/\/[\w-]+\.square\.site[^\s"'<>]*/i, key: 'square_url' },
  { pattern: /https?:\/\/[\w-]+\.chownow\.com[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/ordering\.chownow\.com\/order\/[\w-]+/i, key: 'website_order_url' },
  { pattern: /https?:\/\/order\.popmenu\.com\/[\w-]+/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.menufy\.com[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/order\.online\/store\/[\w-]+/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.olo\.com[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.owner\.com[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.getbento\.com\/(?!accounts|media)[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.gloria\.food[^\s"'<>]*/i, key: 'website_order_url' },
  { pattern: /https?:\/\/[\w-]+\.spothopper\.com[^\s"'<>]*/i, key: 'website_order_url' },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40);
}

/**
 * POST /api/admin/grow
 * Batch insert restaurants and optionally check their websites for direct ordering URLs.
 * 
 * Body: {
 *   secret: string,
 *   restaurants: Array<{
 *     name: string, category: string, metro: string,
 *     website?: string, toastUrl?: string, squareUrl?: string, websiteOrderUrl?: string
 *   }>
 * }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = getPool();
  let inserted = 0;
  let enriched = 0;
  const errors: string[] = [];

  for (const r of body.restaurants) {
    const slug = slugify(r.name);
    let toastUrl = r.toastUrl || null;
    let squareUrl = r.squareUrl || null;
    let websiteOrderUrl = r.websiteOrderUrl || null;

    // If website provided and no ordering URLs, check for ordering links
    if (r.website && !toastUrl && !squareUrl && !websiteOrderUrl) {
      try {
        const resp = await fetch(r.website, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EddyBot/1.0)' },
          signal: AbortSignal.timeout(8000),
          redirect: 'follow',
        });
        const html = await resp.text();
        for (const { pattern, key } of ORDERING_PATTERNS) {
          const match = html.match(pattern);
          if (match) {
            if (key === 'toast_url') toastUrl = match[0];
            else if (key === 'square_url') squareUrl = match[0];
            else websiteOrderUrl = match[0];
            enriched++;
            break;
          }
        }
      } catch {}
    }

    try {
      await pool.query(
        `INSERT INTO restaurants (name, slug, category, metros, toast_url, square_url, website_order_url, is_chain)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false)
         ON CONFLICT (slug) DO UPDATE SET
           metros = array(SELECT DISTINCT unnest(restaurants.metros || EXCLUDED.metros)),
           toast_url = COALESCE(EXCLUDED.toast_url, restaurants.toast_url),
           square_url = COALESCE(EXCLUDED.square_url, restaurants.square_url),
           website_order_url = COALESCE(EXCLUDED.website_order_url, restaurants.website_order_url),
           category = CASE WHEN restaurants.category = 'restaurant' THEN EXCLUDED.category ELSE restaurants.category END`,
        [r.name, slug, r.category || 'restaurant', [r.metro], toastUrl, squareUrl, websiteOrderUrl]
      );
      inserted++;
    } catch (e: any) {
      errors.push(`${r.name}: ${e.message}`);
    }
  }

  const stats = await pool.query(
    'SELECT COUNT(*) as total, COUNT(CASE WHEN toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL THEN 1 END) as direct FROM restaurants'
  );

  return NextResponse.json({
    inserted,
    enriched,
    errors: errors.slice(0, 10),
    dbTotal: parseInt(stats.rows[0].total),
    dbDirect: parseInt(stats.rows[0].direct),
  });
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
