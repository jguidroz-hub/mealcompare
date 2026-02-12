#!/usr/bin/env npx tsx
/**
 * Expand restaurant coverage — more neighborhoods + cuisines per city.
 * Also discovers Square Online sites.
 */
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40);
}

function categoryFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('pizza')) return 'pizza';
  if (n.includes('sushi') || n.includes('ramen')) return 'japanese';
  if (n.includes('thai')) return 'thai';
  if (n.includes('chinese') || n.includes('dim sum') || n.includes('dumpling')) return 'chinese';
  if (n.includes('taco') || n.includes('burrito') || n.includes('mexican')) return 'mexican';
  if (n.includes('indian') || n.includes('curry') || n.includes('tandoori')) return 'indian';
  if (n.includes('korean') || n.includes('bibimbap')) return 'korean';
  if (n.includes('burger')) return 'burgers';
  if (n.includes('seafood') || n.includes('fish') || n.includes('oyster') || n.includes('lobster')) return 'seafood';
  if (n.includes('italian') || n.includes('pasta') || n.includes('trattoria')) return 'italian';
  if (n.includes('french') || n.includes('bistro') || n.includes('brasserie')) return 'french';
  if (n.includes('deli') || n.includes('sandwich') || n.includes('sub')) return 'deli';
  if (n.includes('cafe') || n.includes('coffee') || n.includes('bakery') || n.includes('donut')) return 'cafe';
  if (n.includes('bbq') || n.includes('barbecue') || n.includes('smokehouse')) return 'bbq';
  if (n.includes('vietnamese') || n.includes('pho') || n.includes('banh mi')) return 'vietnamese';
  if (n.includes('mediterranean') || n.includes('falafel') || n.includes('shawarma')) return 'mediterranean';
  if (n.includes('steakhouse') || n.includes('steak')) return 'steakhouse';
  if (n.includes('wing')) return 'wings';
  if (n.includes('soul') || n.includes('southern') || n.includes('cajun')) return 'southern';
  return 'restaurant';
}

// Round 2 searches — deeper neighborhood + cuisine coverage
const ROUND2: Record<string, string[]> = {
  nyc: [
    'best ramen restaurants in New York City',
    'popular restaurants in East Village Manhattan',
    'best restaurants in Williamsburg Brooklyn',
    'popular restaurants in Astoria Queens',
    'best Indian restaurants in New York City',
    'popular restaurants in Harlem New York',
    'best Vietnamese restaurants in New York City',
    'popular restaurants in Hell\'s Kitchen Manhattan',
    'best restaurants in Lower East Side Manhattan',
    'popular BBQ restaurants in New York City',
    'best brunch in Brooklyn New York',
    'popular deli restaurants in New York City',
    'best soul food restaurants in New York City',
    'popular restaurants in Upper West Side Manhattan',
    'best Mediterranean restaurants in New York City',
  ],
  chicago: [
    'best restaurants in Logan Square Chicago',
    'popular restaurants in River North Chicago',
    'best restaurants in West Loop Chicago',
    'popular restaurants in Pilsen Chicago',
    'best ramen restaurants in Chicago',
    'popular Indian restaurants in Chicago',
    'best Thai restaurants in Chicago',
    'popular restaurants in Lakeview Chicago',
    'best dim sum restaurants in Chicago',
  ],
  la: [
    'best restaurants in Venice Beach Los Angeles',
    'popular restaurants in Downtown LA',
    'best Thai restaurants in Los Angeles',
    'popular restaurants in Culver City California',
    'best ramen restaurants in Los Angeles',
    'popular restaurants in Echo Park Los Angeles',
    'best seafood restaurants in Los Angeles',
    'popular restaurants in Pasadena California',
    'best Vietnamese restaurants in Los Angeles',
  ],
  boston: [
    'best restaurants in South End Boston',
    'popular restaurants in Allston Brighton Boston',
    'best Asian restaurants in Boston',
    'popular restaurants in Fenway Boston',
    'best restaurants in Somerville Massachusetts',
  ],
  miami: [
    'best restaurants in Little Havana Miami',
    'popular restaurants in Coral Gables Miami',
    'best restaurants in Design District Miami',
    'popular restaurants in South Beach Miami',
    'best Peruvian restaurants in Miami',
  ],
  philly: [
    'best restaurants in South Philadelphia',
    'popular restaurants in Northern Liberties Philadelphia',
    'best Asian restaurants in Philadelphia',
    'popular restaurants in University City Philadelphia',
  ],
  atlanta: [
    'best restaurants in Inman Park Atlanta',
    'popular restaurants in Decatur Georgia',
    'best restaurants in Virginia Highland Atlanta',
    'popular restaurants in East Atlanta Village',
  ],
  houston: [
    'best restaurants in Heights Houston',
    'popular restaurants in EaDo Houston',
    'best Vietnamese restaurants in Houston',
    'popular restaurants in Katy Texas',
  ],
  sf: [
    'best restaurants in Hayes Valley San Francisco',
    'popular restaurants in North Beach San Francisco',
    'best dim sum restaurants in San Francisco',
    'popular restaurants in Oakland California',
    'best restaurants in Castro San Francisco',
  ],
  seattle: [
    'best restaurants in Ballard Seattle',
    'popular restaurants in Fremont Seattle',
    'best Asian restaurants in Seattle',
    'popular restaurants in Bellevue Washington',
  ],
  denver: [
    'best restaurants in Highlands Denver',
    'popular restaurants in Cherry Creek Denver',
    'best restaurants in Boulder Colorado',
  ],
  nashville: [
    'best restaurants in East Nashville',
    'popular restaurants in Germantown Nashville',
    'best restaurants in The Gulch Nashville',
  ],
  nola: [
    'best restaurants in French Quarter New Orleans',
    'popular restaurants in Bywater New Orleans',
    'best restaurants in Garden District New Orleans',
    'popular restaurants in Magazine Street New Orleans',
  ],
};

async function discover(metro: string, queries: string[]): Promise<Restaurant[]> {
  // Load existing to dedupe
  const existingFile = `scripts/${metro}-places.json`;
  const existing: Restaurant[] = existsSync(existingFile) ? JSON.parse(readFileSync(existingFile, 'utf-8')) : [];
  const seen = new Set(existing.map(r => r.slug));
  const newRestaurants: Restaurant[] = [];

  for (const query of queries) {
    try {
      const output = execSync(`goplaces search "${query}" --json 2>/dev/null`, { encoding: 'utf-8', timeout: 15000 });
      const results = JSON.parse(output);
      
      for (const r of results) {
        const slug = slugify(r.name);
        if (seen.has(slug)) continue;
        seen.add(slug);
        newRestaurants.push({ name: r.name, slug, category: categoryFromName(r.name), metros: [metro] });
      }
      
      await new Promise(r => setTimeout(r, 200));
    } catch {}
  }

  // Merge and save
  const all = [...existing, ...newRestaurants];
  writeFileSync(existingFile, JSON.stringify(all, null, 2));
  return newRestaurants;
}

(async () => {
  const target = process.argv[2];
  const metros = target ? [target] : Object.keys(ROUND2);
  let totalNew = 0;
  
  for (const metro of metros) {
    const queries = ROUND2[metro] || [];
    if (!queries.length) continue;
    
    console.log(`\n🔍 Expanding ${metro.toUpperCase()} (+${queries.length} queries)...`);
    const newOnes = await discover(metro, queries);
    totalNew += newOnes.length;
    console.log(`  ✅ +${newOnes.length} new restaurants`);
  }
  
  console.log(`\n🎉 Total new: ${totalNew}`);
})();
