#!/usr/bin/env npx tsx
/**
 * Rebuild top-restaurants.ts from enriched JSON files.
 * Preserves DC + Austin from existing file, replaces all new city data.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';

interface Restaurant {
  name: string; slug: string; category: string; metros: string[];
  toastUrl?: string; squareUrl?: string; websiteOrderUrl?: string;
  website?: string; placeId?: string; address?: string;
}

// Read base file (DC + Austin + interface + helpers)
const base = readFileSync('packages/engine/src/data/top-restaurants.ts', 'utf-8');
// Find where new city data starts
const marker = '// ─── New City Restaurants';
const baseEnd = base.indexOf(marker);
if (baseEnd === -1) { console.error('Marker not found'); process.exit(1); }

let basePart = base.substring(0, baseEnd);

// Remove old ALL_RESTAURANTS and helpers (they're at the end)
const allIdx = basePart.indexOf('// ─── Combined Index');
if (allIdx > -1) basePart = basePart.substring(0, allIdx);

// Read all city JSON files
const cityFiles = readdirSync('scripts').filter(f => f.endsWith('-places.json')).sort();
let newPart = '// ─── New City Restaurants (Google Places + ordering URL enrichment, Feb 12) ────\n\n';
let totalOrdering = 0;
let totalRestaurants = 0;

// Filter out false positive ordering URLs
function cleanUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes('media-cdn.getbento.com')) return undefined;
  if (url === 'https://order.online/business' || url === 'https://order.online/en') return undefined;
  if (url.length < 20) return undefined;
  // Strip trailing quotes/whitespace/backslashes
  return url.replace(/['"<>\s\\]+$/, '').replace(/'/g, '');
}

for (const file of cityFiles) {
  const metro = file.replace('-places.json', '');
  const data: Restaurant[] = JSON.parse(readFileSync(`scripts/${file}`, 'utf-8'));
  totalRestaurants += data.length;
  
  const varName = metro.toUpperCase() + '_RESTAURANTS';
  newPart += `export const ${varName}: RestaurantData[] = [\n`;
  
  for (const r of data) {
    const name = r.name.replace(/'/g, "\\'");
    let extras = '';
    
    const toast = cleanUrl(r.toastUrl);
    const square = cleanUrl(r.squareUrl);
    const web = cleanUrl(r.websiteOrderUrl);
    
    if (toast) { extras += `, toastUrl: '${toast}'`; totalOrdering++; }
    if (square) { extras += `, squareUrl: '${square}'`; totalOrdering++; }
    if (web) { extras += `, websiteOrderUrl: '${web}'`; totalOrdering++; }
    
    newPart += `  { name: '${name}', slug: '${r.slug}', category: '${r.category}', metros: ['${metro}']${extras} },\n`;
  }
  
  newPart += `];\n\n`;
}

// Add ALL_RESTAURANTS and helpers at the very end
const metroVars = cityFiles.map(f => f.replace('-places.json', '').toUpperCase() + '_RESTAURANTS');
newPart += `// ─── Combined Index ────────────────────────────────────────────\n\n`;
newPart += `export const ALL_RESTAURANTS = [\n  ...DC_RESTAURANTS, ...AUSTIN_RESTAURANTS,\n`;
newPart += `  ${metroVars.map(v => `...${v}`).join(', ')},\n];\n\n`;
newPart += `export function getRestaurantsForMetro(metro: string): RestaurantData[] {\n  return ALL_RESTAURANTS.filter(r => r.metros.includes(metro));\n}\n\n`;
newPart += `export function findRestaurantData(name: string, metro?: string): RestaurantData | null {\n  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');\n  const pool = metro ? getRestaurantsForMetro(metro) : ALL_RESTAURANTS;\n  const exact = pool.find(r => r.slug === normalized);\n  if (exact) return exact;\n  const contains = pool.find(r => normalized.includes(r.slug) || r.slug.includes(normalized));\n  if (contains) return contains;\n  return null;\n}\n\n`;
newPart += `export function getDirectOrderUrl(restaurant: RestaurantData): string | null {\n  return restaurant.toastUrl ?? restaurant.squareUrl ?? restaurant.websiteOrderUrl ?? null;\n}\n`;

writeFileSync('packages/engine/src/data/top-restaurants.ts', basePart + newPart);
console.log(`✅ Rebuilt data file`);
console.log(`   New city restaurants: ${totalRestaurants}`);
console.log(`   Direct ordering URLs: ${totalOrdering}`);
