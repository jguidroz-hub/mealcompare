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
  houston: {
    areas: [
      'Houston TX', 'Downtown Houston', 'Montrose Houston', 'The Heights Houston',
      'Midtown Houston', 'Rice Village Houston', 'Upper Kirby Houston', 'River Oaks Houston',
      'EaDo Houston', 'Katy TX', 'Sugar Land TX', 'The Woodlands TX',
      'Pearland TX', 'Cypress TX', 'Spring TX', 'League City TX',
    ],
    zips: [
      '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009',
      '77010', '77019', '77020', '77021', '77025', '77027', '77030', '77042',
      '77043', '77055', '77056', '77057', '77058', '77062', '77077', '77079',
      '77094', '77339', '77450', '77478', '77479', '77494',
    ],
  },
  dallas: {
    areas: [
      'Dallas TX', 'Deep Ellum Dallas', 'Uptown Dallas', 'Bishop Arts Dallas',
      'Lower Greenville Dallas', 'Knox Henderson Dallas', 'Design District Dallas',
      'Fort Worth TX', 'Plano TX', 'Frisco TX', 'Arlington TX', 'McKinney TX',
      'Denton TX', 'Richardson TX', 'Garland TX', 'Irving TX',
    ],
    zips: [
      '75201', '75202', '75204', '75205', '75206', '75207', '75209', '75214',
      '75215', '75219', '75226', '75240', '75243', '75248', '75252', '75254',
      '76102', '76104', '76107', '76109', '76116', '76132', '75023', '75024',
      '75034', '75035', '75070', '75071', '75080', '75081',
    ],
  },
  chicago: {
    areas: [
      'Chicago IL', 'River North Chicago', 'Wicker Park Chicago', 'Lincoln Park Chicago',
      'Logan Square Chicago', 'West Loop Chicago', 'Lakeview Chicago', 'Bucktown Chicago',
      'Pilsen Chicago', 'Hyde Park Chicago', 'Old Town Chicago', 'Chinatown Chicago',
      'Evanston IL', 'Oak Park IL', 'Naperville IL', 'Schaumburg IL',
    ],
    zips: [
      '60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608',
      '60610', '60611', '60612', '60613', '60614', '60615', '60616', '60618',
      '60622', '60623', '60625', '60626', '60630', '60631', '60634', '60640',
      '60647', '60657', '60660', '60661', '60201', '60202',
    ],
  },
  nyc: {
    areas: [
      'Manhattan NYC', 'Brooklyn NYC', 'Williamsburg Brooklyn', 'East Village NYC',
      'West Village NYC', 'Chelsea NYC', 'SoHo NYC', 'Lower East Side NYC',
      'Upper West Side NYC', 'Upper East Side NYC', 'Harlem NYC', "Hell's Kitchen NYC",
      'Bushwick Brooklyn', 'Park Slope Brooklyn', 'Astoria Queens', 'Long Island City Queens',
    ],
    zips: [
      '10001', '10002', '10003', '10004', '10005', '10006', '10007', '10009',
      '10010', '10011', '10012', '10013', '10014', '10016', '10017', '10018',
      '10019', '10021', '10022', '10023', '10024', '10025', '10028', '10029',
      '10036', '10128', '11201', '11211', '11215', '11101',
    ],
  },
  la: {
    areas: [
      'Los Angeles CA', 'Hollywood CA', 'Silver Lake Los Angeles', 'Echo Park Los Angeles',
      'Venice Beach CA', 'Santa Monica CA', 'West Hollywood CA', 'Beverly Hills CA',
      'Koreatown Los Angeles', 'Downtown Los Angeles', 'Culver City CA', 'Glendale CA',
      'Pasadena CA', 'Burbank CA', 'Long Beach CA', 'Torrance CA',
    ],
    zips: [
      '90001', '90004', '90005', '90006', '90007', '90012', '90013', '90014',
      '90015', '90017', '90019', '90020', '90024', '90025', '90026', '90027',
      '90028', '90029', '90034', '90035', '90036', '90038', '90039', '90046',
      '90048', '90064', '90066', '90069', '90210', '90401',
    ],
  },
  sf: {
    areas: [
      'San Francisco CA', 'Mission District SF', 'SoMa San Francisco', 'Castro SF',
      'North Beach SF', 'Nob Hill SF', 'Haight Ashbury SF', 'Marina SF',
      'Financial District SF', 'Sunset SF', 'Richmond SF', 'Tenderloin SF',
      'Oakland CA', 'Berkeley CA', 'San Jose CA', 'Palo Alto CA',
    ],
    zips: [
      '94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110',
      '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121',
      '94122', '94123', '94124', '94127', '94131', '94132', '94133', '94134',
      '94158', '94601', '94602', '94609', '94704', '94301',
    ],
  },
  miami: {
    areas: [
      'Miami FL', 'South Beach Miami', 'Wynwood Miami', 'Brickell Miami',
      'Little Havana Miami', 'Coral Gables FL', 'Coconut Grove Miami',
      'Miami Beach FL', 'Fort Lauderdale FL', 'Hollywood FL',
      'Aventura FL', 'Doral FL', 'Hialeah FL', 'Kendall FL',
    ],
    zips: [
      '33101', '33109', '33125', '33127', '33128', '33129', '33130', '33131',
      '33132', '33133', '33134', '33135', '33136', '33137', '33139', '33140',
      '33141', '33142', '33143', '33144', '33145', '33146', '33149', '33154',
      '33156', '33160', '33166', '33172', '33301', '33304',
    ],
  },
  atlanta: {
    areas: [
      'Atlanta GA', 'Midtown Atlanta', 'Buckhead Atlanta', 'Decatur GA',
      'Virginia Highland Atlanta', 'Inman Park Atlanta', 'Old Fourth Ward Atlanta',
      'East Atlanta Village', 'Ponce City Market', 'Westside Atlanta',
      'Sandy Springs GA', 'Marietta GA', 'Roswell GA', 'Alpharetta GA',
    ],
    zips: [
      '30301', '30303', '30305', '30306', '30307', '30308', '30309', '30310',
      '30312', '30313', '30314', '30316', '30317', '30318', '30319', '30324',
      '30326', '30327', '30328', '30329', '30030', '30033', '30060', '30062',
      '30075', '30076', '30097', '30338', '30339', '30342',
    ],
  },
  boston: {
    areas: [
      'Boston MA', 'Back Bay Boston', 'South End Boston', 'North End Boston',
      'Beacon Hill Boston', 'Fenway Boston', 'Allston MA', 'Brighton MA',
      'Cambridge MA', 'Somerville MA', 'Brookline MA', 'Jamaica Plain MA',
      'Dorchester MA', 'South Boston MA', 'Quincy MA', 'Newton MA',
    ],
    zips: [
      '02108', '02109', '02110', '02111', '02113', '02114', '02115', '02116',
      '02118', '02119', '02120', '02121', '02122', '02124', '02125', '02127',
      '02128', '02129', '02130', '02131', '02132', '02134', '02135', '02136',
      '02138', '02139', '02140', '02141', '02143', '02144',
    ],
  },
  seattle: {
    areas: [
      'Seattle WA', 'Capitol Hill Seattle', 'Ballard Seattle', 'Fremont Seattle',
      'Wallingford Seattle', 'University District Seattle', 'Queen Anne Seattle',
      'Georgetown Seattle', 'Columbia City Seattle', 'Beacon Hill Seattle',
      'Bellevue WA', 'Redmond WA', 'Kirkland WA', 'Renton WA',
    ],
    zips: [
      '98101', '98102', '98103', '98104', '98105', '98106', '98107', '98108',
      '98109', '98112', '98115', '98116', '98117', '98118', '98119', '98121',
      '98122', '98125', '98126', '98133', '98136', '98144', '98199', '98004',
      '98005', '98006', '98007', '98008', '98052', '98033',
    ],
  },
  denver: {
    areas: [
      'Denver CO', 'LoDo Denver', 'RiNo Denver', 'Capitol Hill Denver',
      'Highlands Denver', 'Cherry Creek Denver', 'Wash Park Denver',
      'Five Points Denver', 'Baker Denver', 'South Broadway Denver',
      'Aurora CO', 'Lakewood CO', 'Littleton CO', 'Boulder CO',
    ],
    zips: [
      '80202', '80203', '80204', '80205', '80206', '80209', '80210', '80211',
      '80212', '80214', '80216', '80218', '80219', '80220', '80222', '80223',
      '80224', '80227', '80230', '80231', '80232', '80237', '80246', '80247',
      '80010', '80011', '80012', '80013', '80014', '80302',
    ],
  },
  philly: {
    areas: [
      'Philadelphia PA', 'Center City Philadelphia', 'Old City Philadelphia',
      'Rittenhouse Philadelphia', 'Fishtown Philadelphia', 'Northern Liberties Philadelphia',
      'South Philadelphia', 'University City Philadelphia', 'Manayunk Philadelphia',
      'Fairmount Philadelphia', 'Germantown Philadelphia', 'West Philadelphia',
      'Cherry Hill NJ', 'King of Prussia PA', 'Conshohocken PA', 'Ardmore PA',
    ],
    zips: [
      '19102', '19103', '19104', '19106', '19107', '19109', '19111', '19112',
      '19116', '19118', '19119', '19121', '19122', '19123', '19124', '19125',
      '19126', '19127', '19128', '19129', '19130', '19131', '19132', '19133',
      '19134', '19135', '19136', '19137', '19138', '19139',
    ],
  },
  nashville: {
    areas: [
      'Nashville TN', 'East Nashville', 'Germantown Nashville', 'The Gulch Nashville',
      'Midtown Nashville', '12 South Nashville', 'Hillsboro Village Nashville',
      'Sylvan Park Nashville', 'Berry Hill Nashville', 'Donelson Nashville',
      'Franklin TN', 'Brentwood TN', 'Murfreesboro TN', 'Hendersonville TN',
    ],
    zips: [
      '37201', '37203', '37204', '37205', '37206', '37207', '37208', '37209',
      '37210', '37211', '37212', '37213', '37214', '37215', '37216', '37217',
      '37218', '37219', '37220', '37221', '37027', '37064', '37067', '37069',
      '37075', '37128', '37129', '37130', '37135', '37138',
    ],
  },
  portland: {
    areas: [
      'Portland OR', 'Pearl District Portland', 'Alberta Arts Portland',
      'Hawthorne Portland', 'Division Street Portland', 'Mississippi Portland',
      'Northwest Portland', 'Sellwood Portland', 'St Johns Portland',
      'Beaverton OR', 'Lake Oswego OR', 'Tigard OR', 'Hillsboro OR', 'Gresham OR',
    ],
    zips: [
      '97201', '97202', '97203', '97204', '97205', '97206', '97209', '97210',
      '97211', '97212', '97213', '97214', '97215', '97216', '97217', '97218',
      '97219', '97220', '97221', '97222', '97223', '97224', '97225', '97227',
      '97229', '97230', '97231', '97232', '97233', '97005',
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
    const metroLabel = config.areas[0] || metro;
    const query = `site:toast.site ${metroLabel} ${kw}`;
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
