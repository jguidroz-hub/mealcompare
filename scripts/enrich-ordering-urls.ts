#!/usr/bin/env npx tsx
/**
 * Enrich restaurant data with direct ordering URLs.
 * 
 * Strategy:
 * 1. Search each restaurant on Google Places to get place_id
 * 2. Fetch details to get website URL  
 * 3. Check website for Toast/Square/ChowNow/Popmenu/Owner ordering links
 * 4. Update restaurant data with discovered ordering URLs
 * 
 * Usage: npx tsx scripts/enrich-ordering-urls.ts --metro nyc
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
  squareUrl?: string;
  websiteOrderUrl?: string;
  website?: string;
  placeId?: string;
}

const ORDERING_PATTERNS = [
  { pattern: /https?:\/\/[\w-]+\.toast\.site[^\s"'<>]*/i, key: 'toastUrl' },
  { pattern: /https?:\/\/order\.toasttab\.com\/online\/[\w-]+/i, key: 'toastUrl' },
  { pattern: /https?:\/\/[\w-]+\.square\.site[^\s"'<>]*/i, key: 'squareUrl' },
  { pattern: /https?:\/\/[\w-]+\.chownow\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/order\.popmenu\.com\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.menufy\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/order\.online\/store\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.olo\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.owner\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.getbento\.com\/(?!accounts|media)[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/ordering\.chownow\.com\/order\/[\w-]+/i, key: 'websiteOrderUrl' },
];

async function getWebsite(name: string, metro: string): Promise<{ website?: string; placeId?: string }> {
  try {
    const metroLabel: Record<string, string> = {
      nyc: 'New York', chicago: 'Chicago', la: 'Los Angeles', boston: 'Boston',
      miami: 'Miami', philly: 'Philadelphia', atlanta: 'Atlanta', denver: 'Denver',
      seattle: 'Seattle', sf: 'San Francisco', houston: 'Houston', nashville: 'Nashville',
      nola: 'New Orleans', dc: 'Washington DC', austin: 'Austin',
    };
    const query = `${name} restaurant ${metroLabel[metro] || metro}`;
    const searchOutput = execSync(`goplaces search "${query.replace(/"/g, '\\"')}" --json 2>/dev/null`, { encoding: 'utf-8', timeout: 10000 });
    const results = JSON.parse(searchOutput);
    if (!results[0]) return {};
    
    const placeId = results[0].place_id;
    const detailOutput = execSync(`goplaces details ${placeId} --json 2>/dev/null`, { encoding: 'utf-8', timeout: 10000 });
    const details = JSON.parse(detailOutput);
    
    return { website: details.website, placeId };
  } catch {
    return {};
  }
}

async function checkWebsiteForOrdering(url: string): Promise<Record<string, string>> {
  const found: Record<string, string> = {};
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return found;
    const html = await res.text();
    
    for (const { pattern, key } of ORDERING_PATTERNS) {
      const match = html.match(pattern);
      if (match && !found[key]) {
        found[key] = match[0].replace(/["'<>].*$/, '');
      }
    }
  } catch {}
  return found;
}

// CLI
const args = process.argv.slice(2);
const metro = args.find(a => a.startsWith('--metro='))?.split('=')[1]
  || (args.includes('--metro') ? args[args.indexOf('--metro') + 1] : null);
const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '50');

if (!metro) {
  console.log('Usage: npx tsx scripts/enrich-ordering-urls.ts --metro nyc [--limit 50]');
  process.exit(1);
}

(async () => {
  const file = `scripts/${metro}-places.json`;
  const restaurants: Restaurant[] = JSON.parse(readFileSync(file, 'utf-8'));
  
  // Only process ones without ordering URLs
  const needsEnrichment = restaurants.filter(r => !r.toastUrl && !r.squareUrl && !r.websiteOrderUrl);
  const toProcess = needsEnrichment.slice(0, limit);
  
  console.log(`🔗 Enriching ${toProcess.length}/${needsEnrichment.length} restaurants in ${metro} (${restaurants.length} total)`);
  
  let enriched = 0;
  for (let i = 0; i < toProcess.length; i++) {
    const r = toProcess[i];
    
    // Step 1: Get website from Google Places
    const { website, placeId } = await getWebsite(r.name, metro);
    if (placeId) r.placeId = placeId;
    if (website) r.website = website;
    
    // Step 2: Check website for ordering links
    if (website) {
      const orderUrls = await checkWebsiteForOrdering(website);
      if (orderUrls.toastUrl) { r.toastUrl = orderUrls.toastUrl; enriched++; }
      if (orderUrls.squareUrl) { r.squareUrl = orderUrls.squareUrl; enriched++; }
      if (orderUrls.websiteOrderUrl) { r.websiteOrderUrl = orderUrls.websiteOrderUrl; enriched++; }
    }
    
    process.stdout.write(`  ${i + 1}/${toProcess.length} checked, ${enriched} ordering URLs found\r`);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Save enriched data
  writeFileSync(file, JSON.stringify(restaurants, null, 2));
  console.log(`\n✅ Found ${enriched} direct ordering URLs for ${metro}`);
  console.log(`📁 Updated ${file}`);
})();
