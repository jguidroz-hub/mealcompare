#!/usr/bin/env node
/**
 * Seed the `restaurants` Postgres table from top-restaurants.ts
 * Run: node scripts/seed-restaurants-db.js
 * 
 * Parses the TS file as text (no compilation needed), extracts all restaurant objects,
 * and bulk-inserts them into the restaurants table.
 */

const fs = require('fs');
const { Pool } = require('pg');

const TS_FILE = require('path').join(__dirname, '../packages/engine/src/data/top-restaurants.ts');

function parseRestaurants(content) {
  const restaurants = [];
  
  // Match each object literal in the arrays
  // Pattern: { name: '...', slug: '...', category: '...', metros: ['...'], ...optional fields }
  const objRegex = /\{\s*name:\s*(['"`])((?:(?!\1).|\\.)*)\1\s*,\s*slug:\s*(['"`])((?:(?!\3).|\\.)*)\3\s*,\s*category:\s*(['"`])((?:(?!\5).|\\.)*)\5\s*,\s*metros:\s*\[((?:[^\]]*?))\]([^}]*)\}/g;
  
  let match;
  while ((match = objRegex.exec(content)) !== null) {
    const name = match[2].replace(/\\'/g, "'");
    const slug = match[4];
    const category = match[6];
    const metrosStr = match[7];
    const restFields = match[8];
    
    // Parse metros array
    const metros = [];
    const metroRegex = /['"`]([^'"`]+)['"`]/g;
    let m;
    while ((m = metroRegex.exec(metrosStr)) !== null) {
      metros.push(m[1]);
    }
    
    // Parse optional fields
    const toastUrl = extractField(restFields, 'toastUrl');
    const squareUrl = extractField(restFields, 'squareUrl');
    const websiteOrderUrl = extractField(restFields, 'websiteOrderUrl');
    const ubereatsSlug = extractField(restFields, 'ubereatsSlug');
    const doordashSlug = extractField(restFields, 'doordashSlug');
    
    // Detect chains (appear in 5+ metros)
    const isChain = metros.length >= 5;
    
    restaurants.push({
      name, slug, category, metros,
      toastUrl, squareUrl, websiteOrderUrl,
      ubereatsSlug, doordashSlug, isChain
    });
  }
  
  return restaurants;
}

function extractField(text, fieldName) {
  const regex = new RegExp(`${fieldName}:\\s*['"\`]([^'"\`]*)['"\`]`);
  const match = text.match(regex);
  return match ? match[1] : null;
}

async function main() {
  const content = fs.readFileSync(TS_FILE, 'utf-8');
  const restaurants = parseRestaurants(content);
  
  console.log(`Parsed ${restaurants.length} restaurants from TS file`);
  
  if (restaurants.length === 0) {
    console.error('No restaurants parsed! Check regex.');
    process.exit(1);
  }
  
  // Show sample
  console.log('Sample:', JSON.stringify(restaurants[0], null, 2));
  console.log('Sample chain:', JSON.stringify(restaurants.find(r => r.isChain), null, 2));
  
  const pool = new Pool({
    host: process.env.HETZNER_PG_HOST || 'localhost',
    user: process.env.HETZNER_PG_USER || 'greenbelt',
    password: process.env.HETZNER_PG_PASSWORD,
    database: 'skipthefee',
    port: 5432,
    ssl: false,
  });
  
  try {
    // Clear existing data
    await pool.query('TRUNCATE restaurants RESTART IDENTITY');
    console.log('Cleared existing restaurants');
    
    // Batch insert (100 at a time)
    const BATCH = 100;
    let inserted = 0;
    
    for (let i = 0; i < restaurants.length; i += BATCH) {
      const batch = restaurants.slice(i, i + BATCH);
      const values = [];
      const params = [];
      let paramIdx = 1;
      
      for (const r of batch) {
        values.push(`($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}::text[], $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`);
        params.push(
          r.name, r.slug, r.category, r.metros,
          r.toastUrl, r.squareUrl, r.websiteOrderUrl,
          r.ubereatsSlug, r.doordashSlug, r.isChain
        );
      }
      
      await pool.query(`
        INSERT INTO restaurants (name, slug, category, metros, toast_url, square_url, website_order_url, ubereats_slug, doordash_slug, is_chain)
        VALUES ${values.join(', ')}
      `, params);
      
      inserted += batch.length;
      if (inserted % 500 === 0 || inserted === restaurants.length) {
        console.log(`Inserted ${inserted}/${restaurants.length}`);
      }
    }
    
    // Verify
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`\nVerification: ${rows[0].count} restaurants in DB`);
    
    const { rows: withDirect } = await pool.query(
      "SELECT COUNT(*) as count FROM restaurants WHERE toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL"
    );
    console.log(`With direct ordering URL: ${withDirect[0].count}`);
    
    const { rows: chains } = await pool.query("SELECT COUNT(*) as count FROM restaurants WHERE is_chain = true");
    console.log(`Chains: ${chains[0].count}`);
    
    const { rows: metroCount } = await pool.query(
      "SELECT unnest(metros) as metro, COUNT(*) as cnt FROM restaurants GROUP BY metro ORDER BY cnt DESC LIMIT 5"
    );
    console.log('Top metros:', metroCount.map(r => `${r.metro}: ${r.cnt}`).join(', '));
    
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
