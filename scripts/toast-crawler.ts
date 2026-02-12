#!/usr/bin/env npx tsx
/**
 * Toast Restaurant Crawler — Multi-source discovery
 * 
 * Sources:
 * 1. Brave Search API: site:toast.site + metro keywords
 * 2. toasttab.com/local: Toast's own restaurant finder
 * 3. URL validation: verify each discovered site is live
 * 4. Page scraping: extract name/address from live Toast sites
 * 
 * Usage: 
 *   npx tsx scripts/toast-crawler.ts --metro dc
 *   npx tsx scripts/toast-crawler.ts --metro austin
 *   npx tsx scripts/toast-crawler.ts --all
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

interface ToastRestaurant {
  name: string;
  slug: string;
  url: string;
  address: string;
  metro: string;
  source: 'brave' | 'toasttab' | 'manual';
  verified: boolean;
  statusCode: number;
}

// ─── Configuration ─────────────────────────────────────────────

const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';

const METRO_CONFIG: Record<string, { areas: string[]; zips: string[] }> = {
  dc: {
    areas: [
      'Washington DC', 'Georgetown DC', 'Capitol Hill', 'Dupont Circle',
      'Adams Morgan', 'Shaw DC', 'U Street NW', 'H Street NE',
      'Navy Yard DC', 'Foggy Bottom', 'Chinatown DC', 'Logan Circle',
      'Columbia Heights', 'Petworth DC', 'Brookland DC', 'NoMa DC',
      'Arlington VA', 'Alexandria VA', 'Bethesda MD', 'Silver Spring MD',
      'Falls Church VA', 'Tysons VA', 'Rockville MD', 'College Park MD',
      'Annandale VA', 'Fairfax VA', 'Reston VA', 'McLean VA',
    ],
    zips: [
      '20001', '20002', '20003', '20004', '20005', '20006', '20007', '20008',
      '20009', '20010', '20011', '20012', '20015', '20016', '20017', '20018',
      '20019', '20020', '20024', '20036', '20037', '22201', '22202', '22203',
      '22301', '22302', '22314', '20814', '20815', '20910',
    ],
  },
  austin: {
    areas: [
      'Austin TX', 'Downtown Austin', 'South Congress Austin', 'East Austin',
      'South Lamar Austin', 'North Austin', 'Mueller Austin', 'Rainey Street',
      'The Domain Austin', 'Barton Springs', 'Zilker Austin', 'Hyde Park Austin',
      'Cedar Park TX', 'Round Rock TX', 'Georgetown TX', 'Pflugerville TX',
      'Lakeway TX', 'Bee Cave TX', 'Dripping Springs TX', 'Kyle TX',
      'San Marcos TX', 'Buda TX', 'Leander TX',
    ],
    zips: [
      '78701', '78702', '78703', '78704', '78705', '78721', '78722', '78723',
      '78724', '78726', '78727', '78728', '78729', '78730', '78731', '78741',
      '78742', '78745', '78748', '78749', '78750', '78751', '78752', '78753',
      '78756', '78757', '78758', '78759', '78613', '78664', '78665',
    ],
  },
};

// ─── Brave Search ──────────────────────────────────────────────

async function braveSearch(query: string, count = 20): Promise<string[]> {
  if (!BRAVE_API_KEY) {
    console.warn('  ⚠️ No BRAVE_API_KEY — skipping Brave search');
    return [];
  }

  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
  try {
    const res = await fetch(url, {
      headers: { 'X-Subscription-Token': BRAVE_API_KEY, 'Accept': 'application/json' },
    });
    if (!res.ok) {
      console.warn(`  ⚠️ Brave returned ${res.status} for: ${query}`);
      return [];
    }
    const data = await res.json();
    const results = data.web?.results || [];
    return results.map((r: { url: string }) => r.url).filter((u: string) =>
      u.includes('toast.site') || u.includes('toasttab.com')
    );
  } catch (e) {
    console.warn(`  ⚠️ Brave error: ${e}`);
    return [];
  }
}

async function discoverViaBrave(metro: string): Promise<Map<string, string>> {
  const config = METRO_CONFIG[metro];
  if (!config) return new Map();

  const discovered = new Map<string, string>(); // url → source query
  console.log(`\n🔍 Brave Search for ${metro.toUpperCase()} (${config.areas.length} area queries)...`);

  for (const area of config.areas) {
    const query = `site:toast.site ${area} restaurant`;
    const urls = await braveSearch(query, 20);
    for (const url of urls) {
      if (!discovered.has(url)) {
        discovered.set(url, query);
      }
    }
    console.log(`  ${area}: ${urls.length} results`);

    // Rate limit: 1 req/sec for free Brave tier
    await new Promise(r => setTimeout(r, 1100));
  }

  // Also search with "order" and "food" keywords
  for (const kw of ['order food', 'delivery', 'takeout', 'menu']) {
    const query = `site:toast.site ${metro === 'dc' ? 'Washington DC' : 'Austin TX'} ${kw}`;
    const urls = await braveSearch(query, 20);
    for (const url of urls) {
      if (!discovered.has(url)) discovered.set(url, query);
    }
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log(`  📊 Brave total: ${discovered.size} unique Toast URLs`);
  return discovered;
}

// ─── Toast Local Directory ─────────────────────────────────────

async function discoverViaToastLocal(metro: string): Promise<Map<string, string>> {
  const config = METRO_CONFIG[metro];
  if (!config) return new Map();

  const discovered = new Map<string, string>();
  console.log(`\n🏪 Toast Local directory for ${metro.toUpperCase()} (${config.zips.length} zips)...`);

  for (const zip of config.zips) {
    try {
      // Toast's local search endpoint
      const url = `https://www.toasttab.com/local/search?q=${zip}&page=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      if (!res.ok) {
        console.log(`  ${zip}: HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Extract toast.site links and toasttab.com/local/order links
      const toastSiteRegex = /https?:\/\/[\w-]+\.toast\.site[/]?/g;
      const toastTabRegex = /https?:\/\/(?:www\.)?toasttab\.com\/local\/(?:order\/)?[\w-]+[/\w-]*/g;

      const siteMatches = html.match(toastSiteRegex) || [];
      const tabMatches = html.match(toastTabRegex) || [];

      for (const m of [...siteMatches, ...tabMatches]) {
        if (!discovered.has(m)) discovered.set(m, `toast-local:${zip}`);
      }

      console.log(`  ${zip}: ${siteMatches.length + tabMatches.length} links`);
      await new Promise(r => setTimeout(r, 500)); // gentle rate limit
    } catch (e) {
      console.log(`  ${zip}: error — ${e}`);
    }
  }

  console.log(`  📊 Toast Local total: ${discovered.size} unique URLs`);
  return discovered;
}

// ─── URL Validation & Scraping ─────────────────────────────────

function extractSlugFromUrl(url: string): string {
  // https://restaurantname.toast.site/ → restaurantname
  const toastSiteMatch = url.match(/https?:\/\/([\w-]+)\.toast\.site/);
  if (toastSiteMatch) return toastSiteMatch[1];

  // https://toasttab.com/local/order/restaurant-name/... → restaurant-name
  const tabMatch = url.match(/toasttab\.com\/local(?:\/order)?\/([\w-]+)/);
  if (tabMatch) return tabMatch[1];

  return url.replace(/[^a-z0-9-]/g, '').slice(0, 40);
}

function extractNameFromSlug(slug: string): string {
  return slug
    .replace(/-+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\b(Dc|Nw|Ne|Sw|Se|Va|Md|Tx)\b/g, m => m.toUpperCase())
    .trim();
}

async function validateAndScrape(url: string, metro: string, source: string): Promise<ToastRestaurant | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      redirect: 'follow',
    });

    const slug = extractSlugFromUrl(url);

    // Toast sites often return 403 (Cloudflare) to server-side requests
    // but the site is still valid. Treat 403 from toast.site as "verified"
    const isToastDomain = url.includes('toast.site') || url.includes('toasttab.com');
    if (!res.ok && !(isToastDomain && res.status === 403)) {
      return {
        name: extractNameFromSlug(slug),
        slug,
        url,
        address: '',
        metro,
        source: source.startsWith('toast-local') ? 'toasttab' : 'brave',
        verified: false,
        statusCode: res.status,
      };
    }

    // For 403 Toast sites, we can't scrape but we know they exist
    if (res.status === 403) {
      return {
        name: extractNameFromSlug(slug),
        slug,
        url: url.endsWith('/') ? url : url + '/',
        address: '',
        metro,
        source: source.startsWith('toast-local') ? 'toasttab' : 'brave',
        verified: true,
        statusCode: 403,
      };
    }

    const html = await res.text();

    // Try to extract restaurant name from <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let name = titleMatch ? titleMatch[1].split('|')[0].split('-')[0].trim() : extractNameFromSlug(slug);
    // Clean up common suffixes
    name = name.replace(/\s*(Online Order(ing)?|Delivery|Menu|Toast)\s*$/i, '').trim();
    if (!name || name === 'Toast') name = extractNameFromSlug(slug);

    // Try to extract address from meta or JSON-LD
    let address = '';
    const addressMeta = html.match(/content="([^"]*\d{5}[^"]*)"/); // Heuristic: contains zip code
    if (addressMeta) address = addressMeta[1];

    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const ld = JSON.parse(jsonLdMatch[1]);
        if (ld.address) {
          const a = ld.address;
          address = [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode]
            .filter(Boolean).join(', ');
        }
        if (ld.name && ld.name !== 'Toast') name = ld.name;
      } catch {}
    }

    return {
      name,
      slug,
      url: url.endsWith('/') ? url : url + '/',
      address,
      metro,
      source: source.startsWith('toast-local') ? 'toasttab' : 'brave',
      verified: true,
      statusCode: res.status,
    };
  } catch {
    return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────

async function crawl(metro: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Toast Crawler — ${metro.toUpperCase()}`);
  console.log(`${'='.repeat(60)}`);

  // Phase 1: Discovery
  const braveUrls = await discoverViaBrave(metro);
  const toastLocalUrls = await discoverViaToastLocal(metro);

  // Merge unique URLs
  const allUrls = new Map<string, string>();
  for (const [url, src] of braveUrls) allUrls.set(url, src);
  for (const [url, src] of toastLocalUrls) {
    if (!allUrls.has(url)) allUrls.set(url, src);
  }

  console.log(`\n📊 Total unique URLs: ${allUrls.size} (Brave: ${braveUrls.size}, Toast Local: ${toastLocalUrls.size})`);

  // Load existing to skip re-validation
  const outputFile = `scripts/toast-${metro}-results.json`;
  let existing: ToastRestaurant[] = [];
  if (existsSync(outputFile)) {
    existing = JSON.parse(readFileSync(outputFile, 'utf-8'));
    console.log(`  📂 ${existing.length} already in ${outputFile}`);
  }
  const existingUrls = new Set(existing.map(r => r.url));

  // Phase 2: Validate new URLs
  const newUrls = [...allUrls.entries()].filter(([url]) => !existingUrls.has(url));
  console.log(`\n✅ Validating ${newUrls.length} new URLs...`);

  const results: ToastRestaurant[] = [...existing];
  let validated = 0;
  let live = 0;

  for (const [url, source] of newUrls) {
    const result = await validateAndScrape(url, metro, source);
    if (result) {
      results.push(result);
      if (result.verified) live++;
    }
    validated++;

    if (validated % 10 === 0) {
      console.log(`  Progress: ${validated}/${newUrls.length} validated, ${live} live`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  // Phase 3: Deduplicate by slug
  const slugMap = new Map<string, ToastRestaurant>();
  for (const r of results) {
    const key = r.slug.toLowerCase();
    if (!slugMap.has(key) || (r.verified && !slugMap.get(key)!.verified)) {
      slugMap.set(key, r);
    }
  }
  const deduped = [...slugMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  // Save results
  writeFileSync(outputFile, JSON.stringify(deduped, null, 2));
  console.log(`\n📁 Saved ${deduped.length} restaurants to ${outputFile}`);
  console.log(`  ✅ Verified/live: ${deduped.filter(r => r.verified).length}`);
  console.log(`  ❌ Dead/unreachable: ${deduped.filter(r => !r.verified).length}`);

  // Generate TypeScript data snippet
  const tsSnippet = deduped
    .filter(r => r.verified)
    .map(r => `  { name: '${r.name.replace(/'/g, "\\'")}', slug: '${r.slug}', category: 'restaurant', metros: ['${metro}'], toastUrl: '${r.url}' },`)
    .join('\n');

  writeFileSync(`scripts/toast-${metro}-restaurants.ts`, `// Auto-generated by toast-crawler.ts — ${new Date().toISOString()}\n// ${deduped.filter(r => r.verified).length} verified Toast restaurants in ${metro.toUpperCase()}\n\nexport const TOAST_${metro.toUpperCase()}_RESTAURANTS = [\n${tsSnippet}\n];\n`);
  console.log(`  📝 TypeScript snippet: scripts/toast-${metro}-restaurants.ts`);

  return deduped;
}

// ─── CLI ───────────────────────────────────────────────────────

const args = process.argv.slice(2);
const metroArg = args.find(a => a.startsWith('--metro='))?.split('=')[1]
  || (args.includes('--metro') ? args[args.indexOf('--metro') + 1] : null);
const doAll = args.includes('--all');

(async () => {
  const start = Date.now();

  if (doAll) {
    for (const metro of Object.keys(METRO_CONFIG)) {
      await crawl(metro);
    }
  } else if (metroArg && METRO_CONFIG[metroArg]) {
    await crawl(metroArg);
  } else {
    console.log('Usage: npx tsx scripts/toast-crawler.ts --metro dc|austin');
    console.log('       npx tsx scripts/toast-crawler.ts --all');
    process.exit(1);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n⏱️ Done in ${elapsed}s`);
})();
