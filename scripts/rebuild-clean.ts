#!/usr/bin/env npx tsx
import { writeFileSync, readFileSync, readdirSync } from 'fs';

interface Restaurant {
  name: string; slug: string; category: string; metros: string[];
  toastUrl?: string; squareUrl?: string; websiteOrderUrl?: string;
}

function cleanUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes('media-cdn.getbento.com')) return undefined;
  if (url === 'https://order.online/business' || url === 'https://order.online/en') return undefined;
  if (url.length < 20) return undefined;
  return url.replace(/['"<>\s\\]+$/, '').replace(/'/g, "\\'");
}

const cityFiles = readdirSync('scripts').filter(f => f.endsWith('-places.json')).sort();
let totalOrdering = 0;
let totalRestaurants = 0;

const lines: string[] = [];
lines.push('/**');
lines.push(' * Auto-generated restaurant database for SkipTheFee');
lines.push(' * Generated: ' + new Date().toISOString());
lines.push(' * Source: Brave Search API harvesting across 12+ ordering platforms');
lines.push(' */');
lines.push('');
lines.push('export interface RestaurantData {');
lines.push('  name: string;');
lines.push('  slug: string;');
lines.push('  category: string;');
lines.push('  metros: string[];');
lines.push('  toastUrl?: string;');
lines.push('  squareUrl?: string;');
lines.push('  websiteOrderUrl?: string;');
lines.push('  ubereatsSlug?: string;');
lines.push('  doordashSlug?: string;');
lines.push('}');
lines.push('');

const metroVars: string[] = [];

for (const file of cityFiles) {
  const metro = file.replace('-places.json', '');
  const data: Restaurant[] = JSON.parse(readFileSync('scripts/' + file, 'utf-8'));
  totalRestaurants += data.length;

  const varName = metro.toUpperCase().replace(/-/g, '_') + '_RESTAURANTS';
  metroVars.push(varName);
  lines.push('export const ' + varName + ': RestaurantData[] = [');

  for (const r of data) {
    const name = r.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    let extras = '';

    const toast = cleanUrl(r.toastUrl);
    const square = cleanUrl(r.squareUrl);
    const web = cleanUrl(r.websiteOrderUrl);

    if (toast) { extras += ", toastUrl: '" + toast + "'"; totalOrdering++; }
    if (square) { extras += ", squareUrl: '" + square + "'"; totalOrdering++; }
    if (web) { extras += ", websiteOrderUrl: '" + web + "'"; totalOrdering++; }

    lines.push("  { name: '" + name + "', slug: '" + r.slug + "', category: '" + r.category + "', metros: ['" + metro + "']" + extras + " },");
  }

  lines.push('];');
  lines.push('');
}

lines.push('export const ALL_RESTAURANTS = [');
lines.push('  ' + metroVars.map(v => '...' + v).join(', ') + ',');
lines.push('];');
lines.push('');
lines.push('export function getRestaurantsForMetro(metro: string): RestaurantData[] {');
lines.push('  return ALL_RESTAURANTS.filter(r => r.metros.includes(metro));');
lines.push('}');
lines.push('');
lines.push('export function findRestaurantData(name: string, metro?: string): RestaurantData | null {');
lines.push("  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');");
lines.push('  const pool = metro ? getRestaurantsForMetro(metro) : ALL_RESTAURANTS;');
lines.push('  return pool.find(r => r.slug === normalized) || pool.find(r => normalized.includes(r.slug) || r.slug.includes(normalized)) || null;');
lines.push('}');
lines.push('');
lines.push('export function getDirectOrderUrl(restaurant: RestaurantData): string | null {');
lines.push('  return restaurant.toastUrl ?? restaurant.squareUrl ?? restaurant.websiteOrderUrl ?? null;');
lines.push('}');

writeFileSync('packages/engine/src/data/top-restaurants.ts', lines.join('\n') + '\n');
console.log('✅ Clean rebuild');
console.log('   Restaurants: ' + totalRestaurants);
console.log('   Direct URLs: ' + totalOrdering);
console.log('   Metros: ' + cityFiles.length);
