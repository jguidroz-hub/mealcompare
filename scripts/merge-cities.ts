#!/usr/bin/env npx tsx
/**
 * Merge all city discovery results into top-restaurants.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  address?: string;
  toastUrl?: string;
  squareUrl?: string;
}

// Read existing data to get DC + Austin restaurant count
const existingFile = readFileSync('packages/engine/src/data/top-restaurants.ts', 'utf-8');
const existingCount = (existingFile.match(/name:/g) || []).length;
console.log(`Existing restaurants: ${existingCount}`);

// Read all city JSON files
const cityFiles = readdirSync('scripts').filter(f => f.endsWith('-places.json'));
const allNew: Restaurant[] = [];

for (const file of cityFiles) {
  const data: Restaurant[] = JSON.parse(readFileSync(`scripts/${file}`, 'utf-8'));
  allNew.push(...data);
  console.log(`  ${file}: ${data.length}`);
}

console.log(`\nNew restaurants: ${allNew.length}`);

// Group by metro
const byMetro: Record<string, Restaurant[]> = {};
for (const r of allNew) {
  const metro = r.metros[0];
  if (!byMetro[metro]) byMetro[metro] = [];
  byMetro[metro].push(r);
}

// Generate TypeScript additions
let additions = '\n// ─── New City Restaurants (Google Places discovery, Feb 12) ────\n\n';

for (const [metro, restaurants] of Object.entries(byMetro).sort()) {
  const varName = metro.toUpperCase() + '_RESTAURANTS';
  additions += `export const ${varName}: RestaurantData[] = [\n`;
  for (const r of restaurants) {
    const name = r.name.replace(/'/g, "\\'");
    const urlPart = r.toastUrl ? `, toastUrl: '${r.toastUrl}'` : r.squareUrl ? `, squareUrl: '${r.squareUrl}'` : '';
    additions += `  { name: '${name}', slug: '${r.slug}', category: '${r.category}', metros: ['${metro}']${urlPart} },\n`;
  }
  additions += `];\n\n`;
}

// Update ALL_RESTAURANTS to include new cities
const metroVars = Object.keys(byMetro).sort().map(m => m.toUpperCase() + '_RESTAURANTS');

writeFileSync('scripts/new-cities-data.ts', additions);
console.log(`\nGenerated scripts/new-cities-data.ts with ${Object.keys(byMetro).length} city arrays`);
console.log('Metro vars to add to ALL_RESTAURANTS:', metroVars.join(', '));
console.log(`\nTotal: ${existingCount + allNew.length} restaurants across ${2 + Object.keys(byMetro).length} cities`);
