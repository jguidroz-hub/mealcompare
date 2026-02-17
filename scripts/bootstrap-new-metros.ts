#!/usr/bin/env npx tsx
/**
 * Bootstrap new metros: discover restaurants via goplaces, then immediately
 * check for direct ordering URLs via website scraping.
 */
import { execSync } from 'child_process';
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
  placeId?: string;
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

const ORDERING_PATTERNS = [
  { pattern: /https?:\/\/order\.toasttab\.com\/online\/[\w-]+/i, key: 'toastUrl' },
  { pattern: /https?:\/\/[\w-]+\.toast\.site[^\s"'<>]*/i, key: 'toastUrl' },
  { pattern: /https?:\/\/[\w-]+\.square\.site[^\s"'<>]*/i, key: 'squareUrl' },
  { pattern: /https?:\/\/ordering\.chownow\.com\/order\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/order\.online\/store\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.popmenu\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.olo\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.owner\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.menufy\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.gloria\.food[^\s"'<>]*/i, key: 'websiteOrderUrl' },
];

const NEW_METROS: Record<string, { label: string; queries: string[] }> = {
  dallas: { label: 'Dallas', queries: [
    'best restaurants Dallas Texas', 'popular restaurants Deep Ellum Dallas',
    'best restaurants Uptown Dallas', 'popular restaurants Bishop Arts Dallas',
    'best BBQ Dallas', 'best Tex-Mex Dallas', 'best pizza Dallas Texas',
    'popular restaurants Frisco Texas', 'best brunch Dallas',
  ]},
  phoenix: { label: 'Phoenix', queries: [
    'best restaurants Phoenix Arizona', 'popular restaurants Scottsdale Arizona',
    'best restaurants Tempe Arizona', 'best Mexican food Phoenix',
    'popular restaurants Old Town Scottsdale', 'best restaurants Mesa Arizona',
    'best pizza Phoenix', 'best brunch Phoenix Arizona',
  ]},
  portland: { label: 'Portland', queries: [
    'best restaurants Portland Oregon', 'popular restaurants Pearl District Portland',
    'best restaurants Alberta Street Portland', 'best ramen Portland Oregon',
    'popular restaurants Hawthorne Portland', 'best brunch Portland',
    'best food trucks Portland Oregon', 'best pizza Portland Oregon',
  ]},
  detroit: { label: 'Detroit', queries: [
    'best restaurants Detroit Michigan', 'popular restaurants Corktown Detroit',
    'best restaurants Midtown Detroit', 'best restaurants Royal Oak Michigan',
    'popular restaurants Ferndale Michigan', 'best pizza Detroit',
  ]},
  minneapolis: { label: 'Minneapolis', queries: [
    'best restaurants Minneapolis Minnesota', 'popular restaurants Northeast Minneapolis',
    'best restaurants Uptown Minneapolis', 'best restaurants St Paul Minnesota',
    'best brunch Minneapolis', 'best Vietnamese Minneapolis',
  ]},
  charlotte: { label: 'Charlotte', queries: [
    'best restaurants Charlotte North Carolina', 'popular restaurants NoDa Charlotte',
    'best restaurants South End Charlotte', 'best BBQ Charlotte NC',
    'popular restaurants Plaza Midwood Charlotte', 'best brunch Charlotte',
  ]},
  tampa: { label: 'Tampa', queries: [
    'best restaurants Tampa Florida', 'popular restaurants Ybor City Tampa',
    'best restaurants St Petersburg Florida', 'best Cuban food Tampa',
    'popular restaurants Hyde Park Tampa', 'best seafood Tampa Bay',
  ]},
  sandiego: { label: 'San Diego', queries: [
    'best restaurants San Diego California', 'popular restaurants Gaslamp Quarter San Diego',
    'best restaurants North Park San Diego', 'best Mexican food San Diego',
    'popular restaurants Hillcrest San Diego', 'best seafood San Diego',
    'best restaurants La Jolla California', 'best brunch San Diego',
  ]},
  stlouis: { label: 'St Louis', queries: [
    'best restaurants St Louis Missouri', 'popular restaurants Central West End St Louis',
    'best restaurants The Loop St Louis', 'best BBQ St Louis',
    'popular restaurants Soulard St Louis', 'best brunch St Louis',
  ]},
  pittsburgh: { label: 'Pittsburgh', queries: [
    'best restaurants Pittsburgh Pennsylvania', 'popular restaurants Lawrenceville Pittsburgh',
    'best restaurants Strip District Pittsburgh', 'best pizza Pittsburgh',
    'popular restaurants South Side Pittsburgh', 'best brunch Pittsburgh',
  ]},
  columbus: { label: 'Columbus Ohio', queries: [
    'best restaurants Columbus Ohio', 'popular restaurants Short North Columbus',
    'best restaurants German Village Columbus', 'best brunch Columbus Ohio',
  ]},
  indianapolis: { label: 'Indianapolis', queries: [
    'best restaurants Indianapolis Indiana', 'popular restaurants Broad Ripple Indianapolis',
    'best restaurants Mass Ave Indianapolis', 'best brunch Indianapolis',
  ]},
  milwaukee: { label: 'Milwaukee', queries: [
    'best restaurants Milwaukee Wisconsin', 'popular restaurants Third Ward Milwaukee',
    'best restaurants Bay View Milwaukee', 'best brunch Milwaukee',
  ]},
  raleigh: { label: 'Raleigh', queries: [
    'best restaurants Raleigh North Carolina', 'popular restaurants Durham NC',
    'best restaurants Chapel Hill NC', 'best BBQ Raleigh NC',
  ]},
  baltimore: { label: 'Baltimore', queries: [
    'best restaurants Baltimore Maryland', 'popular restaurants Fells Point Baltimore',
    'best restaurants Federal Hill Baltimore', 'best seafood Baltimore',
    'best brunch Baltimore', 'popular restaurants Canton Baltimore',
  ]},
};

async function checkWebsiteForOrdering(url: string): Promise<Record<string, string>> {
  const found: Record<string, string> = {};
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return found;
    const html = await res.text();
    for (const { pattern, key } of ORDERING_PATTERNS) {
      const match = html.match(pattern);
      if (match && !found[key]) found[key] = match[0].replace(/["'<>].*$/, '');
    }
  } catch {}
  return found;
}

(async () => {
  const targetMetro = process.argv[2];
  const metros = targetMetro ? { [targetMetro]: NEW_METROS[targetMetro] } : NEW_METROS;
  let totalNew = 0;
  let totalDirect = 0;

  for (const [metro, config] of Object.entries(metros)) {
    if (!config) continue;
    const file = `scripts/${metro}-places.json`;
    const existing: Restaurant[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : [];
    const seen = new Set(existing.map(r => r.slug));
    const newOnes: Restaurant[] = [];

    console.log(`\n🏙️ ${metro.toUpperCase()} (${config.label}) — ${config.queries.length} search queries...`);

    for (const query of config.queries) {
      try {
        const output = execSync(`goplaces search "${query.replace(/"/g, '\\"')}" --json 2>/dev/null`, { encoding: 'utf-8', timeout: 15000 });
        const results = JSON.parse(output);
        for (const r of results) {
          const slug = slugify(r.name);
          if (seen.has(slug)) continue;
          seen.add(slug);
          
          const restaurant: Restaurant = {
            name: r.name, slug, category: categoryFromName(r.name), metros: [metro],
          };

          // Try to get website and check for ordering
          if (r.website) {
            restaurant.website = r.website;
            const orderUrls = await checkWebsiteForOrdering(r.website);
            if (orderUrls.toastUrl) { restaurant.toastUrl = orderUrls.toastUrl; totalDirect++; }
            if (orderUrls.squareUrl) { restaurant.squareUrl = orderUrls.squareUrl; totalDirect++; }
            if (orderUrls.websiteOrderUrl) { restaurant.websiteOrderUrl = orderUrls.websiteOrderUrl; totalDirect++; }
          }

          newOnes.push(restaurant);
        }
        await new Promise(r => setTimeout(r, 200));
      } catch {}
    }

    if (newOnes.length > 0) {
      writeFileSync(file, JSON.stringify([...existing, ...newOnes], null, 2));
    }
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} restaurants (${newOnes.filter(r => r.toastUrl || r.squareUrl || r.websiteOrderUrl).length} with direct ordering)`);
  }

  console.log(`\n🎉 Total: +${totalNew} restaurants, ${totalDirect} direct ordering URLs`);
})();
