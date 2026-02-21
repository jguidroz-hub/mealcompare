#!/usr/bin/env node
/**
 * Generate a SQL file to seed the restaurants table from top-restaurants.ts
 * Run: node scripts/generate-seed-sql.js > /tmp/seed-restaurants.sql
 */

const fs = require('fs');
const path = require('path');

const TS_FILE = path.join(__dirname, '../packages/engine/src/data/top-restaurants.ts');

function parseRestaurants(content) {
  const restaurants = [];
  const objRegex = /\{\s*name:\s*(['"`])((?:(?!\1).|\\.)*)\1\s*,\s*slug:\s*(['"`])((?:(?!\3).|\\.)*)\3\s*,\s*category:\s*(['"`])((?:(?!\5).|\\.)*)\5\s*,\s*metros:\s*\[((?:[^\]]*?))\]([^}]*)\}/g;
  
  let match;
  while ((match = objRegex.exec(content)) !== null) {
    const name = match[2].replace(/\\'/g, "'");
    const slug = match[4];
    const category = match[6];
    const metrosStr = match[7];
    const restFields = match[8];
    
    const metros = [];
    const metroRegex = /['"`]([^'"`]+)['"`]/g;
    let m;
    while ((m = metroRegex.exec(metrosStr)) !== null) metros.push(m[1]);
    
    const toastUrl = extractField(restFields, 'toastUrl');
    const squareUrl = extractField(restFields, 'squareUrl');
    const websiteOrderUrl = extractField(restFields, 'websiteOrderUrl');
    const ubereatsSlug = extractField(restFields, 'ubereatsSlug');
    const doordashSlug = extractField(restFields, 'doordashSlug');
    const isChain = metros.length >= 5;
    
    restaurants.push({ name, slug, category, metros, toastUrl, squareUrl, websiteOrderUrl, ubereatsSlug, doordashSlug, isChain });
  }
  return restaurants;
}

function extractField(text, fieldName) {
  const regex = new RegExp(`${fieldName}:\\s*['"\`]([^'"\`]*)['"\`]`);
  const match = text.match(regex);
  return match ? match[1] : null;
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function escArray(arr) {
  return "'{" + arr.map(v => '"' + v.replace(/"/g, '\\"') + '"').join(',') + "}'";
}

const content = fs.readFileSync(TS_FILE, 'utf-8');
const restaurants = parseRestaurants(content);

console.error(`Parsed ${restaurants.length} restaurants`);

// Output SQL
console.log('TRUNCATE restaurants RESTART IDENTITY;');
console.log('');

// Batch 500 at a time
const BATCH = 500;
for (let i = 0; i < restaurants.length; i += BATCH) {
  const batch = restaurants.slice(i, i + BATCH);
  console.log('INSERT INTO restaurants (name, slug, category, metros, toast_url, square_url, website_order_url, ubereats_slug, doordash_slug, is_chain) VALUES');
  const rows = batch.map(r => {
    return `(${esc(r.name)}, ${esc(r.slug)}, ${esc(r.category)}, ${escArray(r.metros)}, ${esc(r.toastUrl)}, ${esc(r.squareUrl)}, ${esc(r.websiteOrderUrl)}, ${esc(r.ubereatsSlug)}, ${esc(r.doordashSlug)}, ${r.isChain})`;
  });
  console.log(rows.join(',\n') + ';');
  console.log('');
}

console.log("SELECT COUNT(*) as total FROM restaurants;");
console.log("SELECT COUNT(*) as with_direct FROM restaurants WHERE toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL;");
