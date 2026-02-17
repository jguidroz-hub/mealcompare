#!/usr/bin/env npx tsx
/**
 * Discover restaurants that ALREADY have direct ordering URLs.
 * Instead of finding restaurants then checking for ordering links,
 * we search for Toast/ChowNow/Olo/Popmenu pages directly.
 * Every hit is a restaurant with a confirmed direct ordering URL.
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
  if (n.includes('seafood') || n.includes('fish')) return 'seafood';
  if (n.includes('chinese') || n.includes('dumpling')) return 'chinese';
  if (n.includes('korean')) return 'korean';
  if (n.includes('vietnamese') || n.includes('pho')) return 'vietnamese';
  if (n.includes('italian') || n.includes('pasta')) return 'italian';
  return 'restaurant';
}

const METRO_LABELS: Record<string, string> = {
  nyc: 'New York City', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans',
  dallas: 'Dallas', phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit',
  minneapolis: 'Minneapolis', charlotte: 'Charlotte', tampa: 'Tampa',
  sandiego: 'San Diego', stlouis: 'St Louis', pittsburgh: 'Pittsburgh',
};

// Search queries that find restaurants WITH ordering pages
const TOAST_QUERIES = [
  'site:order.toasttab.com restaurant',
  'site:order.toasttab.com pizza',
  'site:order.toasttab.com cafe',
  'site:order.toasttab.com bbq',
];

const CHOWNOW_QUERIES = [
  'site:ordering.chownow.com restaurant',
  'site:ordering.chownow.com order',
];

const DIRECT_QUERIES_BY_METRO = (metro: string, label: string) => [
  `"order online" restaurant ${label} site:toasttab.com`,
  `"order online" restaurant ${label} site:chownow.com`,
  `"order online" restaurant ${label} site:popmenu.com`,
  `restaurant ${label} "order directly"`,
  `restaurant ${label} "skip the delivery fees"`,
  `restaurant ${label} "order from our website"`,
  `best restaurants ${label} toast online ordering`,
  `popular restaurants ${label} direct ordering`,
];

async function searchWeb(query: string): Promise<Array<{ title: string; url: string; description: string }>> {
  try {
    // Use web_fetch to hit Brave Search (via the API available on this machine)
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodedQuery}&count=20`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_API_KEY || '',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.web?.results || []).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      description: r.description || '',
    }));
  } catch {
    return [];
  }
}

function extractToastUrl(url: string): string | null {
  if (url.match(/order\.toasttab\.com\/online\//)) return url.split('?')[0];
  if (url.match(/[\w-]+\.toast\.site/)) return url.split('?')[0];
  return null;
}

function extractChowNowUrl(url: string): string | null {
  if (url.match(/ordering\.chownow\.com\/order\//)) return url.split('?')[0];
  return null;
}

function extractOrderUrl(url: string): string | null {
  if (url.match(/order\.online\/store\//)) return url.split('?')[0];
  if (url.match(/[\w-]+\.popmenu\.com/)) return url.split('?')[0];
  if (url.match(/[\w-]+\.olo\.com/)) return url.split('?')[0];
  if (url.match(/[\w-]+\.owner\.com/)) return url.split('?')[0];
  if (url.match(/[\w-]+\.menufy\.com/)) return url.split('?')[0];
  return null;
}

function nameFromUrl(url: string, title: string): string {
  // Try to extract clean restaurant name from page title
  const cleaned = title
    .replace(/\| Order Online.*$/i, '')
    .replace(/- Online Ordering.*$/i, '')
    .replace(/\| Toast.*$/i, '')
    .replace(/\| ChowNow.*$/i, '')
    .replace(/Order from /i, '')
    .replace(/ - Delivery.*$/i, '')
    .replace(/ \| Menu.*$/i, '')
    .replace(/ Online Ordering$/i, '')
    .trim();
  if (cleaned.length > 3 && cleaned.length < 60) return cleaned;

  // Fallback: extract from URL path
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  } catch {}
  return title.slice(0, 50);
}

function guessMetro(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();
  for (const [metro, label] of Object.entries(METRO_LABELS)) {
    if (text.includes(label.toLowerCase())) return metro;
  }
  return null;
}

async function discoverForMetro(metro: string): Promise<Restaurant[]> {
  const label = METRO_LABELS[metro];
  if (!label) return [];

  const queries = DIRECT_QUERIES_BY_METRO(metro, label);
  const file = `scripts/${metro}-places.json`;
  const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
  const seen = new Set(existing.map(r => r.slug));
  const newRestaurants: Restaurant[] = [];

  for (const query of queries) {
    const results = await searchWeb(query);
    
    for (const r of results) {
      const toastUrl = extractToastUrl(r.url);
      const chownowUrl = extractChowNowUrl(r.url);
      const orderUrl = extractOrderUrl(r.url);
      const directUrl = toastUrl || chownowUrl || orderUrl;
      
      if (!directUrl) continue; // Skip results without ordering URLs
      
      const name = nameFromUrl(r.url, r.title);
      const slug = slugify(name);
      if (seen.has(slug)) continue;
      seen.add(slug);

      const restaurant: Restaurant = {
        name,
        slug,
        category: categoryFromName(name),
        metros: [metro],
      };

      if (toastUrl) restaurant.toastUrl = toastUrl;
      else if (chownowUrl) restaurant.websiteOrderUrl = chownowUrl;
      else if (orderUrl) restaurant.websiteOrderUrl = orderUrl;

      newRestaurants.push(restaurant);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save
  if (newRestaurants.length > 0) {
    const all = [...existing, ...newRestaurants];
    writeFileSync(file, JSON.stringify(all, null, 2));
  }

  return newRestaurants;
}

// CLI
(async () => {
  const target = process.argv[2];
  const metros = target ? [target] : Object.keys(METRO_LABELS).slice(0, 15); // First 15 metros
  let totalNew = 0;

  for (const metro of metros) {
    console.log(`\n🔗 Discovering direct-ordering restaurants in ${metro.toUpperCase()}...`);
    const newOnes = await discoverForMetro(metro);
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} restaurants with direct ordering URLs`);
  }

  console.log(`\n🎉 Total new restaurants with direct ordering: ${totalNew}`);
})();
