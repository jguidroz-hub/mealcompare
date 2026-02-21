/**
 * Email enrichment via Google Places API + website scraping
 * 
 * Strategy:
 * 1. Search Google Places for restaurant → get website URL
 * 2. Fetch website homepage + /contact + /about pages
 * 3. Extract email addresses from HTML
 * 4. Fall back to constructing info@domain.com if no email found
 * 
 * No Brave API needed — uses Google Places (goplaces CLI) + direct web fetches
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, '..', 'warm-leads-no-direct-ordering.csv');
const OUTPUT_FILE = path.join(__dirname, 'enriched-all.json');
const PROGRESS_FILE = path.join(__dirname, 'enrich-places-progress.json');

const METRO_TO_CITY = {
  nyc: 'New York City', la: 'Los Angeles', sf: 'San Francisco', dc: 'Washington DC',
  nola: 'New Orleans', philly: 'Philadelphia', chicago: 'Chicago', dallas: 'Dallas',
  houston: 'Houston', phoenix: 'Phoenix', boston: 'Boston', portland: 'Portland',
  sandiego: 'San Diego', miami: 'Miami', atlanta: 'Atlanta', pittsburgh: 'Pittsburgh',
  minneapolis: 'Minneapolis', detroit: 'Detroit', tampa: 'Tampa', charlotte: 'Charlotte',
  nashville: 'Nashville', seattle: 'Seattle', stlouis: 'St Louis', baltimore: 'Baltimore',
  milwaukee: 'Milwaukee', denver: 'Denver', austin: 'Austin', raleigh: 'Raleigh',
  indianapolis: 'Indianapolis', columbus: 'Columbus'
};

const CONTACT_PATHS = ['', '/contact', '/about', '/contact-us', '/about-us', '/catering', '/private-dining', '/events'];

function extractEmails(html) {
  const matches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  return [...new Set(matches)].filter(e =>
    !e.includes('example.com') && !e.includes('sentry') && !e.includes('wixpress') &&
    !e.includes('schema.org') && !e.endsWith('.png') && !e.endsWith('.jpg') &&
    !e.includes('noreply') && !e.includes('no-reply') && !e.includes('@doordash') &&
    !e.includes('@ubereats') && !e.includes('@grubhub') && !e.includes('@yelp') &&
    !e.includes('protection') && !e.includes('@sentry') && e.length < 60 && e.length > 5
  );
}

function getPlaceDetails(name, city) {
  try {
    const query = `${name} restaurant ${city}`;
    const result = execSync(`goplaces search "${query.replace(/"/g, '\\"')}" --json 2>/dev/null`, { timeout: 10000 });
    const places = JSON.parse(result.toString());
    if (!places.length) return null;

    // Get details for first result
    const placeId = places[0].place_id;
    const details = execSync(`goplaces details "${placeId}" --json 2>/dev/null`, { timeout: 10000 });
    return JSON.parse(details.toString());
  } catch (e) {
    return null;
  }
}

async function scrapeEmailsFromWebsite(websiteUrl) {
  const emails = new Set();
  const baseUrl = websiteUrl.replace(/\?.*$/, '').replace(/\/$/, '');

  for (const p of CONTACT_PATHS) {
    const url = baseUrl + p;
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Eddy/1.0)' },
        signal: AbortSignal.timeout(8000),
        redirect: 'follow',
      });
      if (!resp.ok) continue;
      const html = await resp.text();
      const found = extractEmails(html);
      found.forEach(e => emails.add(e));
      if (emails.size > 0) break; // Got emails, no need to check more pages
    } catch (e) {
      continue;
    }
  }

  return [...emails];
}

async function main() {
  // Parse CSV
  const csv = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csv.trim().split('\n').slice(1);
  const leads = lines.map(line => {
    const match = line.match(/^"?([^"]*?)"?,([^,]*),([^,]*),([^,]*),/);
    if (!match) return null;
    const metros = match[4].split('|');
    return { name: match[1], slug: match[2], metros: match[4], city: METRO_TO_CITY[metros[0]] || metros[0] };
  }).filter(Boolean);

  // Load progress
  let enriched = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    const saved = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    saved.forEach(e => enriched[e.name.toLowerCase()] = e);
    console.log(`Resuming from ${Object.keys(enriched).length} already enriched`);
  }

  const todo = leads.filter(l => !enriched[l.name.toLowerCase()]);
  const BATCH = Math.min(parseInt(process.env.BATCH_SIZE || '100'), todo.length);
  
  console.log(`Total: ${leads.length} | Done: ${Object.keys(enriched).length} | Todo: ${todo.length} | Batch: ${BATCH}`);

  let found = 0;
  let withWebsite = 0;

  for (let i = 0; i < BATCH; i++) {
    const lead = todo[i];
    process.stdout.write(`[${i + 1}/${BATCH}] ${lead.name.substring(0, 28).padEnd(28)} `);

    // Step 1: Google Places lookup
    const place = getPlaceDetails(lead.name, lead.city);
    const website = place?.website;
    const phone = place?.phone;

    if (!website) {
      console.log('❌ No website');
      enriched[lead.name.toLowerCase()] = { ...lead, emails: [], phone, website: null, source: 'places_no_website', enrichedAt: new Date().toISOString() };
      continue;
    }

    withWebsite++;
    
    // Step 2: Scrape website for emails
    const emails = await scrapeEmailsFromWebsite(website);

    // Step 3: If no email found, try info@domain
    let finalEmails = emails;
    if (emails.length === 0) {
      try {
        const domain = new URL(website).hostname.replace('www.', '');
        finalEmails = [`info@${domain}`]; // Educated guess
      } catch (e) {}
    }

    enriched[lead.name.toLowerCase()] = {
      ...lead,
      emails: finalEmails,
      phone,
      website,
      source: emails.length > 0 ? 'website_scrape' : 'domain_guess',
      enrichedAt: new Date().toISOString()
    };

    if (emails.length > 0) {
      found++;
      console.log(`✅ ${emails[0]} (scraped)`);
    } else if (finalEmails.length > 0) {
      found++;
      console.log(`📧 ${finalEmails[0]} (guessed)`);
    } else {
      console.log('❌ No email');
    }

    // Save progress every 20
    if (i % 20 === 0) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(Object.values(enriched), null, 2));
    }

    // Small delay to be nice to Google + restaurant sites
    await new Promise(r => setTimeout(r, 500));
  }

  // Final save
  const allResults = Object.values(enriched);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(allResults, null, 2));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allResults, null, 2));

  const withEmail = allResults.filter(r => r.emails?.length > 0);
  const scraped = allResults.filter(r => r.source === 'website_scrape');
  const guessed = allResults.filter(r => r.source === 'domain_guess');

  console.log(`\n=== ENRICHMENT STATS ===`);
  console.log(`Total enriched: ${allResults.length}`);
  console.log(`With website: ${withWebsite} this batch`);
  console.log(`Scraped email: ${scraped.length}`);
  console.log(`Guessed email (info@): ${guessed.length}`);
  console.log(`Total with email: ${withEmail.length} (${(withEmail.length / allResults.length * 100).toFixed(0)}%)`);
  console.log(`No email: ${allResults.length - withEmail.length}`);
  console.log(`Remaining: ${leads.length - allResults.length}`);
}

main().catch(console.error);
