import { NextRequest, NextResponse } from 'next/server';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Click tracking API — logs every outbound click to a direct ordering URL.
 * POST /api/click
 * Body: { restaurant, slug, metro, platform, directUrl, source }
 * 
 * This data is the currency for Toast/Owner.com partnership conversations.
 * "We drove X clicks to Toast restaurants in Y metros last month."
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurant, slug, metro, platform, directUrl, source } = body;

    if (!restaurant || !directUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      restaurant,
      slug: slug || '',
      metro: metro || '',
      platform: platform || 'unknown',
      directUrl,
      source: source || 'web', // 'web' | 'extension' | 'search'
      userAgent: req.headers.get('user-agent')?.slice(0, 100) || '',
      referer: req.headers.get('referer') || '',
    };

    // Append to daily log file (simple, no DB needed yet)
    const logDir = join(process.cwd(), 'logs');
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
    const dateStr = new Date().toISOString().split('T')[0];
    appendFileSync(join(logDir, `clicks-${dateStr}.jsonl`), JSON.stringify(logEntry) + '\n');

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
