#!/usr/bin/env npx tsx
/**
 * Add restaurants for new cities to the MealCompare database.
 * Uses Google Places API via goplaces CLI for discovery.
 * 
 * Usage: npx tsx scripts/add-cities.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  address?: string;
}

const CITY_SEARCHES: Record<string, string[]> = {
  nyc: [
    'popular restaurants in Manhattan New York',
    'best restaurants in Brooklyn New York',
    'popular restaurants in Queens New York',
    'best pizza restaurants in New York City',
    'best Chinese restaurants in New York City',
    'popular brunch spots in New York City',
    'best burger restaurants in Manhattan',
    'popular Thai restaurants in New York City',
    'best Italian restaurants in New York City',
    'popular Mexican restaurants in New York City',
  ],
  chicago: [
    'popular restaurants in Chicago Illinois',
    'best pizza restaurants in Chicago',
    'popular restaurants in Wicker Park Chicago',
    'best restaurants in Lincoln Park Chicago',
    'popular brunch spots in Chicago',
    'best Mexican restaurants in Chicago',
    'popular BBQ restaurants in Chicago',
  ],
  la: [
    'popular restaurants in Los Angeles California',
    'best restaurants in Hollywood Los Angeles',
    'popular restaurants in Santa Monica',
    'best Mexican restaurants in Los Angeles',
    'popular Korean restaurants in Los Angeles',
    'best restaurants in Silver Lake Los Angeles',
  ],
  boston: [
    'popular restaurants in Boston Massachusetts',
    'best seafood restaurants in Boston',
    'popular restaurants in Cambridge Massachusetts',
    'best Italian restaurants in Boston North End',
    'popular brunch spots in Boston',
  ],
  miami: [
    'popular restaurants in Miami Florida',
    'best Cuban restaurants in Miami',
    'popular restaurants in Wynwood Miami',
    'best seafood restaurants in Miami Beach',
    'popular restaurants in Brickell Miami',
  ],
  philly: [
    'popular restaurants in Philadelphia Pennsylvania',
    'best restaurants in Center City Philadelphia',
    'popular restaurants in Fishtown Philadelphia',
  ],
  atlanta: [
    'popular restaurants in Atlanta Georgia',
    'best restaurants in Midtown Atlanta',
    'popular restaurants in Buckhead Atlanta',
  ],
  denver: [
    'popular restaurants in Denver Colorado',
    'best restaurants in RiNo Denver',
  ],
  seattle: [
    'popular restaurants in Seattle Washington',
    'best restaurants in Capitol Hill Seattle',
  ],
  sf: [
    'popular restaurants in San Francisco California',
    'best restaurants in Mission District San Francisco',
  ],
  houston: [
    'popular restaurants in Houston Texas',
    'best restaurants in Montrose Houston',
  ],
  nashville: [
    'popular restaurants in Nashville Tennessee',
    'best hot chicken restaurants in Nashville',
  ],
  nola: [
    'popular restaurants in New Orleans Louisiana',
    'best Cajun restaurants in New Orleans',
  ],
};

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 40);
}

function categoryFromTypes(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('pizza')) return 'pizza';
  if (n.includes('sushi') || n.includes('japanese')) return 'japanese';
  if (n.includes('thai')) return 'thai';
  if (n.includes('chinese') || n.includes('dim sum')) return 'chinese';
  if (n.includes('mexican') || n.includes('taco') || n.includes('burrito')) return 'mexican';
  if (n.includes('indian') || n.includes('curry')) return 'indian';
  if (n.includes('korean') || n.includes('bbq')) return 'korean';
  if (n.includes('burger')) return 'burgers';
  if (n.includes('seafood') || n.includes('fish') || n.includes('oyster')) return 'seafood';
  if (n.includes('italian') || n.includes('pasta')) return 'italian';
  if (n.includes('french') || n.includes('bistro')) return 'french';
  if (n.includes('deli') || n.includes('sandwich')) return 'deli';
  if (n.includes('cafe') || n.includes('coffee') || n.includes('bakery')) return 'cafe';
  return 'restaurant';
}

async function searchCity(metro: string): Promise<Restaurant[]> {
  const searches = CITY_SEARCHES[metro] || [];
  const seen = new Set<string>();
  const restaurants: Restaurant[] = [];

  for (const query of searches) {
    try {
      const output = execSync(`goplaces search "${query}" --json 2>/dev/null`, { encoding: 'utf-8', timeout: 15000 });
      const results = JSON.parse(output);
      
      for (const r of results) {
        const slug = slugify(r.name);
        if (seen.has(slug)) continue;
        seen.add(slug);
        
        restaurants.push({
          name: r.name,
          slug,
          category: categoryFromTypes(r.name),
          metros: [metro],
          address: r.address?.split(',')[0],
        });
      }
      
      console.log(`  ✓ "${query}" → ${results.length} results (${restaurants.length} unique total)`);
      
      // Rate limit Google Places API
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.log(`  ✗ "${query}" — error`);
    }
  }

  return restaurants;
}

(async () => {
  const targetMetros = process.argv[2] ? [process.argv[2]] : Object.keys(CITY_SEARCHES);
  
  for (const metro of targetMetros) {
    console.log(`\n🔍 Discovering restaurants in ${metro.toUpperCase()}...`);
    const restaurants = await searchCity(metro);
    
    // Save results
    writeFileSync(`scripts/${metro}-places.json`, JSON.stringify(restaurants, null, 2));
    
    // Generate TypeScript
    const tsLines = restaurants.map(r =>
      `  { name: '${r.name.replace(/'/g, "\\'")}', slug: '${r.slug}', category: '${r.category}', metros: ['${metro}'] },`
    );
    writeFileSync(`scripts/${metro}-places.ts`,
      `// Auto-generated via Google Places API — ${new Date().toISOString()}\n// ${restaurants.length} restaurants in ${metro.toUpperCase()}\n\nexport const ${metro.toUpperCase()}_RESTAURANTS = [\n${tsLines.join('\n')}\n];\n`
    );
    
    console.log(`  📁 Saved ${restaurants.length} restaurants for ${metro}`);
  }
})();
