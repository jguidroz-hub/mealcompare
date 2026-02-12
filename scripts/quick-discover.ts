#!/usr/bin/env npx tsx
/**
 * Quick Toast + Square discovery via slug brute-force + validation.
 * 
 * Strategy: Generate common restaurant name patterns as Toast slugs,
 * validate which ones are live, then save results.
 * 
 * This works WITHOUT any API keys — just HTTP HEAD requests.
 * Toast slugs follow patterns: {restaurantname}.toast.site
 * 
 * Usage:
 *   npx tsx scripts/quick-discover.ts --metro nyc --input slugs-nyc.txt
 *   npx tsx scripts/quick-discover.ts --validate slugs.txt --metro chicago
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Restaurant {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
  squareUrl?: string;
}

// Validate a batch of slugs against toast.site
async function validateToastSlug(slug: string): Promise<{ slug: string; ok: boolean; url: string }> {
  const url = `https://${slug}.toast.site/`;
  try {
    const res = await fetch(url, { 
      method: 'HEAD', 
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    return { slug, ok: res.ok || res.status === 403, url };
  } catch {
    return { slug, ok: false, url };
  }
}

async function validateSquareSlug(slug: string): Promise<{ slug: string; ok: boolean; url: string }> {
  const url = `https://${slug}.square.site/`;
  try {
    const res = await fetch(url, { 
      method: 'HEAD', 
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    return { slug, ok: res.ok, url };
  } catch {
    return { slug, ok: false, url };
  }
}

async function validateBatch(slugs: string[], metro: string, platform: 'toast' | 'square' = 'toast'): Promise<Restaurant[]> {
  const results: Restaurant[] = [];
  const BATCH = 20;
  let validated = 0;
  let live = 0;

  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    const fn = platform === 'toast' ? validateToastSlug : validateSquareSlug;
    const batchResults = await Promise.all(batch.map(fn));

    for (const r of batchResults) {
      validated++;
      if (r.ok) {
        live++;
        const name = r.slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        const entry: Restaurant = {
          name,
          slug: r.slug,
          category: 'restaurant',
          metros: [metro],
        };
        if (platform === 'toast') entry.toastUrl = r.url;
        else entry.squareUrl = r.url;
        results.push(entry);
      }
    }

    process.stdout.write(`  Progress: ${validated}/${slugs.length} validated, ${live} live\r`);
  }

  console.log(`\n  ✅ ${live}/${validated} live`);
  return results;
}

// Read slugs from file (one per line)
function readSlugs(file: string): string[] {
  if (!existsSync(file)) { console.error(`File not found: ${file}`); return []; }
  return readFileSync(file, 'utf-8')
    .split('\n')
    .map(l => l.trim().toLowerCase())
    .filter(l => l && !l.startsWith('#'));
}

// Main
const args = process.argv.slice(2);
const metro = args.find(a => a.startsWith('--metro='))?.split('=')[1] 
  || (args.includes('--metro') ? args[args.indexOf('--metro') + 1] : 'unknown');
const inputFile = args.find(a => a.startsWith('--input='))?.split('=')[1]
  || (args.includes('--input') ? args[args.indexOf('--input') + 1] : null);
const platform = (args.find(a => a.startsWith('--platform='))?.split('=')[1] || 'toast') as 'toast' | 'square';

if (!inputFile) {
  console.log('Usage: npx tsx scripts/quick-discover.ts --metro nyc --input slugs.txt [--platform toast|square]');
  process.exit(1);
}

(async () => {
  const slugs = readSlugs(inputFile);
  console.log(`🔍 Validating ${slugs.length} ${platform} slugs for ${metro}...`);
  
  const restaurants = await validateBatch(slugs, metro, platform);
  
  const outJson = `scripts/${metro}-${platform}-results.json`;
  const outTs = `scripts/${metro}-${platform}-restaurants.ts`;
  
  writeFileSync(outJson, JSON.stringify(restaurants, null, 2));
  
  const tsLines = restaurants.map(r => {
    const urlKey = platform === 'toast' ? 'toastUrl' : 'squareUrl';
    const urlVal = platform === 'toast' ? r.toastUrl : r.squareUrl;
    return `  { name: '${r.name.replace(/'/g, "\\'")}', slug: '${r.slug}', category: '${r.category}', metros: ['${metro}'], ${urlKey}: '${urlVal}' },`;
  });
  
  writeFileSync(outTs, `// Auto-generated — ${new Date().toISOString()}\n// ${restaurants.length} verified ${platform} restaurants in ${metro}\n\n${tsLines.join('\n')}\n`);
  
  console.log(`📁 Saved ${restaurants.length} to ${outJson}`);
  console.log(`📝 TypeScript: ${outTs}`);
})();
