#!/usr/bin/env npx tsx
/**
 * Multi-City Restaurant Crawler — Toast + Square Online
 * 
 * Discovers restaurants with direct ordering across 20 US metros.
 * Uses web search to find {slug}.toast.site and {slug}.square.site URLs,
 * then validates each one is live.
 * 
 * Usage:
 *   npx tsx scripts/multi-city-crawler.ts --metro nyc
 *   npx tsx scripts/multi-city-crawler.ts --metro all
 *   npx tsx scripts/multi-city-crawler.ts --platform square --metro chicago
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
  squareUrl?: string;
}

// ─── Metro Configurations ──────────────────────────────────────

const METROS: Record<string, { label: string; searchTerms: string[] }> = {
  nyc: {
    label: 'New York City',
    searchTerms: [
      'New York City restaurant', 'Manhattan restaurant', 'Brooklyn restaurant',
      'Queens restaurant', 'Bronx restaurant', 'Williamsburg restaurant',
      'East Village restaurant', 'Upper West Side restaurant', 'Harlem restaurant',
      'Astoria restaurant', 'Park Slope restaurant', 'Midtown restaurant',
      'Chelsea restaurant', 'SoHo restaurant', 'Lower East Side restaurant',
      'Hell\'s Kitchen restaurant', 'Murray Hill restaurant', 'Bushwick restaurant',
    ],
  },
  chicago: {
    label: 'Chicago',
    searchTerms: [
      'Chicago restaurant', 'Wicker Park restaurant', 'Lincoln Park restaurant',
      'Logan Square restaurant', 'Lakeview restaurant', 'River North restaurant',
      'West Loop restaurant', 'Pilsen restaurant', 'Hyde Park Chicago restaurant',
      'Bucktown restaurant', 'Andersonville restaurant', 'Chinatown Chicago restaurant',
      'Oak Park restaurant', 'Evanston restaurant',
    ],
  },
  la: {
    label: 'Los Angeles',
    searchTerms: [
      'Los Angeles restaurant', 'Hollywood restaurant', 'Santa Monica restaurant',
      'Silver Lake restaurant', 'DTLA restaurant', 'Venice Beach restaurant',
      'Koreatown LA restaurant', 'West Hollywood restaurant', 'Culver City restaurant',
      'Pasadena restaurant', 'Echo Park restaurant', 'Glendale restaurant',
      'Burbank restaurant', 'Long Beach restaurant',
    ],
  },
  boston: {
    label: 'Boston',
    searchTerms: [
      'Boston restaurant', 'Cambridge restaurant', 'Somerville restaurant',
      'South Boston restaurant', 'Back Bay restaurant', 'North End Boston restaurant',
      'Allston restaurant', 'Brookline restaurant', 'Jamaica Plain restaurant',
      'Fenway restaurant', 'Beacon Hill restaurant', 'South End Boston restaurant',
    ],
  },
  miami: {
    label: 'Miami',
    searchTerms: [
      'Miami restaurant', 'Miami Beach restaurant', 'Wynwood restaurant',
      'Brickell restaurant', 'Coral Gables restaurant', 'Little Havana restaurant',
      'Coconut Grove restaurant', 'Design District Miami restaurant',
      'Fort Lauderdale restaurant', 'Doral restaurant',
    ],
  },
  philly: {
    label: 'Philadelphia',
    searchTerms: [
      'Philadelphia restaurant', 'Center City Philly restaurant', 'Fishtown restaurant',
      'South Philly restaurant', 'Northern Liberties restaurant', 'Rittenhouse restaurant',
      'Old City Philadelphia restaurant', 'Manayunk restaurant', 'University City restaurant',
    ],
  },
  atlanta: {
    label: 'Atlanta',
    searchTerms: [
      'Atlanta restaurant', 'Midtown Atlanta restaurant', 'Buckhead restaurant',
      'Decatur restaurant', 'Inman Park restaurant', 'East Atlanta restaurant',
      'Ponce City Market restaurant', 'Virginia Highland restaurant', 'Westside Atlanta restaurant',
    ],
  },
  denver: {
    label: 'Denver',
    searchTerms: [
      'Denver restaurant', 'RiNo Denver restaurant', 'LoDo Denver restaurant',
      'Capitol Hill Denver restaurant', 'Cherry Creek restaurant', 'Highlands Denver restaurant',
      'Boulder restaurant', 'Lakewood restaurant', 'Aurora Colorado restaurant',
    ],
  },
  seattle: {
    label: 'Seattle',
    searchTerms: [
      'Seattle restaurant', 'Capitol Hill Seattle restaurant', 'Ballard restaurant',
      'Fremont Seattle restaurant', 'Queen Anne restaurant', 'Georgetown Seattle restaurant',
      'International District Seattle restaurant', 'Bellevue restaurant', 'Redmond restaurant',
    ],
  },
  sf: {
    label: 'San Francisco',
    searchTerms: [
      'San Francisco restaurant', 'Mission District restaurant', 'Hayes Valley restaurant',
      'North Beach SF restaurant', 'Marina SF restaurant', 'SOMA restaurant',
      'Castro restaurant', 'Richmond SF restaurant', 'Oakland restaurant', 'Berkeley restaurant',
    ],
  },
  houston: {
    label: 'Houston',
    searchTerms: [
      'Houston restaurant', 'Montrose Houston restaurant', 'Heights Houston restaurant',
      'Midtown Houston restaurant', 'EaDo Houston restaurant', 'Rice Village restaurant',
      'Galleria Houston restaurant', 'Katy TX restaurant', 'Sugar Land TX restaurant',
    ],
  },
  nashville: {
    label: 'Nashville',
    searchTerms: [
      'Nashville restaurant', 'East Nashville restaurant', 'Germantown Nashville restaurant',
      'The Gulch Nashville restaurant', '12South Nashville restaurant', 'Midtown Nashville restaurant',
      'Hillsboro Village restaurant', 'Berry Hill restaurant', 'Franklin TN restaurant',
    ],
  },
  portland: {
    label: 'Portland',
    searchTerms: [
      'Portland Oregon restaurant', 'Alberta Arts Portland restaurant', 'Pearl District restaurant',
      'Division Street Portland restaurant', 'Hawthorne Portland restaurant',
      'Mississippi Portland restaurant', 'Sellwood restaurant', 'NW 23rd Portland restaurant',
    ],
  },
  minneapolis: {
    label: 'Minneapolis',
    searchTerms: [
      'Minneapolis restaurant', 'Northeast Minneapolis restaurant', 'Uptown Minneapolis restaurant',
      'North Loop Minneapolis restaurant', 'St Paul restaurant', 'Dinkytown restaurant',
      'Linden Hills restaurant', 'Eat Street Minneapolis restaurant',
    ],
  },
  nola: {
    label: 'New Orleans',
    searchTerms: [
      'New Orleans restaurant', 'French Quarter restaurant', 'Garden District restaurant',
      'Bywater restaurant', 'Magazine Street restaurant', 'Marigny restaurant',
      'Uptown New Orleans restaurant', 'Mid-City New Orleans restaurant', 'Metairie restaurant',
    ],
  },
  sandiego: {
    label: 'San Diego',
    searchTerms: [
      'San Diego restaurant', 'North Park restaurant', 'Hillcrest restaurant',
      'Gaslamp Quarter restaurant', 'Pacific Beach restaurant', 'La Jolla restaurant',
      'Little Italy San Diego restaurant', 'Ocean Beach San Diego restaurant',
    ],
  },
};

// ─── Web Search ────────────────────────────────────────────────

async function searchBrave(query: string): Promise<string[]> {
  const BRAVE_KEY = process.env.BRAVE_API_KEY;
  if (!BRAVE_KEY) return [];
  
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`;
  try {
    const res = await fetch(url, { headers: { 'X-Subscription-Token': BRAVE_KEY, Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.web?.results || []).map((r: { url: string }) => r.url);
  } catch { return []; }
}

async function searchGoogle(query: string): Promise<string[]> {
  // Fallback: use web_fetch on Google search results
  // This is rate-limited but doesn't need an API key
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=20`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } });
    const html = await res.text();
    const urls: string[] = [];
    const regex = /https?:\/\/[\w-]+\.(?:toast|square)\.site[^\s"<>]*/g;
    let match;
    while ((match = regex.exec(html)) !== null) urls.push(match[0]);
    return urls;
  } catch { return []; }
}

function extractSlugs(urls: string[], platform: 'toast' | 'square'): Set<string> {
  const slugs = new Set<string>();
  const domain = platform === 'toast' ? 'toast.site' : 'square.site';
  for (const url of urls) {
    const match = url.match(new RegExp(`https?://([\\w-]+)\\.${domain.replace('.', '\\.')}`));
    if (match) slugs.add(match[1].toLowerCase());
  }
  return slugs;
}

// ─── URL Validation ────────────────────────────────────────────

async function validateUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch { return false; }
}

// ─── Main Crawler ──────────────────────────────────────────────

async function crawlMetro(metroKey: string, platform: 'toast' | 'square' | 'both' = 'both') {
  const metro = METROS[metroKey];
  if (!metro) { console.error(`Unknown metro: ${metroKey}`); return; }

  console.log(`\n🔍 Crawling ${metro.label} (${platform})...`);
  const allSlugs = { toast: new Set<string>(), square: new Set<string>() };
  
  const platforms = platform === 'both' ? ['toast', 'square'] as const : [platform] as const;

  for (const plat of platforms) {
    const domain = plat === 'toast' ? 'toast.site' : 'square.site';
    console.log(`  📡 Searching ${plat} sites...`);
    
    for (const term of metro.searchTerms) {
      const query = `site:${domain} ${term}`;
      
      // Try Brave first, fall back to Google scraping
      let urls = await searchBrave(query);
      if (urls.length === 0) {
        urls = await searchGoogle(query);
      }
      
      const slugs = extractSlugs(urls, plat);
      for (const s of slugs) allSlugs[plat].add(s);
      
      // Rate limit
      await new Promise(r => setTimeout(r, 1100));
      
      if (slugs.size > 0) {
        process.stdout.write(`    ✓ "${term}" → ${slugs.size} new (${allSlugs[plat].size} total)\n`);
      }
    }
  }

  console.log(`\n  📋 Discovered: Toast=${allSlugs.toast.size}, Square=${allSlugs.square.size}`);
  
  // Validate all discovered URLs
  const restaurants: Restaurant[] = [];
  const allEntries: Array<{ slug: string; platform: 'toast' | 'square' }> = [
    ...[...allSlugs.toast].map(s => ({ slug: s, platform: 'toast' as const })),
    ...[...allSlugs.square].map(s => ({ slug: s, platform: 'square' as const })),
  ];

  console.log(`  🔗 Validating ${allEntries.length} URLs...`);
  
  let validated = 0;
  let live = 0;
  const BATCH = 10;
  
  for (let i = 0; i < allEntries.length; i += BATCH) {
    const batch = allEntries.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(async ({ slug, platform: plat }) => {
      const domain = plat === 'toast' ? 'toast.site' : 'square.site';
      const url = `https://${slug}.${domain}/`;
      const ok = await validateUrl(url);
      return { slug, platform: plat, url, ok };
    }));

    for (const r of results) {
      validated++;
      if (r.ok) {
        live++;
        const name = r.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const entry: Restaurant = {
          name,
          slug: r.slug,
          category: 'restaurant',
          metros: [metroKey],
        };
        if (r.platform === 'toast') entry.toastUrl = r.url;
        else entry.squareUrl = r.url;
        restaurants.push(entry);
      }
    }
    
    process.stdout.write(`  Progress: ${validated}/${allEntries.length} validated, ${live} live\r`);
  }

  console.log(`\n\n  📁 Saved ${restaurants.length} restaurants to scripts/${metroKey}-restaurants.json`);
  
  // Save JSON
  writeFileSync(`scripts/${metroKey}-restaurants.json`, JSON.stringify(restaurants, null, 2));
  
  // Save TypeScript snippet
  const tsLines = restaurants.map(r => {
    const urlPart = r.toastUrl ? `, toastUrl: '${r.toastUrl}'` : r.squareUrl ? `, squareUrl: '${r.squareUrl}'` : '';
    return `  { name: '${r.name.replace(/'/g, "\\'")}', slug: '${r.slug}', category: '${r.category}', metros: ['${metroKey}']${urlPart} },`;
  });
  
  const ts = `// Auto-generated by multi-city-crawler.ts — ${new Date().toISOString()}
// ${restaurants.length} verified restaurants in ${metro.label}

export const ${metroKey.toUpperCase()}_RESTAURANTS: RestaurantData[] = [
${tsLines.join('\n')}
];
`;
  writeFileSync(`scripts/${metroKey}-restaurants.ts`, ts);
  console.log(`  ✅ Verified/live: ${live}`);
  console.log(`  ❌ Dead/unreachable: ${validated - live}`);
  console.log(`  📝 TypeScript snippet: scripts/${metroKey}-restaurants.ts`);
  
  return restaurants;
}

// ─── CLI ───────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const metroIdx = args.indexOf('--metro');
  const platIdx = args.indexOf('--platform');
  
  const metroArg = metroIdx >= 0 ? args[metroIdx + 1] : 'all';
  const platform = (platIdx >= 0 ? args[platIdx + 1] : 'both') as 'toast' | 'square' | 'both';
  
  console.log('🍔 MealCompare Multi-City Restaurant Crawler');
  console.log(`   Platform: ${platform}`);
  
  if (metroArg === 'all') {
    const allResults: Restaurant[] = [];
    for (const key of Object.keys(METROS)) {
      const results = await crawlMetro(key, platform);
      if (results) allResults.push(...results);
    }
    console.log(`\n\n🎉 TOTAL: ${allResults.length} restaurants across ${Object.keys(METROS).length} cities`);
    writeFileSync('scripts/all-cities-restaurants.json', JSON.stringify(allResults, null, 2));
  } else {
    await crawlMetro(metroArg, platform);
  }
}

main().catch(console.error);
