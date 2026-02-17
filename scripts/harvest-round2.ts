#!/usr/bin/env npx tsx
/**
 * Round 2 Toast/ChowNow harvest — different query patterns to find more.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Restaurant {
  name: string; slug: string; category: string; metros: string[];
  toastUrl?: string; websiteOrderUrl?: string;
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
  if (n.includes('chinese') || n.includes('dumpling')) return 'chinese';
  if (n.includes('korean')) return 'korean';
  if (n.includes('pho') || n.includes('vietnamese')) return 'vietnamese';
  return 'restaurant';
}

function cleanName(title: string): string {
  return title.replace(/\| Order Online.*$/i, '').replace(/- Online Order.*$/i, '')
    .replace(/\| Toast.*$/i, '').replace(/ \| Menu.*$/i, '').replace(/ Online Ordering$/i, '')
    .replace(/ - Toast$/i, '').replace(/ \| [\w\s,]+$/i, '').trim();
}

const METROS: Record<string, string[]> = {
  nyc: ['Manhattan restaurant', 'Brooklyn food', 'Queens restaurant', 'Harlem food', 'SoHo restaurant', 'East Village food', 'Upper West Side', 'Astoria food', 'Bushwick restaurant'],
  chicago: ['Wicker Park food', 'Lincoln Park restaurant', 'River North food', 'West Loop restaurant', 'Logan Square food', 'Lakeview restaurant'],
  la: ['Hollywood restaurant', 'Santa Monica food', 'West Hollywood restaurant', 'Koreatown food', 'Silver Lake restaurant', 'Venice Beach food'],
  sf: ['Mission District food', 'North Beach restaurant', 'Marina food', 'SOMA restaurant', 'Hayes Valley food'],
  boston: ['Back Bay food', 'Cambridge restaurant', 'North End food', 'Somerville restaurant', 'Brookline food'],
  miami: ['Wynwood food', 'Brickell restaurant', 'South Beach food', 'Coral Gables restaurant', 'Little Havana food'],
  dc: ['Georgetown food', 'Dupont Circle restaurant', 'Adams Morgan food', 'Capitol Hill restaurant', 'U Street food'],
  austin: ['East Austin food', 'South Lamar restaurant', 'downtown Austin food', 'North Austin restaurant'],
  houston: ['Montrose food', 'Heights restaurant', 'Midtown Houston food', 'Rice Village restaurant'],
  atlanta: ['Midtown Atlanta food', 'Buckhead restaurant', 'Decatur food', 'East Atlanta restaurant', 'Old Fourth Ward food'],
  seattle: ['Capitol Hill Seattle food', 'Ballard restaurant', 'Fremont food', 'Wallingford restaurant'],
  denver: ['RiNo food', 'Capitol Hill Denver restaurant', 'LoDo food', 'Highlands Denver restaurant'],
  philly: ['Fishtown food', 'Old City restaurant', 'Rittenhouse food', 'South Philly restaurant'],
  nashville: ['East Nashville food', 'Germantown restaurant', '12 South food', 'The Gulch restaurant'],
  nola: ['French Quarter food', 'Bywater restaurant', 'Magazine Street food', 'Uptown New Orleans restaurant'],
  dallas: ['Deep Ellum food', 'Uptown Dallas restaurant', 'Bishop Arts food', 'Knox Henderson restaurant', 'Lower Greenville food'],
  phoenix: ['Old Town Scottsdale food', 'downtown Phoenix restaurant', 'Tempe food', 'Arcadia restaurant'],
  portland: ['Pearl District food', 'Alberta Street restaurant', 'Hawthorne food', 'Division Street restaurant', 'NW Portland food'],
  detroit: ['Corktown food', 'Midtown Detroit restaurant', 'Ferndale food', 'Royal Oak restaurant'],
  minneapolis: ['Northeast Minneapolis food', 'Uptown Minneapolis restaurant', 'North Loop food', 'St Paul restaurant'],
  charlotte: ['NoDa food', 'South End Charlotte restaurant', 'Plaza Midwood food', 'Dilworth restaurant'],
  tampa: ['Ybor City food', 'Hyde Park Tampa restaurant', 'Seminole Heights food', 'St Petersburg restaurant'],
  sandiego: ['North Park food', 'Hillcrest restaurant', 'Gaslamp food', 'La Jolla restaurant', 'Pacific Beach food'],
  stlouis: ['Central West End food', 'The Loop STL restaurant', 'Soulard food', 'Tower Grove restaurant'],
  pittsburgh: ['Lawrenceville food', 'Strip District restaurant', 'South Side food', 'Shadyside restaurant'],
  columbus: ['Short North food', 'German Village restaurant', 'Grandview food', 'Clintonville restaurant'],
  indianapolis: ['Broad Ripple food', 'Mass Ave restaurant', 'Fountain Square food', 'downtown Indy restaurant'],
  milwaukee: ['Third Ward food', 'Bay View restaurant', 'East Side Milwaukee food', 'Walker Point restaurant'],
  raleigh: ['downtown Raleigh food', 'Durham restaurant', 'Chapel Hill food', 'Cary restaurant'],
  baltimore: ['Fells Point food', 'Federal Hill restaurant', 'Canton food', 'Hampden restaurant', 'Mount Vernon Baltimore food'],
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
  let totalNew = 0;
  for (const [metro, terms] of Object.entries(METROS)) {
    const file = `scripts/${metro}-places.json`;
    const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
    const seen = new Set(existing.map(r => r.slug));
    const newOnes: Restaurant[] = [];
    
    const queries: string[] = [];
    for (const term of terms) {
      queries.push(`site:order.toasttab.com ${term}`);
      queries.push(`site:ordering.chownow.com ${term}`);
    }
    
    process.stdout.write(`🍞 ${metro.toUpperCase()} (${queries.length}q)...`);
    
    for (const query of queries) {
      const results = await searchBrave(query);
      for (const r of results) {
        const isToast = r.url.includes('order.toasttab.com/online/');
        const isChowNow = r.url.includes('ordering.chownow.com/order/');
        if (!isToast && !isChowNow) continue;
        if (r.url.includes('/item-')) continue;
        const name = cleanName(r.title);
        if (name.length < 3 || name.length > 60) continue;
        const slug = slugify(name);
        if (seen.has(slug)) continue;
        seen.add(slug);
        const restaurant: Restaurant = { name, slug, category: categoryFromName(name), metros: [metro] };
        if (isToast) restaurant.toastUrl = r.url.split('?')[0];
        else restaurant.websiteOrderUrl = r.url.split('?')[0];
        newOnes.push(restaurant);
      }
      await new Promise(r => setTimeout(r, 300));
    }
    
    if (newOnes.length > 0) writeFileSync(file, JSON.stringify([...existing, ...newOnes], null, 2));
    totalNew += newOnes.length;
    console.log(` +${newOnes.length}`);
  }
  console.log(`\n🎉 Total new: ${totalNew}`);
})();
