/**
 * Postgres-backed restaurant lookup.
 * Replaces the compiled-in top-restaurants.ts engine import.
 * Adding restaurants is now just an INSERT — no rebuild needed.
 */

import { getPool } from './db';

export interface RestaurantData {
  id: number;
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl: string | null;
  squareUrl: string | null;
  websiteOrderUrl: string | null;
  ubereatsSlug: string | null;
  doordashSlug: string | null;
  isChain: boolean;
}

function rowToRestaurant(row: any): RestaurantData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    metros: row.metros || [],
    toastUrl: row.toast_url,
    squareUrl: row.square_url,
    websiteOrderUrl: row.website_order_url,
    ubereatsSlug: row.ubereats_slug,
    doordashSlug: row.doordash_slug,
    isChain: row.is_chain,
  };
}

/** Get all restaurants for a metro */
export async function getRestaurantsForMetro(metro: string): Promise<RestaurantData[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT * FROM restaurants WHERE $1 = ANY(metros) ORDER BY name',
    [metro]
  );
  return rows.map(rowToRestaurant);
}

/** Find a restaurant by name (fuzzy slug match), optionally filtered by metro */
export async function findRestaurantData(name: string, metro?: string): Promise<RestaurantData | null> {
  const pool = getPool();
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Exact slug match
  const exact = metro
    ? await pool.query('SELECT * FROM restaurants WHERE slug = $1 AND $2 = ANY(metros) LIMIT 1', [normalized, metro])
    : await pool.query('SELECT * FROM restaurants WHERE slug = $1 LIMIT 1', [normalized]);

  if (exact.rows.length > 0) return rowToRestaurant(exact.rows[0]);

  // 2. Substring match (slug contains or is contained in search)
  const fuzzy = metro
    ? await pool.query(
        `SELECT * FROM restaurants 
         WHERE ($2 = ANY(metros)) AND (slug LIKE '%' || $1 || '%' OR $1 LIKE '%' || slug || '%')
         ORDER BY length(slug) DESC LIMIT 1`,
        [normalized, metro]
      )
    : await pool.query(
        `SELECT * FROM restaurants 
         WHERE (slug LIKE '%' || $1 || '%' OR $1 LIKE '%' || slug || '%')
         ORDER BY length(slug) DESC LIMIT 1`,
        [normalized]
      );

  if (fuzzy.rows.length > 0) return rowToRestaurant(fuzzy.rows[0]);

  return null;
}

/** Get the best direct ordering URL for a restaurant */
export function getDirectOrderUrl(restaurant: RestaurantData): string | null {
  return restaurant.toastUrl ?? restaurant.squareUrl ?? restaurant.websiteOrderUrl ?? null;
}

/** Get all restaurants (for stats, sitemap, etc.) */
export async function getAllRestaurants(): Promise<RestaurantData[]> {
  const pool = getPool();
  const { rows } = await pool.query('SELECT * FROM restaurants ORDER BY name');
  return rows.map(rowToRestaurant);
}

/** Get all unique metros */
export async function getAllMetros(): Promise<string[]> {
  const pool = getPool();
  const { rows } = await pool.query('SELECT DISTINCT unnest(metros) as metro FROM restaurants ORDER BY metro');
  return rows.map(r => r.metro);
}

/** Count restaurants, optionally by metro */
export async function countRestaurants(metro?: string): Promise<{ total: number; withDirect: number }> {
  const pool = getPool();
  if (metro) {
    const total = await pool.query('SELECT COUNT(*) as count FROM restaurants WHERE $1 = ANY(metros)', [metro]);
    const direct = await pool.query(
      "SELECT COUNT(*) as count FROM restaurants WHERE $1 = ANY(metros) AND (toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL)",
      [metro]
    );
    return { total: parseInt(total.rows[0].count), withDirect: parseInt(direct.rows[0].count) };
  }
  const total = await pool.query('SELECT COUNT(*) as count FROM restaurants');
  const direct = await pool.query(
    "SELECT COUNT(*) as count FROM restaurants WHERE toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL"
  );
  return { total: parseInt(total.rows[0].count), withDirect: parseInt(direct.rows[0].count) };
}
