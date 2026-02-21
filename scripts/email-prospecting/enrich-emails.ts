/**
 * Email Enrichment Script for Eddy Prospecting
 * 
 * Uses Brave Search API to find restaurant contact emails.
 * Strategy: Search for "[restaurant name] [city] contact email" 
 * and extract emails from results.
 */

import fs from 'fs';
import path from 'path';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';
const INPUT_FILE = path.join(__dirname, '..', 'no-direct-ordering.json');
const OUTPUT_FILE = path.join(__dirname, 'enriched-restaurants.json');
const PROGRESS_FILE = path.join(__dirname, 'enrich-progress.json');

interface TargetRestaurant {
  name: string;
  metro: string;
}

interface EnrichedRestaurant extends TargetRestaurant {
  emails: string[];
  website?: string;
  phone?: string;
  enrichedAt: string;
  source: string;
}

const METRO_TO_CITY: Record<string, string> = {
  nyc: 'New York City',
  la: 'Los Angeles',
  sf: 'San Francisco',
  dc: 'Washington DC',
  nola: 'New Orleans',
  philly: 'Philadelphia',
  chicago: 'Chicago',
  dallas: 'Dallas',
  houston: 'Houston',
  phoenix: 'Phoenix',
  boston: 'Boston',
  portland: 'Portland',
  sandiego: 'San Diego',
  miami: 'Miami',
  atlanta: 'Atlanta',
  pittsburgh: 'Pittsburgh',
  minneapolis: 'Minneapolis',
  detroit: 'Detroit',
  tampa: 'Tampa',
  charlotte: 'Charlotte',
  nashville: 'Nashville',
  seattle: 'Seattle',
  stlouis: 'St Louis',
  baltimore: 'Baltimore',
  milwaukee: 'Milwaukee',
  denver: 'Denver',
  austin: 'Austin',
  raleigh: 'Raleigh',
  indianapolis: 'Indianapolis',
  columbus: 'Columbus',
};

async function searchBrave(query: string): Promise<any> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
  const resp = await fetch(url, {
    headers: { 'X-Subscription-Token': BRAVE_API_KEY, Accept: 'application/json' },
  });
  if (!resp.ok) throw new Error(`Brave API ${resp.status}: ${await resp.text()}`);
  return resp.json();
}

function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex) || [];
  // Filter out common false positives
  return [...new Set(matches)].filter(
    (e) =>
      !e.includes('example.com') &&
      !e.includes('sentry') &&
      !e.includes('wixpress') &&
      !e.includes('schema.org') &&
      !e.endsWith('.png') &&
      !e.endsWith('.jpg') &&
      e.length < 60
  );
}

async function enrichRestaurant(restaurant: TargetRestaurant): Promise<EnrichedRestaurant> {
  const city = METRO_TO_CITY[restaurant.metro] || restaurant.metro;
  const query = `"${restaurant.name}" ${city} restaurant contact email`;

  try {
    const results = await searchBrave(query);
    const allText = JSON.stringify(results.web?.results || []);
    const emails = extractEmails(allText);

    // Try to find website
    const webResults = results.web?.results || [];
    const website = webResults.find(
      (r: any) =>
        r.url &&
        !r.url.includes('yelp.com') &&
        !r.url.includes('tripadvisor.com') &&
        !r.url.includes('doordash.com') &&
        !r.url.includes('ubereats.com') &&
        !r.url.includes('grubhub.com')
    )?.url;

    // Try to extract phone
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = allText.match(phoneRegex) || [];

    return {
      ...restaurant,
      emails,
      website,
      phone: phones[0],
      enrichedAt: new Date().toISOString(),
      source: 'brave_search',
    };
  } catch (err: any) {
    console.error(`  Error enriching ${restaurant.name}: ${err.message}`);
    return {
      ...restaurant,
      emails: [],
      enrichedAt: new Date().toISOString(),
      source: 'error',
    };
  }
}

async function main() {
  const targets: TargetRestaurant[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  
  // Load progress
  let enriched: EnrichedRestaurant[] = [];
  let startIdx = 0;
  if (fs.existsSync(PROGRESS_FILE)) {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    enriched = progress.enriched;
    startIdx = progress.lastIndex + 1;
    console.log(`Resuming from index ${startIdx} (${enriched.length} already enriched)`);
  }

  // Limit batch size to stay within Brave API quota
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '50');
  const endIdx = Math.min(startIdx + BATCH_SIZE, targets.length);
  
  console.log(`Processing restaurants ${startIdx} to ${endIdx - 1} of ${targets.length}`);
  console.log(`Brave API quota: Be mindful of 2,000/month limit\n`);

  for (let i = startIdx; i < endIdx; i++) {
    const target = targets[i];
    const city = METRO_TO_CITY[target.metro] || target.metro;
    process.stdout.write(`[${i + 1}/${targets.length}] ${target.name} (${city})... `);
    
    const result = await enrichRestaurant(target);
    enriched.push(result);
    
    if (result.emails.length > 0) {
      console.log(`✅ Found ${result.emails.length} email(s): ${result.emails.join(', ')}`);
    } else {
      console.log('❌ No email found');
    }

    // Save progress every 10 restaurants
    if (i % 10 === 0 || i === endIdx - 1) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ lastIndex: i, enriched }, null, 2));
    }

    // Rate limit: 1 request per second
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Save final results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));
  
  // Stats
  const withEmail = enriched.filter((r) => r.emails.length > 0);
  console.log(`\n=== ENRICHMENT STATS ===`);
  console.log(`Total processed: ${enriched.length}`);
  console.log(`With email: ${withEmail.length} (${((withEmail.length / enriched.length) * 100).toFixed(1)}%)`);
  console.log(`Without email: ${enriched.length - withEmail.length}`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
