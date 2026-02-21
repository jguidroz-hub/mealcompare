import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * POST /api/promos/scrape — Trigger a promo code scrape
 * Protected by ADMIN_KEY.
 * 
 * Fetches known coupon aggregator pages, extracts promo codes,
 * and upserts them into the promo_codes table.
 */

const SOURCES: Array<{ platform: string; url: string; name: string }> = [
  // SimplyCodes (best — shows actual codes + verification data)
  { platform: 'doordash', url: 'https://simplycodes.com/store/doordash.com', name: 'simplycodes' },
  { platform: 'ubereats', url: 'https://simplycodes.com/store/ubereats.com', name: 'simplycodes' },
  { platform: 'grubhub', url: 'https://simplycodes.com/store/grubhub.com', name: 'simplycodes' },
  // CouponFollow (good descriptions, hides codes)
  { platform: 'doordash', url: 'https://couponfollow.com/site/doordash.com', name: 'couponfollow' },
  { platform: 'ubereats', url: 'https://couponfollow.com/site/ubereats.com', name: 'couponfollow' },
  { platform: 'grubhub', url: 'https://couponfollow.com/site/grubhub.com', name: 'couponfollow' },
];

// Common promo code context patterns
const PROMO_PATTERNS = [
  /(?:promo|coupon|discount|offer)\s*(?:code)?[:\s]+["']?([A-Z0-9]{4,20})["']?/gi,
  /(?:code|use|enter|apply)[:\s]+["']?([A-Z0-9]{4,20})["']?/gi,
  /["']([A-Z0-9]{4,20})["']\s*(?:for|to get|saves?)/gi,
  // SimplyCodes format: "reported promo code PRICE40 as working"
  /(?:promo\s*code|code)\s+([A-Z0-9]{4,20})\s+(?:as\s+working|for|at)/gi,
  // SimplyCodes format: "added promo code XPDPFQ for DoorDash"
  /added\s+(?:promo\s*)?code\s+([A-Z0-9]{4,20})/gi,
];

const VALUE_PATTERNS = {
  fixedOff: /\$(\d+(?:\.\d{2})?)\s*off/i,
  percentOff: /(\d+)%\s*off/i,
  freeDelivery: /free\s*delivery/i,
  minOrder: /(?:min(?:imum)?|orders?\s*(?:of|over|above))\s*\$(\d+)/i,
  firstOrder: /(?:first|new)\s*(?:order|user|customer)/i,
};

const BLACKLIST = new Set([
  'HTTPS', 'HTML', 'JSON', 'NULL', 'TRUE', 'FALSE', 'NONE',
  'FREE', 'SAVE', 'CODE', 'DEAL', 'BEST', 'SHOP', 'SALE',
  'HOME', 'MENU', 'FOOD', 'CART', 'ORDER', 'CLICK', 'HERE',
  'MORE', 'VIEW', 'SHOW', 'HIDE', 'NEXT', 'BACK', 'CLOSE',
  'SIGN', 'JOIN', 'EARN', 'SEND', 'COPY', 'SHARE', 'PRINT',
  'DOORDASH', 'UBEREATS', 'GRUBHUB', 'UBER', 'EATS',
  'REDDIT', 'PROMO', 'COUPON', 'DISCOUNT', 'OFFER',
]);

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

interface FoundCode {
  platform: string;
  code: string;
  description: string;
  discountType: string;
  discountCents?: number;
  discountPercent?: number;
  minOrderCents?: number;
  firstOrderOnly: boolean;
  source: string;
}

function extractCodes(text: string, platform: string, source: string): FoundCode[] {
  const codes: FoundCode[] = [];
  const seen = new Set<string>();

  for (const pattern of PROMO_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const code = match[1].toUpperCase();
      if (code.length < 4 || code.length > 20 || BLACKLIST.has(code) || seen.has(code)) continue;
      seen.add(code);

      const ctx = text.substring(Math.max(0, match.index - 200), Math.min(text.length, match.index + 200));

      const promo: FoundCode = {
        platform,
        code,
        description: '',
        discountType: 'fixed',
        firstOrderOnly: false,
        source,
      };

      const fixedMatch = ctx.match(VALUE_PATTERNS.fixedOff);
      const pctMatch = ctx.match(VALUE_PATTERNS.percentOff);
      const freeDelivery = VALUE_PATTERNS.freeDelivery.test(ctx);

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

      const minMatch = ctx.match(VALUE_PATTERNS.minOrder);
      if (minMatch) promo.minOrderCents = Math.round(parseFloat(minMatch[1]) * 100);
      if (VALUE_PATTERNS.firstOrder.test(ctx)) promo.firstOrderOnly = true;

      codes.push(promo);
    }
  }

  return codes;
}

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allCodes: FoundCode[] = [];
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        errors.push(`${source.name}/${source.platform}: HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      const text = stripHtml(html);
      const codes = extractCodes(text, source.platform, source.name);

      for (const c of codes) {
        const key = `${c.platform}:${c.code}`;
        if (!seen.has(key)) {
          seen.add(key);
          allCodes.push(c);
        }
      }
    } catch (err: any) {
      errors.push(`${source.name}/${source.platform}: ${err.message}`);
    }
  }

  // Upsert to DB
  const pool = getPool();
  let inserted = 0;
  let updated = 0;

  for (const code of allCodes) {
    const existing = await pool.query(
      'SELECT id FROM promo_codes WHERE platform = $1 AND code = $2',
      [code.platform, code.code]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE promo_codes SET 
          description = COALESCE($1, description),
          discount_type = $2,
          discount_cents = COALESCE($3, discount_cents),
          discount_percent = COALESCE($4, discount_percent),
          min_order_cents = COALESCE($5, min_order_cents),
          first_order_only = $6,
          source = $7,
          verified_at = NOW(),
          is_active = true
        WHERE id = $8`,
        [
          code.description, code.discountType,
          code.discountCents || null, code.discountPercent || null,
          code.minOrderCents || null, code.firstOrderOnly,
          code.source, existing.rows[0].id,
        ]
      );
      updated++;
    } else {
      await pool.query(
        `INSERT INTO promo_codes (platform, code, description, discount_type, discount_cents, discount_percent, min_order_cents, first_order_only, source, verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          code.platform, code.code, code.description, code.discountType,
          code.discountCents || null, code.discountPercent || null,
          code.minOrderCents || 0, code.firstOrderOnly, code.source,
        ]
      );
      inserted++;
    }
  }

  // Deactivate stale codes
  const stale = await pool.query(
    "UPDATE promo_codes SET is_active = false WHERE verified_at < NOW() - INTERVAL '7 days' AND is_active = true RETURNING id"
  );

  return NextResponse.json({
    ok: true,
    found: allCodes.length,
    inserted,
    updated,
    deactivated: stale.rowCount ?? 0,
    errors: errors.length > 0 ? errors : undefined,
    codes: allCodes.map(c => ({ platform: c.platform, code: c.code, description: c.description })),
  });
}
