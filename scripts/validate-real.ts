#!/usr/bin/env npx tsx
/**
 * Validates Toast slugs by checking for actual restaurant content.
 * Toast returns 403 for ALL subdomains (Cloudflare), so we need
 * to use a different signal — check if the page has real content.
 * 
 * Strategy: Fetch with browser-like headers, check for restaurant indicators
 * (menu items, ordering pages, JSON-LD with restaurant data).
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

interface Result {
  name: string;
  slug: string;
  category: string;
  metros: string[];
  toastUrl?: string;
  squareUrl?: string;
  verified: boolean;
}

async function checkToastSlug(slug: string): Promise<{ slug: string; real: boolean; name?: string }> {
  // Try the /menu/ endpoint — real restaurants have menus
  const url = `https://${slug}.toast.site/menu/`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 404) return { slug, real: false };
    
    const html = await res.text();
    
    // Check for real restaurant indicators
    const hasMenu = html.includes('menuItem') || html.includes('menu-item') || html.includes('MenuItem');
    const hasOrder = html.includes('order') || html.includes('Order');
    const hasPrice = /\$\d+\.\d{2}/.test(html);
    const hasJsonLd = html.includes('application/ld+json');
    const hasToastBranding = html.includes('toasttab') || html.includes('Toast');
    const isBlocked = html.includes('cf-browser-verification') || html.includes('challenge-platform');
    const isEmpty = html.length < 500;
    
    // Real restaurant = has menu items or prices or JSON-LD
    const isReal = !isEmpty && !isBlocked && (hasMenu || hasPrice || hasJsonLd || (hasOrder && hasToastBranding));
    
    // Try to extract name
    let name: string | undefined;
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      name = titleMatch[1].split('|')[0].split(' - ')[0].trim();
      if (name === 'Toast' || name === '' || name.length > 60) name = undefined;
    }
    
    return { slug, real: isReal, name };
  } catch {
    return { slug, real: false };
  }
}

// Read slugs from JSON or stdin
const args = process.argv.slice(2);
const inputFile = args[0];
const metro = args[1] || 'unknown';

if (!inputFile) {
  console.log('Usage: npx tsx scripts/validate-real.ts <slugs-file.json> <metro>');
  process.exit(1);
}

(async () => {
  const slugs: string[] = JSON.parse(readFileSync(inputFile, 'utf-8'));
  console.log(`🔍 Validating ${slugs.length} Toast slugs for ${metro}...`);
  
  const results: Result[] = [];
  const BATCH = 5; // Lower batch size to avoid rate limiting
  
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    const checks = await Promise.all(batch.map(checkToastSlug));
    
    for (const c of checks) {
      if (c.real) {
        results.push({
          name: c.name || c.slug.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()),
          slug: c.slug,
          category: 'restaurant',
          metros: [metro],
          toastUrl: `https://${c.slug}.toast.site/`,
          verified: true,
        });
      }
    }
    
    process.stdout.write(`  ${Math.min(i + BATCH, slugs.length)}/${slugs.length} checked, ${results.length} real\r`);
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✅ ${results.length}/${slugs.length} are real restaurants`);
  
  writeFileSync(`scripts/${metro}-verified.json`, JSON.stringify(results, null, 2));
  console.log(`📁 Saved to scripts/${metro}-verified.json`);
})();
