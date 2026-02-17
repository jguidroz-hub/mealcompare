#!/usr/bin/env npx tsx
/**
 * Clean restaurant names: strip addresses, fix numeric IDs, normalize long names
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';

interface Restaurant {
  name: string; slug: string; category: string; metros: string[];
  toastUrl?: string; squareUrl?: string; websiteOrderUrl?: string;
}

// Extract real restaurant name from messy strings
function cleanName(name: string, url?: string): string {
  let n = name.trim();

  // Pure numeric → try to extract from URL
  if (/^\d+$/.test(n) && url) {
    // ChowNow: /order/9351/locations/12756 → get name from earlier in URL... not helpful
    // Try extracting from Toast URL slug
    const toastMatch = url.match(/online\/([^\/\?]+)/);
    if (toastMatch) {
      return toastMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 50);
    }
    return ''; // Can't recover, will be filtered
  }

  // Leading address: "979 springdale Rd, Stargazer Bar" → extract name after address
  const leadingAddr = n.match(/^\d+\s+[\w\s]+(?:st(?:reet)?|rd|road|ave(?:nue)?|blvd|dr(?:ive)?|ln|lane|hwy|way)\s*[,]\s*(.+)/i);
  if (leadingAddr && leadingAddr[1]) {
    n = leadingAddr[1].trim();
  }

  // If name is still address-like, try extracting from Toast URL
  if (/^\d+\s/.test(n) && url) {
    const toastMatch = url.match(/online\/([^\/\?]+)/);
    if (toastMatch) {
      const fromUrl = toastMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
      if (fromUrl.length > 3) n = fromUrl;
    }
  }

  // Remove trailing addresses: "Restaurant Name 1234 Main Street" or "Name - 3901 Promontory Drive"
  // Pattern: dash/comma + number + street suffix at the end
  n = n.replace(/\s*[-–,]\s*\d+\s+[\w\s]+(?:st(?:reet)?|rd|road|ave(?:nue)?|blvd|dr(?:ive)?|ln|lane|ct|hwy|way|pl(?:ace)?|pkwy)\s*(?:,?\s*(?:suite|ste|apt|#)\s*\w+)?(?:,?\s*[A-Z]{2}\s*\d{5})?$/i, '');

  // Remove inline addresses: "Name 1234 Some Street, City, ST" 
  n = n.replace(/\s+\d+\s+(?:(?:E(?:ast)?|W(?:est)?|N(?:orth)?|S(?:outh)?|NW|NE|SW|SE)\s+)?(?:[\w]+\s+){0,2}(?:st(?:reet)?|rd|road|ave(?:nue)?|blvd|boulevard|dr(?:ive)?|ln|lane|ct|court|hwy|highway|way|place|pike|pkwy|parkway)\s*(?:,?\s*(?:suite|ste)\s*\w+)?(?:,?\s*[\w\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)?$/i, '');

  // Remove city/state suffixes: "Name - Austin, TX" or "Name, Austin, Texas"
  n = n.replace(/\s*[-–,]\s*(?:Austin|Houston|Dallas|NYC|Chicago|LA|Miami|Atlanta|Seattle|Denver|Boston|Portland|Phoenix|Tampa|Charlotte|Nashville|Baltimore|Detroit|Minneapolis|Milwaukee|Raleigh|Columbus|Indianapolis|Pittsburgh|Philadelphia|San Diego|San Francisco|New Orleans|St\.?\s*Louis|Washington\s*D\.?C\.?)\s*(?:,\s*[A-Z]{2}(?:\s+\d{5})?)?\s*$/i, '');

  // Remove zip codes
  n = n.replace(/\s*,?\s*\d{5}(?:-\d{4})?\s*$/, '');

  // Remove "- Clover" or "| Powered by" suffixes
  n = n.replace(/\s*[-|]\s*(?:Clover|Powered by.*|Toast|ChowNow|Square|Menufy)$/i, '');

  // Remove location descriptors at end: "- East Austin" or "- Downtown"
  // But keep "East Side Pies" etc (only strip if after a dash)
  n = n.replace(/\s*[-–]\s*(?:East|West|North|South|Downtown|Midtown|Uptown)\s*(?:Austin|Side|Loop)?\s*$/i, '');

  // Remove "- RTC" or "- Food Truck" etc
  n = n.replace(/\s*[-–]\s*(?:RTC|FC|LLC|Inc|Co)\s*$/i, '');

  // Trim extra whitespace
  n = n.replace(/\s+/g, ' ').trim();

  // Remove trailing dash/comma
  n = n.replace(/\s*[-–,]\s*$/, '').trim();

  return n;
}

let totalCleaned = 0;
let totalRemoved = 0;

const cityFiles = readdirSync('scripts').filter(f => f.endsWith('-places.json')).sort();

for (const file of cityFiles) {
  const metro = file.replace('-places.json', '');
  const data: Restaurant[] = JSON.parse(readFileSync('scripts/' + file, 'utf-8'));

  let cleaned = 0;
  let removed = 0;

  const result = data.map(r => {
    const url = r.toastUrl || r.squareUrl || r.websiteOrderUrl;
    const newName = cleanName(r.name, url);

    if (!newName || newName.length < 3) {
      removed++;
      return null;
    }

    if (newName !== r.name) {
      cleaned++;
      if (cleaned <= 3) process.stdout.write(`  ${metro}: "${r.name}" → "${newName}"\n`);
      r.name = newName;
      r.slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    }

    return r;
  }).filter(Boolean) as Restaurant[];

  if (removed > 0 || cleaned > 0) {
    process.stdout.write(`${metro}: cleaned ${cleaned}, removed ${removed}\n`);
  }
  totalCleaned += cleaned;
  totalRemoved += removed;

  writeFileSync('scripts/' + file, JSON.stringify(result, null, 2));
}

console.log(`\n✅ Total cleaned: ${totalCleaned}, removed: ${totalRemoved}`);
