#!/usr/bin/env npx tsx
/**
 * Round 3: Aggressive discovery by cuisine type + neighborhoods.
 * Searches for restaurants on ordering platforms across all metros.
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
  website?: string;
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
  return 'restaurant';
}

const METROS: Record<string, string> = {
  nyc: 'New York City', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans',
};

const CUISINES = [
  'pizza', 'sushi', 'thai', 'mexican', 'indian', 'chinese', 'ramen',
  'burger', 'bbq', 'seafood', 'italian', 'wings', 'poke', 'mediterranean',
  'korean', 'vietnamese', 'breakfast', 'brunch', 'sandwich', 'salad',
];

const NEIGHBORHOODS: Record<string, string[]> = {
  nyc: ['Midtown', 'SoHo', 'Tribeca', 'Chelsea', 'Greenwich Village', 'Murray Hill', 'Flatiron',
        'Bushwick', 'Park Slope', 'Fort Greene', 'Prospect Heights', 'Jackson Heights', 'Long Island City'],
  chicago: ['Wicker Park', 'Bucktown', 'Lincoln Park', 'Chinatown', 'Hyde Park', 'Andersonville'],
  la: ['Silver Lake', 'Highland Park', 'West Hollywood', 'Santa Monica', 'Koreatown', 'Sawtelle'],
  sf: ['Mission District', 'Sunset', 'Richmond', 'SOMA', 'Marina'],
  boston: ['Cambridge', 'Back Bay', 'North End', 'Jamaica Plain', 'Brookline'],
  miami: ['Wynwood', 'Brickell', 'Coconut Grove', 'Kendall', 'North Miami Beach'],
  dc: ['Georgetown', 'Dupont Circle', 'Adams Morgan', 'Capitol Hill', 'U Street'],
  austin: ['East Austin', 'South Lamar', 'Rainey Street', 'North Loop', 'Mueller'],
  houston: ['Montrose', 'Midtown Houston', 'Rice Village', 'Washington Avenue'],
  atlanta: ['Midtown Atlanta', 'Ponce City', 'Buckhead', 'East Atlanta', 'Old Fourth Ward'],
  seattle: ['Capitol Hill Seattle', 'Wallingford', 'Georgetown Seattle', 'Columbia City'],
  denver: ['RiNo Denver', 'Capitol Hill Denver', 'Wash Park', 'LoDo'],
  philly: ['Fishtown', 'Old City', 'Rittenhouse', 'Passyunk'],
  nashville: ['12 South', 'Hillsboro Village', 'Marathon Village', 'Five Points Nashville'],
  nola: ['Marigny', 'Uptown New Orleans', 'Mid-City New Orleans', 'Treme'],
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
  return null;
}

function cleanName(title: string): string {
  return title
    .replace(/\| Order Online.*$/i, '').replace(/- Online Order.*$/i, '')
    .replace(/\| Toast.*$/i, '').replace(/\| ChowNow.*$/i, '')
    .replace(/Order from /i, '').replace(/ - Delivery.*$/i, '')
    .replace(/ \| Menu.*$/i, '').replace(/ Online Ordering$/i, '')
    .replace(/ \| [\w\s]+, [A-Z]{2}$/i, '')
    .trim();
}

(async () => {
  const targetMetro = process.argv[2];
  const metros = targetMetro ? { [targetMetro]: METROS[targetMetro] } : METROS;
  let totalNew = 0;

  for (const [metro, label] of Object.entries(metros)) {
    if (!label) continue;
    const file = `scripts/${metro}-places.json`;
    const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
    const seen = new Set(existing.map(r => r.slug));
    const newOnes: Restaurant[] = [];

    // Generate queries: cuisines × metro + neighborhoods × "restaurants"
    const queries: string[] = [];
    
    // Cuisine queries with ordering platform hints
    for (const cuisine of CUISINES.slice(0, 10)) { // Top 10 cuisines
      queries.push(`best ${cuisine} ${label} order online toasttab OR chownow`);
    }
    
    // Neighborhood queries
    const hoods = NEIGHBORHOODS[metro] || [];
    for (const hood of hoods.slice(0, 6)) { // Top 6 neighborhoods
      queries.push(`restaurants ${hood} order online direct`);
      queries.push(`best food ${hood} toasttab OR chownow OR popmenu`);
    }

    console.log(`\n🔍 ${metro.toUpperCase()} — ${queries.length} queries...`);

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

        const restaurant: Restaurant = {
          name, slug, category: categoryFromName(name), metros: [metro],
          [direct.type]: direct.cleanUrl,
        } as Restaurant;
        newOnes.push(restaurant);
      }
      await new Promise(r => setTimeout(r, 400)); // Rate limit
    }

    if (newOnes.length > 0) {
      writeFileSync(file, JSON.stringify([...existing, ...newOnes], null, 2));
    }
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} new (${existing.length + newOnes.length} total)`);
  }

  console.log(`\n🎉 Grand total new: ${totalNew}`);
})();
