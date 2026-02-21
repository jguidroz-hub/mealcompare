/**
 * Promo Code Scraper for Eddy
 * 
 * Scrapes coupon aggregator sites for DoorDash, Uber Eats, and Grubhub
 * promo codes, then upserts them into the promo_codes table.
 * 
 * Run: npx tsx scripts/scrape-promo-codes.ts
 * Schedule: daily via cron or heartbeat
 * 
 * Sources:
 * 1. RetailMeNot
 * 2. Coupons.com / Offers.com
 * 3. Slickdeals
 * 4. Platform-specific pages (DoorDash promos page, etc.)
 * 5. Reddit (r/doordash, r/UberEATS, r/grubhub)
 */

import { Pool } from 'pg';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';

interface PromoCode {
  platform: string;
  code: string;
  description: string;
  discountType: 'fixed' | 'percent' | 'free_delivery' | 'bogo';
  discountCents?: number;
  discountPercent?: number;
  minOrderCents?: number;
  maxDiscountCents?: number;
  firstOrderOnly: boolean;
  expiresAt?: string;
  source: string;
  sourceUrl?: string;
}

// ─── Scraping Sources ──────────────────────────────────────────

const PLATFORMS = ['doordash', 'ubereats', 'grubhub'] as const;

const SEARCH_QUERIES: Record<string, string[]> = {
  doordash: [
    'DoorDash promo code 2026',
    'DoorDash coupon code today',
    'DoorDash discount code working',
    'site:retailmenot.com doordash',
    'site:reddit.com doordash promo code',
  ],
  ubereats: [
    'Uber Eats promo code 2026',
    'Uber Eats coupon code today',
    'Uber Eats discount working',
    'site:retailmenot.com uber eats',
    'site:reddit.com ubereats promo code',
  ],
  grubhub: [
    'Grubhub promo code 2026',
    'Grubhub coupon code today',
    'Grubhub discount working',
    'site:retailmenot.com grubhub',
    'site:reddit.com grubhub promo code',
  ],
};

// Known aggregator URLs to fetch directly
const DIRECT_URLS: Record<string, string[]> = {
  doordash: [
    'https://simplycodes.com/store/doordash.com',
    'https://couponfollow.com/site/doordash.com',
  ],
  ubereats: [
    'https://simplycodes.com/store/ubereats.com',
    'https://couponfollow.com/site/ubereats.com',
  ],
  grubhub: [
    'https://simplycodes.com/store/grubhub.com',
    'https://couponfollow.com/site/grubhub.com',
  ],
};

// ─── Code Extraction Patterns ──────────────────────────────────

// Common promo code patterns (uppercase alphanumeric, 4-20 chars)
const CODE_PATTERN = /\b([A-Z0-9]{4,20})\b/g;

// Patterns that indicate a promo code context
const PROMO_CONTEXT_PATTERNS = [
  /(?:promo|coupon|discount|offer)\s*(?:code)?[:\s]+["']?([A-Z0-9]{4,20})["']?/gi,
  /(?:code|use|enter|apply)[:\s]+["']?([A-Z0-9]{4,20})["']?/gi,
  /["']([A-Z0-9]{4,20})["']\s*(?:for|to get|saves?)/gi,
  /(?:promo\s*code|code)\s+([A-Z0-9]{4,20})\s+(?:as\s+working|for|at)/gi,
  /added\s+(?:promo\s*)?code\s+([A-Z0-9]{4,20})/gi,
];

// Value extraction patterns
const VALUE_PATTERNS = {
  fixedOff: /\$(\d+(?:\.\d{2})?)\s*off/i,
  percentOff: /(\d+)%\s*off/i,
  freeDelivery: /free\s*delivery/i,
  minOrder: /(?:min(?:imum)?|orders?\s*(?:of|over|above))\s*\$(\d+)/i,
  firstOrder: /(?:first|new)\s*(?:order|user|customer)/i,
  expires: /(?:exp(?:ires?)?|valid\s*(?:until|through|thru))[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
};

// Exclude common false positives
const CODE_BLACKLIST = new Set([
  'HTTPS', 'HTML', 'JSON', 'NULL', 'TRUE', 'FALSE', 'NONE',
  'FREE', 'SAVE', 'CODE', 'DEAL', 'BEST', 'SHOP', 'SALE',
  'HOME', 'MENU', 'FOOD', 'CART', 'ORDER', 'CLICK', 'HERE',
  'MORE', 'VIEW', 'SHOW', 'HIDE', 'NEXT', 'BACK', 'CLOSE',
  'SIGN', 'JOIN', 'EARN', 'SEND', 'COPY', 'SHARE', 'PRINT',
  'PAGE', 'SITE', 'LINK', 'EDIT', 'POST', 'LIKE', 'HELP',
  'INFO', 'NEWS', 'BLOG', 'TIPS', 'FAQS', 'TERMS', 'ABOUT',
  'DOORDASH', 'UBEREATS', 'GRUBHUB', 'UBER', 'EATS',
  'REDDIT', 'PROMO', 'COUPON', 'DISCOUNT', 'OFFER',
]);

// ─── Fetch + Parse ─────────────────────────────────────────────

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

async function braveSearch(query: string): Promise<Array<{ title: string; url: string; description: string }>> {
  if (!BRAVE_API_KEY) return [];
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`, {
      headers: { 'X-Subscription-Token': BRAVE_API_KEY, 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.web?.results ?? []).map((r: any) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      description: r.description ?? '',
    }));
  } catch {
    return [];
  }
}

function extractCodesFromText(text: string, platform: string, source: string, sourceUrl?: string): PromoCode[] {
  const codes: PromoCode[] = [];
  const seen = new Set<string>();

  // Strategy 1: Context-aware extraction (highest confidence)
  for (const pattern of PROMO_CONTEXT_PATTERNS) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      const code = match[1].toUpperCase();
      if (code.length >= 4 && code.length <= 20 && !CODE_BLACKLIST.has(code) && !seen.has(code)) {
        seen.add(code);
        const surrounding = getSurroundingText(text, match.index, 200);
        codes.push(parsePromoContext(code, surrounding, platform, source, sourceUrl));
      }
    }
  }

  return codes;
}

function getSurroundingText(text: string, index: number, radius: number): string {
  return text.substring(Math.max(0, index - radius), Math.min(text.length, index + radius));
}

function parsePromoContext(code: string, context: string, platform: string, source: string, sourceUrl?: string): PromoCode {
  const promo: PromoCode = {
    platform,
    code,
    description: '',
    discountType: 'fixed',
    firstOrderOnly: false,
    source,
    sourceUrl,
  };

  // Extract value
  const fixedMatch = context.match(VALUE_PATTERNS.fixedOff);
  const pctMatch = context.match(VALUE_PATTERNS.percentOff);
  const freeDelivery = VALUE_PATTERNS.freeDelivery.test(context);

  if (fixedMatch) {
    promo.discountType = 'fixed';
    promo.discountCents = Math.round(parseFloat(fixedMatch[1]) * 100);
    promo.description = `$${fixedMatch[1]} off`;
  } else if (pctMatch) {
    promo.discountType = 'percent';
    promo.discountPercent = parseInt(pctMatch[1]);
    promo.description = `${pctMatch[1]}% off`;
  } else if (freeDelivery) {
    promo.discountType = 'free_delivery';
    promo.description = 'Free delivery';
  } else {
    promo.description = `Promo code: ${code}`;
  }

  // Min order
  const minMatch = context.match(VALUE_PATTERNS.minOrder);
  if (minMatch) promo.minOrderCents = Math.round(parseFloat(minMatch[1]) * 100);

  // First order only
  if (VALUE_PATTERNS.firstOrder.test(context)) promo.firstOrderOnly = true;

  // Expiry
  const expMatch = context.match(VALUE_PATTERNS.expires);
  if (expMatch) {
    try {
      const d = new Date(expMatch[1]);
      if (!isNaN(d.getTime())) promo.expiresAt = d.toISOString();
    } catch {}
  }

  return promo;
}

// Strip HTML tags for text extraction
function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

// ─── Main Scraper ──────────────────────────────────────────────

async function scrapeAllSources(): Promise<PromoCode[]> {
  const allCodes: PromoCode[] = [];
  const globalSeen = new Set<string>();

  for (const platform of PLATFORMS) {
    console.log(`\n🔍 Scraping ${platform}...`);

    // 1. Direct URL fetching
    for (const url of DIRECT_URLS[platform]) {
      console.log(`  Fetching ${url}...`);
      const html = await fetchPage(url);
      if (html) {
        const text = stripHtml(html);
        const codes = extractCodesFromText(text, platform, 'aggregator', url);
        for (const c of codes) {
          if (!globalSeen.has(`${c.platform}:${c.code}`)) {
            globalSeen.add(`${c.platform}:${c.code}`);
            allCodes.push(c);
            console.log(`    ✅ Found: ${c.code} — ${c.description}`);
          }
        }
      }
      await sleep(500); // Rate limit
    }

    // 2. Brave search
    for (const query of SEARCH_QUERIES[platform]) {
      console.log(`  Searching: "${query}"...`);
      const results = await braveSearch(query);
      for (const result of results.slice(0, 5)) {
        // Extract from search snippet first (fast, no extra fetch)
        const snippetCodes = extractCodesFromText(
          result.title + ' ' + result.description,
          platform, 'search_snippet', result.url
        );
        for (const c of snippetCodes) {
          if (!globalSeen.has(`${c.platform}:${c.code}`)) {
            globalSeen.add(`${c.platform}:${c.code}`);
            allCodes.push(c);
            console.log(`    ✅ Found (snippet): ${c.code} — ${c.description}`);
          }
        }

        // For promising URLs, fetch the full page
        if (result.url.includes('retailmenot') || result.url.includes('offers.com') ||
            result.url.includes('groupon') || result.url.includes('slickdeals') ||
            result.url.includes('reddit.com/r/')) {
          const html = await fetchPage(result.url);
          if (html) {
            const text = stripHtml(html);
            const pageCodes = extractCodesFromText(text, platform, 'web_scrape', result.url);
            for (const c of pageCodes) {
              if (!globalSeen.has(`${c.platform}:${c.code}`)) {
                globalSeen.add(`${c.platform}:${c.code}`);
                allCodes.push(c);
                console.log(`    ✅ Found (page): ${c.code} — ${c.description}`);
              }
            }
          }
          await sleep(500);
        }
      }
      await sleep(300);
    }
  }

  return allCodes;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Database Upsert ───────────────────────────────────────────

async function upsertCodes(codes: PromoCode[]): Promise<{ inserted: number; updated: number }> {
  const pool = new Pool({
    host: process.env.HETZNER_PG_HOST || 'lsw8k440k448sk8gwgkkkog8',
    user: process.env.HETZNER_PG_USER || 'greenbelt',
    password: process.env.HETZNER_PG_PASSWORD,
    database: 'skipthefee',
    port: 5432,
  });

  let inserted = 0;
  let updated = 0;

  try {
    for (const code of codes) {
      const existing = await pool.query(
        'SELECT id FROM promo_codes WHERE platform = $1 AND code = $2',
        [code.platform, code.code]
      );

      if (existing.rows.length > 0) {
        // Update — refresh verified_at timestamp
        await pool.query(
          `UPDATE promo_codes SET 
            description = COALESCE($1, description),
            discount_type = $2,
            discount_cents = COALESCE($3, discount_cents),
            discount_percent = COALESCE($4, discount_percent),
            min_order_cents = COALESCE($5, min_order_cents),
            first_order_only = $6,
            expires_at = COALESCE($7::timestamptz, expires_at),
            source = $8,
            verified_at = NOW(),
            is_active = true
          WHERE id = $9`,
          [
            code.description, code.discountType,
            code.discountCents || null, code.discountPercent || null,
            code.minOrderCents || null, code.firstOrderOnly,
            code.expiresAt || null, code.source,
            existing.rows[0].id,
          ]
        );
        updated++;
      } else {
        await pool.query(
          `INSERT INTO promo_codes (platform, code, description, discount_type, discount_cents, discount_percent, min_order_cents, max_discount_cents, first_order_only, expires_at, source, verified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamptz, $11, NOW())`,
          [
            code.platform, code.code, code.description, code.discountType,
            code.discountCents || null, code.discountPercent || null,
            code.minOrderCents || 0, code.maxDiscountCents || null,
            code.firstOrderOnly, code.expiresAt || null, code.source,
          ]
        );
        inserted++;
      }
    }

    // Deactivate codes that haven't been seen in 7 days
    const { rowCount } = await pool.query(
      "UPDATE promo_codes SET is_active = false WHERE verified_at < NOW() - INTERVAL '7 days' AND is_active = true"
    );
    if (rowCount && rowCount > 0) {
      console.log(`\n🗑️ Deactivated ${rowCount} stale codes`);
    }

  } finally {
    await pool.end();
  }

  return { inserted, updated };
}

// ─── API-based scraper (runs from eddy.delivery) ──────────────

async function scrapeViaApi(): Promise<PromoCode[]> {
  // This version uses the eddy.delivery API to avoid needing direct DB access
  // Useful for running from the sandbox or as a scheduled task
  const codes = await scrapeAllSources();
  
  if (codes.length > 0) {
    const adminKey = process.env.ADMIN_KEY;
    if (adminKey) {
      const res = await fetch('https://eddy.delivery/api/promos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ promos: codes }),
      });
      const result = await res.json();
      console.log(`\nAPI upsert: ${JSON.stringify(result)}`);
    }
  }

  return codes;
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('🌊 Eddy Promo Code Scraper');
  console.log('==========================\n');

  const codes = await scrapeAllSources();

  console.log(`\n📊 Summary: Found ${codes.length} promo codes`);
  for (const platform of PLATFORMS) {
    const platformCodes = codes.filter(c => c.platform === platform);
    console.log(`  ${platform}: ${platformCodes.length} codes`);
    for (const c of platformCodes) {
      console.log(`    ${c.code}: ${c.description} (${c.discountType}, source: ${c.source})`);
    }
  }

  if (codes.length > 0) {
    console.log('\n💾 Saving to database...');
    const { inserted, updated } = await upsertCodes(codes);
    console.log(`  Inserted: ${inserted}, Updated: ${updated}`);
  } else {
    console.log('\n⚠️ No codes found — sources may be blocking or patterns need updating');
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
