#!/usr/bin/env npx tsx
/**
 * Grow the restaurant database by discovering new restaurants via goplaces
 * and enriching them with direct ordering URLs.
 * 
 * Usage: npx tsx scripts/grow-database.ts [--metro austin] [--all]
 */
import { execSync } from 'child_process';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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

function categoryFromTypes(types: string[], name: string): string {
  const t = types.join(' ').toLowerCase();
  const n = name.toLowerCase();
  if (t.includes('pizza') || n.includes('pizza')) return 'pizza';
  if (t.includes('mexican') || n.includes('taco') || n.includes('mexican') || n.includes('burrito')) return 'mexican';
  if (t.includes('sushi') || t.includes('japanese') || n.includes('sushi') || n.includes('ramen')) return 'japanese';
  if (t.includes('chinese') || n.includes('chinese') || n.includes('dumpling') || n.includes('wok')) return 'chinese';
  if (t.includes('thai') || n.includes('thai')) return 'thai';
  if (t.includes('indian') || n.includes('indian') || n.includes('curry')) return 'indian';
  if (t.includes('korean') || n.includes('korean') || n.includes('bibimbap')) return 'korean';
  if (t.includes('vietnamese') || n.includes('pho') || n.includes('vietnamese') || n.includes('banh mi')) return 'vietnamese';
  if (t.includes('italian') || n.includes('italian') || n.includes('pasta') || n.includes('trattoria')) return 'italian';
  if (t.includes('mediterranean') || n.includes('mediterranean') || n.includes('falafel') || n.includes('shawarma')) return 'mediterranean';
  if (n.includes('burger') || n.includes('shake shack') || n.includes('five guys')) return 'burgers';
  if (n.includes('bbq') || n.includes('barbecue') || n.includes('smokehouse')) return 'bbq';
  if (n.includes('wing') || n.includes('wingstop')) return 'wings';
  if (n.includes('seafood') || n.includes('fish') || n.includes('crab') || n.includes('lobster')) return 'seafood';
  if (n.includes('chicken') || n.includes('popeyes') || n.includes('chick-fil')) return 'chicken';
  if (t.includes('breakfast') || n.includes('pancake') || n.includes('waffle') || n.includes('ihop')) return 'breakfast';
  if (t.includes('cafe') || t.includes('coffee') || n.includes('cafe') || n.includes('bakery')) return 'cafe';
  if (n.includes('deli') || n.includes('sandwich') || n.includes('sub')) return 'deli';
  if (n.includes('poke') || n.includes('poké')) return 'poke';
  if (n.includes('vegan') || n.includes('plant')) return 'vegan';
  if (n.includes('salad') || n.includes('healthy') || n.includes('bowl')) return 'healthy';
  if (t.includes('steak') || n.includes('steak')) return 'steakhouse';
  if (n.includes('southern') || n.includes('soul food')) return 'southern';
  if (n.includes('tea') || n.includes('boba')) return 'tea';
  if (n.includes('dessert') || n.includes('ice cream') || n.includes('frozen')) return 'dessert';
  return 'restaurant';
}

const ORDERING_PATTERNS = [
  { pattern: /https?:\/\/[\w-]+\.toast\.site[^\s"'<>]*/i, key: 'toastUrl' },
  { pattern: /https?:\/\/order\.toasttab\.com\/online\/[\w-]+/i, key: 'toastUrl' },
  { pattern: /https?:\/\/[\w-]+\.square\.site[^\s"'<>]*/i, key: 'squareUrl' },
  { pattern: /https?:\/\/[\w-]+\.chownow\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/ordering\.chownow\.com\/order\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/order\.popmenu\.com\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.menufy\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/order\.online\/store\/[\w-]+/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.olo\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.owner\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.getbento\.com\/(?!accounts|media)[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.gloria\.food[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.clover\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
  { pattern: /https?:\/\/[\w-]+\.spothopper\.com[^\s"'<>]*/i, key: 'websiteOrderUrl' },
];

const METRO_QUERIES: Record<string, string[]> = {
  austin: [
    'best restaurants South Lamar Austin', 'popular food trucks Austin TX',
    'best lunch spots Downtown Austin', 'popular restaurants East Austin',
    'best new restaurants Austin 2025', 'best brunch Austin Texas',
    'best Asian restaurants Austin', 'popular restaurants Round Rock Texas',
    'best restaurants South Congress Austin', 'best late night food Austin',
  ],
  nyc: [
    'best restaurants East Village NYC', 'popular restaurants Williamsburg Brooklyn',
    'best restaurants Upper West Side Manhattan', 'best Chinese food Flushing Queens',
    'best pizza Brooklyn NY', 'popular restaurants Astoria Queens',
    'best restaurants Hell\'s Kitchen Manhattan', 'best new restaurants NYC 2025',
    'popular restaurants Lower East Side NYC', 'best brunch spots NYC',
  ],
  chicago: [
    'best restaurants Wicker Park Chicago', 'popular restaurants Logan Square Chicago',
    'best deep dish pizza Chicago', 'best restaurants River North Chicago',
    'popular restaurants Lincoln Park Chicago', 'best new restaurants Chicago 2025',
    'best Mexican restaurants Pilsen Chicago', 'best brunch Chicago',
    'popular restaurants Hyde Park Chicago', 'best late night food Chicago',
  ],
  la: [
    'best restaurants Silver Lake Los Angeles', 'popular restaurants Koreatown LA',
    'best restaurants Venice Beach CA', 'best Thai restaurants LA',
    'popular restaurants Santa Monica CA', 'best new restaurants LA 2025',
    'best restaurants Highland Park LA', 'best brunch Los Angeles',
    'popular food trucks Los Angeles', 'best restaurants Culver City CA',
  ],
  sf: [
    'best restaurants Mission District SF', 'popular restaurants North Beach SF',
    'best restaurants Castro San Francisco', 'best dim sum San Francisco',
    'popular restaurants Hayes Valley SF', 'best new restaurants SF 2025',
    'best burritos San Francisco', 'best brunch SF',
  ],
  dc: [
    'best restaurants Adams Morgan DC', 'popular restaurants Capitol Hill DC',
    'best restaurants U Street Washington DC', 'best restaurants Georgetown DC',
    'popular restaurants Shaw DC', 'best new restaurants DC 2025',
    'best Ethiopian restaurants DC', 'best brunch Washington DC',
  ],
  miami: [
    'best restaurants Wynwood Miami', 'popular restaurants Little Havana Miami',
    'best Cuban food Miami', 'best restaurants Brickell Miami',
    'popular restaurants Coral Gables FL', 'best new restaurants Miami 2025',
    'best seafood Miami Beach', 'best brunch Miami',
  ],
  houston: [
    'best restaurants Montrose Houston', 'popular restaurants Heights Houston',
    'best Tex-Mex Houston', 'best restaurants Midtown Houston',
    'popular restaurants Rice Village Houston', 'best Vietnamese food Houston',
    'best BBQ Houston', 'best brunch Houston',
  ],
  atlanta: [
    'best restaurants Midtown Atlanta', 'popular restaurants Decatur GA',
    'best restaurants Buckhead Atlanta', 'best soul food Atlanta',
    'popular restaurants East Atlanta Village', 'best new restaurants Atlanta 2025',
    'best brunch Atlanta', 'best restaurants Inman Park Atlanta',
  ],
  seattle: [
    'best restaurants Capitol Hill Seattle', 'popular restaurants Fremont Seattle',
    'best restaurants Ballard Seattle', 'best pho Seattle',
    'popular restaurants University District Seattle', 'best new restaurants Seattle 2025',
    'best seafood Seattle', 'best brunch Seattle',
  ],
  denver: [
    'best restaurants RiNo Denver', 'popular restaurants LoDo Denver',
    'best restaurants Cherry Creek Denver', 'best green chile Denver',
    'popular restaurants Highland Denver', 'best new restaurants Denver 2025',
    'best brunch Denver', 'best Mexican restaurants Denver',
  ],
  nashville: [
    'best restaurants East Nashville', 'popular restaurants The Gulch Nashville',
    'best hot chicken Nashville', 'best restaurants 12South Nashville',
    'popular restaurants Germantown Nashville', 'best new restaurants Nashville 2025',
    'best brunch Nashville', 'best BBQ Nashville',
  ],
  dallas: [
    'best restaurants Deep Ellum Dallas', 'popular restaurants Bishop Arts Dallas',
    'best restaurants Uptown Dallas', 'best BBQ Dallas Texas',
    'popular restaurants Knox Henderson Dallas', 'best new restaurants Dallas 2025',
    'best Tex-Mex Dallas', 'best brunch Dallas',
  ],
  portland: [
    'best restaurants Alberta Arts Portland', 'popular food carts Portland Oregon',
    'best restaurants Pearl District Portland', 'best ramen Portland',
    'popular restaurants Hawthorne Portland', 'best new restaurants Portland 2025',
    'best brunch Portland', 'best restaurants Division Street Portland',
  ],
  boston: [
    'best restaurants North End Boston', 'popular restaurants Cambridge MA',
    'best restaurants South End Boston', 'best seafood Boston',
    'popular restaurants Somerville MA', 'best new restaurants Boston 2025',
    'best brunch Boston', 'best Italian restaurants North End Boston',
  ],
  philly: [
    'best restaurants Fishtown Philadelphia', 'popular restaurants Rittenhouse Square Philly',
    'best restaurants Northern Liberties Philly', 'best cheesesteaks Philadelphia',
    'popular restaurants Old City Philadelphia', 'best new restaurants Philly 2025',
    'best brunch Philadelphia', 'best restaurants East Passyunk Philadelphia',
  ],
  nola: [
    'best restaurants French Quarter New Orleans', 'popular restaurants Magazine Street NOLA',
    'best restaurants Bywater New Orleans', 'best Cajun food New Orleans',
    'popular restaurants Uptown New Orleans', 'best new restaurants NOLA 2025',
    'best brunch New Orleans', 'best seafood New Orleans',
  ],
  phoenix: [
    'best restaurants Scottsdale AZ', 'popular restaurants Downtown Phoenix',
    'best restaurants Arcadia Phoenix', 'best Mexican food Phoenix',
    'popular restaurants Tempe AZ', 'best new restaurants Phoenix 2025',
    'best brunch Phoenix', 'best restaurants Gilbert AZ',
  ],
};

async function getExistingSlugs(metro: string): Promise<Set<string>> {
  const { rows } = await pool.query(
    'SELECT slug FROM restaurants WHERE $1 = ANY(metros)',
    [metro]
  );
  return new Set(rows.map((r: any) => r.slug));
}

function searchPlaces(query: string): any[] {
  try {
    const raw = execSync(`goplaces search "${query}" --limit 20 --json 2>/dev/null`, {
      timeout: 30000,
      encoding: 'utf-8',
    });
    const data = JSON.parse(raw);
    return data.places || [];
  } catch {
    return [];
  }
}

function checkWebsiteForOrdering(website: string): Partial<Restaurant> {
  const result: Partial<Restaurant> = {};
  if (!website) return result;
  
  try {
    const html = execSync(
      `curl -sL -m 8 --max-filesize 500000 "${website}" 2>/dev/null`,
      { timeout: 12000, encoding: 'utf-8', maxBuffer: 1024 * 1024 }
    );
    
    for (const { pattern, key } of ORDERING_PATTERNS) {
      const match = html.match(pattern);
      if (match) {
        (result as any)[key] = match[0];
        break;
      }
    }

    // Also check for order/ordering links
    if (!result.toastUrl && !result.squareUrl && !result.websiteOrderUrl) {
      const orderLink = html.match(/href=["'](https?:\/\/[^"']*(?:order|ordering)[^"']*)["']/i);
      if (orderLink) {
        const url = orderLink[1];
        for (const { pattern, key } of ORDERING_PATTERNS) {
          if (pattern.test(url)) {
            (result as any)[key] = url;
            break;
          }
        }
      }
    }
  } catch {}
  
  return result;
}

async function insertRestaurant(r: Restaurant): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO restaurants (name, slug, category, metros, toast_url, square_url, website_order_url, is_chain)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false)
       ON CONFLICT (slug) DO UPDATE SET
         metros = array(SELECT DISTINCT unnest(restaurants.metros || EXCLUDED.metros)),
         toast_url = COALESCE(EXCLUDED.toast_url, restaurants.toast_url),
         square_url = COALESCE(EXCLUDED.square_url, restaurants.square_url),
         website_order_url = COALESCE(EXCLUDED.website_order_url, restaurants.website_order_url),
         category = CASE WHEN restaurants.category = 'restaurant' THEN EXCLUDED.category ELSE restaurants.category END`,
      [r.name, r.slug, r.category, r.metros, r.toastUrl || null, r.squareUrl || null, r.websiteOrderUrl || null]
    );
    return true;
  } catch (e: any) {
    if (!e.message?.includes('duplicate')) console.error(`  Insert error: ${e.message}`);
    return false;
  }
}

async function growMetro(metro: string) {
  const queries = METRO_QUERIES[metro];
  if (!queries) {
    console.log(`No queries defined for ${metro}`);
    return;
  }

  const existing = await getExistingSlugs(metro);
  console.log(`\n📍 ${metro.toUpperCase()} — ${existing.size} existing restaurants`);
  
  let discovered = 0;
  let enriched = 0;
  let inserted = 0;

  for (const query of queries) {
    console.log(`  🔍 "${query}"`);
    const places = searchPlaces(query);
    
    for (const place of places) {
      const name = place.name?.trim();
      if (!name) continue;
      
      const slug = slugify(name);
      if (existing.has(slug)) continue;
      
      discovered++;
      existing.add(slug); // prevent dupes within this run
      
      const types = place.types || [];
      const category = categoryFromTypes(types, name);
      const website = place.website || '';
      
      // Check for direct ordering
      const ordering = website ? checkWebsiteForOrdering(website) : {};
      if (ordering.toastUrl || ordering.squareUrl || ordering.websiteOrderUrl) enriched++;
      
      const restaurant: Restaurant = {
        name,
        slug,
        category,
        metros: [metro],
        toastUrl: ordering.toastUrl,
        squareUrl: ordering.squareUrl,
        websiteOrderUrl: ordering.websiteOrderUrl,
        website,
      };
      
      if (await insertRestaurant(restaurant)) {
        inserted++;
        const directIcon = (ordering.toastUrl || ordering.squareUrl || ordering.websiteOrderUrl) ? '🏪' : '  ';
        console.log(`    ${directIcon} +${name} [${category}]`);
      }
    }
    
    // Rate limit between queries
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`  ✅ ${metro}: +${inserted} new (${enriched} with direct ordering)`);
}

async function main() {
  const args = process.argv.slice(2);
  const metroArg = args.find(a => a.startsWith('--metro='))?.split('=')[1];
  const doAll = args.includes('--all');
  
  if (metroArg) {
    await growMetro(metroArg);
  } else if (doAll) {
    for (const metro of Object.keys(METRO_QUERIES)) {
      await growMetro(metro);
    }
  } else {
    console.log('Usage: npx tsx scripts/grow-database.ts --metro=austin | --all');
    console.log(`Available metros: ${Object.keys(METRO_QUERIES).join(', ')}`);
  }
  
  // Final stats
  const { rows } = await pool.query('SELECT COUNT(*) as total, COUNT(CASE WHEN toast_url IS NOT NULL OR square_url IS NOT NULL OR website_order_url IS NOT NULL THEN 1 END) as direct FROM restaurants');
  console.log(`\n📊 Database totals: ${rows[0].total} restaurants, ${rows[0].direct} with direct ordering`);
  
  await pool.end();
}

main().catch(console.error);
