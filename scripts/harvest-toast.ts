#!/usr/bin/env npx tsx
/**
 * Harvest Toast ordering URLs from Brave Search for all metros.
 * Every result IS a direct ordering link — no website scraping needed.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
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
  if (n.includes('seafood') || n.includes('fish')) return 'seafood';
  return 'restaurant';
}

function cleanName(title: string): string {
  return title
    .replace(/\| Order Online.*$/i, '').replace(/- Online Order.*$/i, '')
    .replace(/\| Toast.*$/i, '').replace(/ \| Menu.*$/i, '')
    .replace(/ Online Ordering$/i, '').replace(/ - Toast$/i, '')
    .replace(/ \| [\w\s,]+$/i, '')
    .trim();
}

const ALL_METROS: Record<string, { label: string; searchTerms: string[] }> = {
  nyc: { label: 'New York', searchTerms: ['New York', 'Brooklyn', 'Queens', 'Manhattan', 'Bronx'] },
  chicago: { label: 'Chicago', searchTerms: ['Chicago', 'Chicago IL'] },
  la: { label: 'Los Angeles', searchTerms: ['Los Angeles', 'LA California', 'West Hollywood'] },
  sf: { label: 'San Francisco', searchTerms: ['San Francisco', 'Oakland California'] },
  boston: { label: 'Boston', searchTerms: ['Boston', 'Cambridge MA', 'Somerville MA'] },
  miami: { label: 'Miami', searchTerms: ['Miami', 'Miami Beach', 'Coral Gables'] },
  dc: { label: 'Washington DC', searchTerms: ['Washington DC', 'Arlington VA', 'Bethesda MD'] },
  austin: { label: 'Austin TX', searchTerms: ['Austin Texas', 'Austin TX'] },
  houston: { label: 'Houston', searchTerms: ['Houston Texas', 'Houston TX'] },
  atlanta: { label: 'Atlanta', searchTerms: ['Atlanta Georgia', 'Atlanta GA', 'Decatur GA'] },
  seattle: { label: 'Seattle', searchTerms: ['Seattle', 'Bellevue WA'] },
  denver: { label: 'Denver', searchTerms: ['Denver Colorado', 'Boulder CO'] },
  philly: { label: 'Philadelphia', searchTerms: ['Philadelphia', 'Philly PA'] },
  nashville: { label: 'Nashville', searchTerms: ['Nashville Tennessee', 'Nashville TN'] },
  nola: { label: 'New Orleans', searchTerms: ['New Orleans', 'New Orleans LA'] },
  dallas: { label: 'Dallas', searchTerms: ['Dallas Texas', 'Dallas TX', 'Fort Worth TX'] },
  phoenix: { label: 'Phoenix', searchTerms: ['Phoenix Arizona', 'Scottsdale AZ', 'Tempe AZ'] },
  portland: { label: 'Portland', searchTerms: ['Portland Oregon', 'Portland OR'] },
  detroit: { label: 'Detroit', searchTerms: ['Detroit Michigan', 'Detroit MI', 'Royal Oak MI'] },
  minneapolis: { label: 'Minneapolis', searchTerms: ['Minneapolis', 'St Paul MN'] },
  charlotte: { label: 'Charlotte', searchTerms: ['Charlotte NC', 'Charlotte North Carolina'] },
  tampa: { label: 'Tampa', searchTerms: ['Tampa Florida', 'Tampa FL', 'St Petersburg FL'] },
  sandiego: { label: 'San Diego', searchTerms: ['San Diego', 'San Diego CA'] },
  stlouis: { label: 'St Louis', searchTerms: ['St Louis Missouri', 'St Louis MO'] },
  pittsburgh: { label: 'Pittsburgh', searchTerms: ['Pittsburgh', 'Pittsburgh PA'] },
  columbus: { label: 'Columbus', searchTerms: ['Columbus Ohio', 'Columbus OH'] },
  indianapolis: { label: 'Indianapolis', searchTerms: ['Indianapolis', 'Indianapolis IN'] },
  milwaukee: { label: 'Milwaukee', searchTerms: ['Milwaukee', 'Milwaukee WI'] },
  raleigh: { label: 'Raleigh', searchTerms: ['Raleigh NC', 'Durham NC'] },
  baltimore: { label: 'Baltimore', searchTerms: ['Baltimore', 'Baltimore MD'] },
};

async function searchBrave(query: string): Promise<Array<{ title: string; url: string }>> {
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': process.env.BRAVE_API_KEY || '' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.web?.results || []).map((r: any) => ({ title: r.title, url: r.url }));
  } catch { return []; }
}

(async () => {
  const targetMetro = process.argv[2];
  const metros = targetMetro ? { [targetMetro]: ALL_METROS[targetMetro] } : ALL_METROS;
  let totalNew = 0;

  for (const [metro, config] of Object.entries(metros)) {
    if (!config) continue;
    const file = `scripts/${metro}-places.json`;
    const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
    const seen = new Set(existing.map(r => r.slug));
    const newOnes: Restaurant[] = [];

    // Generate Toast-specific search queries
    const queries: string[] = [];
    for (const term of config.searchTerms) {
      queries.push(`site:order.toasttab.com ${term} restaurant`);
      queries.push(`site:order.toasttab.com ${term} food`);
      queries.push(`site:order.toasttab.com ${term} pizza`);
      queries.push(`site:order.toasttab.com ${term} cafe`);
      // Also ChowNow
      queries.push(`site:ordering.chownow.com ${term} restaurant`);
      queries.push(`site:ordering.chownow.com ${term} food`);
    }

    console.log(`\n🍞 ${metro.toUpperCase()} — ${queries.length} queries...`);

    for (const query of queries) {
      const results = await searchBrave(query);
      for (const r of results) {
        // Only keep actual ordering URLs
        const isToast = r.url.includes('order.toasttab.com/online/');
        const isChowNow = r.url.includes('ordering.chownow.com/order/');
        if (!isToast && !isChowNow) continue;
        // Skip item-level pages
        if (r.url.includes('/item-')) continue;

        const name = cleanName(r.title);
        if (name.length < 3 || name.length > 60) continue;
        const slug = slugify(name);
        if (seen.has(slug)) continue;
        seen.add(slug);

        const restaurant: Restaurant = {
          name, slug, category: categoryFromName(name), metros: [metro],
        };
        if (isToast) restaurant.toastUrl = r.url.split('?')[0];
        else (restaurant as any).websiteOrderUrl = r.url.split('?')[0];

        newOnes.push(restaurant);
      }
      await new Promise(r => setTimeout(r, 350));
    }

    if (newOnes.length > 0) {
      writeFileSync(file, JSON.stringify([...existing, ...newOnes], null, 2));
    }
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} with direct ordering (${existing.length + newOnes.length} total)`);
  }

  console.log(`\n🎉 Total new with ordering: ${totalNew}`);
})();
