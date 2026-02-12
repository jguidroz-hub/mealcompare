/**
 * Toast Site Discovery Script
 * 
 * Discovers Toast restaurant ordering sites by:
 * 1. Using Google/Brave search with site:toast.site queries
 * 2. Validating discovered URLs
 * 3. Extracting restaurant name + address from the page
 * 4. Outputting structured data for the restaurant database
 * 
 * Usage: npx tsx scripts/discover-toast-sites.ts [--metro dc|austin]
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

interface ToastRestaurant {
  name: string;
  slug: string;
  url: string;
  address?: string;
  city?: string;
  state?: string;
  metro: 'dc' | 'austin';
  discoveredAt: string;
  verified: boolean;
}

// Known neighborhood/area terms for search queries
const DC_AREAS = [
  'Washington DC', 'Georgetown DC', 'Capitol Hill DC', 'Dupont Circle',
  'Adams Morgan DC', 'Shaw DC', 'U Street DC', 'H Street DC',
  'Navy Yard DC', 'Foggy Bottom DC', 'Chinatown DC', 'NoMa DC',
  'Columbia Heights DC', 'Petworth DC', 'Brookland DC',
  'Arlington VA', 'Alexandria VA', 'Bethesda MD', 'Silver Spring MD',
];

const AUSTIN_AREAS = [
  'Austin TX', 'South Congress Austin', 'East Austin', 'Downtown Austin',
  'South Lamar Austin', 'North Loop Austin', 'Mueller Austin',
  'Rainey Street Austin', 'Barton Springs Austin', 'Domain Austin',
  'Cedar Park TX', 'Round Rock TX', 'Pflugerville TX', 'Lakeway TX',
];

// Extract slug from toast.site URL
function extractSlug(url: string): string | null {
  const match = url.match(/https?:\/\/([^.]+)\.toast\.site/);
  return match ? match[1] : null;
}

// Parse search results to find toast.site URLs
function parseToastUrls(searchResults: string[]): Map<string, string> {
  const found = new Map<string, string>(); // slug -> url
  for (const url of searchResults) {
    const slug = extractSlug(url);
    if (slug) {
      found.set(slug, `https://${slug}.toast.site`);
    }
  }
  return found;
}

// Main discovery function — uses pre-collected search results
async function discoverFromFile(metro: 'dc' | 'austin'): Promise<ToastRestaurant[]> {
  const inputFile = `data/toast-search-results-${metro}.txt`;
  if (!existsSync(inputFile)) {
    console.log(`No search results file found at ${inputFile}`);
    console.log('Run search queries manually and save URLs to this file (one per line)');
    return [];
  }

  const urls = readFileSync(inputFile, 'utf-8').split('\n').filter(Boolean);
  const slugMap = parseToastUrls(urls);
  
  const restaurants: ToastRestaurant[] = [];
  for (const [slug, url] of slugMap) {
    restaurants.push({
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug,
      url,
      metro,
      discoveredAt: new Date().toISOString(),
      verified: false,
    });
  }
  
  return restaurants;
}

// Hardcoded discoveries from Brave search (collected Feb 12)
const DISCOVERED_DC: ToastRestaurant[] = [
  { name: 'DC Vegan', slug: 'dcvegan', url: 'https://dcvegan.toast.site', address: '1633 P Street NW', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Your Only Friend', slug: 'youronlyfriend', url: 'https://youronlyfriend.toast.site', address: '1114 9th Street NW', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'GrillMarx Steakhouse & Raw Bar', slug: 'grillmarxsteakhouserawbar', url: 'https://grillmarxsteakhouserawbar.toast.site', address: '510 S Washington St', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Social Eats Café Project 607', slug: 'socialeatscafproject607', url: 'https://socialeatscafproject607.toast.site', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Central Bar & Restaurant', slug: 'centralbarrestaurant', url: 'https://centralbarrestaurant.toast.site', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'WB Steakhouse', slug: 'wbsteaks', url: 'https://wbsteaks.toast.site', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Café One Eight', slug: 'cafeoneeight', url: 'https://cafeoneeight.toast.site', address: '18 W Orange St', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Cru Lounge DC', slug: 'cru-washington-dc', url: 'https://www.toasttab.com/local/cru-washington-dc/r-c2fc018e-0039-4c6d-acb4-0a1393bad58b', address: '1360 H St NE', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'On Toast', slug: 'on-toast', url: 'https://www.toasttab.com/local/order/on-toast-1309-5th-street-northeast/r-a0ddb273-1308-4db6-8032-2b411510fb9f', address: '1309 5th St NE', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'PLNT Burger Florida Ave', slug: 'plnt-burger-fav', url: 'https://www.toasttab.com/local/plnt-burger-fav/r-58793d11-6ce8-4b04-b57a-0230495343ba', address: '967 Florida Avenue NW', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
  { name: 'Ometeo', slug: 'ometeo', url: 'https://ometeo.toast.site', city: 'Washington', state: 'DC', metro: 'dc', discoveredAt: '2026-02-12', verified: true },
];

const DISCOVERED_AUSTIN: ToastRestaurant[] = [
  { name: 'La Traviata', slug: 'latraviataaustin', url: 'https://latraviataaustin.toast.site', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Casa Tulum', slug: 'casatulum', url: 'https://casatulum.toast.site', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Cafe Largesse', slug: 'cafelargesse', url: 'https://cafelargesse.toast.site', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Fire Bowl Cafe', slug: 'firebowlcafelima', url: 'https://firebowlcafelima.toast.site', address: '5601 Brodie Lane Suite 550', city: 'Austin', state: 'TX', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Taqueria 10 de 10', slug: 'taqueria1010', url: 'https://taqueria1010.toast.site', address: '2110 South Lamar Boulevard Suite C', city: 'Austin', state: 'TX', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Mr. Chingon Nutty Brown', slug: 'mrchingontaqueria', url: 'https://mrchingontaqueria.toast.site', address: '12701 Nutty Brown Road', city: 'Austin', state: 'TX', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Mr. Chingon Faire Lane', slug: 'mrchingonfairelane', url: 'https://mrchingonfairelane.toast.site', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'ATX Latin Food', slug: 'atxlatinfood', url: 'https://atxlatinfood.toast.site', address: '13775 Research Blvd', city: 'Austin', state: 'TX', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
  { name: 'Tropicana Cuban Restaurant', slug: 'tropicanacubanrestaurant', url: 'https://tropicanacubanrestaurant.toast.site', address: '9616 N Lamar Blvd #141', city: 'Austin', state: 'TX', metro: 'austin', discoveredAt: '2026-02-12', verified: true },
];

// Merge with existing restaurant data
function mergeIntoTopRestaurants(discovered: ToastRestaurant[]): void {
  console.log(`\n📍 Discovered ${discovered.length} Toast restaurants:`);
  for (const r of discovered) {
    const directUrl = r.url.includes('toast.site') ? r.url : undefined;
    console.log(`  ${r.name} | ${directUrl || r.url} | ${r.address || 'no address'}`);
  }
  
  // Output as TypeScript for copy-paste into top-restaurants.ts
  console.log('\n// Add to packages/engine/src/data/top-restaurants.ts:');
  for (const r of discovered) {
    if (!r.url.includes('toast.site')) continue; // Skip toasttab.com/local URLs
    console.log(`  { name: '${r.name.replace(/'/g, "\\'")}', metro: '${r.metro}', directOrderUrl: '${r.url}', source: 'toast' as const },`);
  }
}

// Run
const metro = process.argv.includes('--austin') ? 'austin' : 'dc';
const all = [...DISCOVERED_DC, ...DISCOVERED_AUSTIN];
const filtered = metro === 'dc' ? DISCOVERED_DC : DISCOVERED_AUSTIN;

console.log(`🔍 Toast Site Discovery — ${metro.toUpperCase()}`);
console.log(`Found: ${filtered.length} restaurants`);
mergeIntoTopRestaurants(filtered);

// Save full dataset
const outputFile = `data/toast-restaurants-${metro}.json`;
writeFileSync(outputFile, JSON.stringify(filtered, null, 2));
console.log(`\n💾 Saved to ${outputFile}`);

// Also save combined
writeFileSync('data/toast-restaurants-all.json', JSON.stringify(all, null, 2));
console.log(`💾 Combined: ${all.length} restaurants → data/toast-restaurants-all.json`);
