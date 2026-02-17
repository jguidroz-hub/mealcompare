#!/usr/bin/env npx tsx
/**
 * Round 4: Add 10 NEW metros + deeper queries for existing ones.
 * Focus on ordering platform directories and "order online" patterns.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
  squareUrl?: string;
  websiteOrderUrl?: string;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40);
}

function categoryFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('pizza')) return 'pizza';
  if (n.includes('sushi') || n.includes('ramen')) return 'japanese';
  if (n.includes('thai')) return 'thai';
  if (n.includes('taco') || n.includes('mexican')) return 'mexican';
  if (n.includes('indian') || n.includes('curry')) return 'indian';
  if (n.includes('burger')) return 'burgers';
  if (n.includes('bbq') || n.includes('barbecue')) return 'bbq';
  if (n.includes('cafe') || n.includes('coffee') || n.includes('bakery')) return 'cafe';
  if (n.includes('deli') || n.includes('sandwich')) return 'deli';
  if (n.includes('wing')) return 'wings';
  if (n.includes('chinese') || n.includes('dumpling')) return 'chinese';
  if (n.includes('korean')) return 'korean';
  if (n.includes('pho') || n.includes('vietnamese')) return 'vietnamese';
  if (n.includes('seafood') || n.includes('fish')) return 'seafood';
  if (n.includes('italian') || n.includes('pasta')) return 'italian';
  if (n.includes('steak')) return 'steakhouse';
  if (n.includes('poke')) return 'poke';
  if (n.includes('mediterranean') || n.includes('falafel')) return 'mediterranean';
  return 'restaurant';
}

// NEW metros to add
const ALL_METROS: Record<string, string> = {
  // Existing
  nyc: 'New York City', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans',
  // NEW
  dallas: 'Dallas', phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit',
  minneapolis: 'Minneapolis', charlotte: 'Charlotte', tampa: 'Tampa',
  sandiego: 'San Diego', stlouis: 'St Louis', pittsburgh: 'Pittsburgh',
  columbus: 'Columbus Ohio', indianapolis: 'Indianapolis', milwaukee: 'Milwaukee',
  raleigh: 'Raleigh', baltimore: 'Baltimore',
};

async function searchBrave(query: string): Promise<Array<{ title: string; url: string; description: string }>> {
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': process.env.BRAVE_API_KEY || '' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.web?.results || []).map((r: any) => ({ title: r.title, url: r.url, description: r.description || '' }));
  } catch { return []; }
}

function extractDirectUrl(url: string): { type: string; cleanUrl: string } | null {
  if (url.match(/order\.toasttab\.com\/online\//)) return { type: 'toastUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.toast\.site/)) return { type: 'toastUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/ordering\.chownow\.com\/order\//)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/order\.online\/store\//)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.popmenu\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.olo\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.owner\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.menufy\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.square\.site/)) return { type: 'squareUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.gloria\.food/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.clover\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/[\w-]+\.slice\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  if (url.match(/direct\.chownow\.com/)) return { type: 'websiteOrderUrl', cleanUrl: url.split('?')[0] };
  return null;
}

function cleanName(title: string): string {
  return title
    .replace(/\| Order Online.*$/i, '').replace(/- Online Order.*$/i, '')
    .replace(/\| Toast.*$/i, '').replace(/\| ChowNow.*$/i, '')
    .replace(/Order from /i, '').replace(/ - Delivery.*$/i, '')
    .replace(/ \| Menu.*$/i, '').replace(/ Online Ordering$/i, '')
    .replace(/ \| [\w\s]+, [A-Z]{2}$/i, '').replace(/ - [\w\s]+, [A-Z]{2}$/i, '')
    .replace(/ \| Popmenu$/i, '').replace(/ \| Square$/i, '')
    .trim();
}

const QUERY_TEMPLATES = [
  (label: string) => `"order online" restaurant ${label} site:toasttab.com`,
  (label: string) => `"order online" restaurant ${label} site:chownow.com`,
  (label: string) => `restaurant ${label} "order directly from" toast`,
  (label: string) => `best pizza ${label} order online toasttab`,
  (label: string) => `best restaurants ${label} site:order.online`,
  (label: string) => `restaurant ${label} site:popmenu.com`,
  (label: string) => `${label} restaurant online ordering chownow`,
  (label: string) => `best food ${label} "order for pickup" toasttab`,
  (label: string) => `popular ${label} restaurants direct ordering`,
  (label: string) => `${label} food delivery "order from our website"`,
  (label: string) => `best ${label} restaurants menufy OR olo OR owner.com`,
  (label: string) => `${label} restaurant "skip the fees" order direct`,
  (label: string) => `${label} pizza delivery direct ordering toast OR square`,
  (label: string) => `${label} thai food order online toasttab OR chownow`,
  (label: string) => `${label} mexican restaurant order direct`,
  (label: string) => `${label} sushi order online restaurant website`,
  (label: string) => `${label} burger restaurant order direct pickup`,
  (label: string) => `${label} indian restaurant order online direct`,
  (label: string) => `${label} chinese food order direct toasttab`,
  (label: string) => `${label} bbq restaurant order online direct`,
];

(async () => {
  const targetMetro = process.argv[2];
  const onlyNew = process.argv.includes('--new-only');
  
  let metros: Record<string, string>;
  if (targetMetro) {
    metros = { [targetMetro]: ALL_METROS[targetMetro] };
  } else if (onlyNew) {
    // Only new metros not in original 15
    const original = new Set(['nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta','seattle','denver','philly','nashville','nola']);
    metros = Object.fromEntries(Object.entries(ALL_METROS).filter(([k]) => !original.has(k)));
  } else {
    metros = ALL_METROS;
  }

  let totalNew = 0;

  for (const [metro, label] of Object.entries(metros)) {
    if (!label) continue;
    const file = `scripts/${metro}-places.json`;
    const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
    const seen = new Set(existing.map(r => r.slug));
    const newOnes: Restaurant[] = [];

    const queries = QUERY_TEMPLATES.map(fn => fn(label));
    console.log(`\n🔍 ${metro.toUpperCase()} (${label}) — ${queries.length} queries...`);

    for (const query of queries) {
      const results = await searchBrave(query);
      for (const r of results) {
        const direct = extractDirectUrl(r.url);
        if (!direct) continue;
        const name = cleanName(r.title);
        if (name.length < 3 || name.length > 60) continue;
        const slug = slugify(name);
        if (seen.has(slug)) continue;
        seen.add(slug);
        newOnes.push({ name, slug, category: categoryFromName(name), metros: [metro], [direct.type]: direct.cleanUrl } as Restaurant);
      }
      await new Promise(r => setTimeout(r, 350));
    }

    if (newOnes.length > 0) {
      writeFileSync(file, JSON.stringify([...existing, ...newOnes], null, 2));
    }
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} new (${existing.length + newOnes.length} total)`);
  }

  console.log(`\n🎉 Grand total new: ${totalNew}`);
})();
