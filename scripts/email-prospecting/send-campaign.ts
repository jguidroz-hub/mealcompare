/**
 * SkipTheFee Email Campaign Sender
 * 
 * Uses Resend API to send prospecting emails.
 * Domain: projectgreenbelt.com (verified on Resend)
 * 
 * Usage:
 *   RESEND_API_KEY=xxx npx tsx send-campaign.ts --batch=50 --stage=cold
 *   RESEND_API_KEY=xxx npx tsx send-campaign.ts --batch=50 --stage=followup1
 *   RESEND_API_KEY=xxx npx tsx send-campaign.ts --batch=50 --stage=followup2
 * 
 * CAN-SPAM compliance:
 * - Physical address in footer
 * - Unsubscribe link in every email  
 * - Clear sender identification
 * - Honest subject lines
 * - Honor opt-outs within 10 business days
 */

import fs from 'fs';
import path from 'path';
import { getColdOutreach, getFollowUp1, getFollowUp2 } from './email-templates';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = 'jon@projectgreenbelt.com';
const REPLY_TO = 'jon@projectgreenbelt.com';

const ENRICHED_FILE = path.join(__dirname, 'enriched-restaurants.json');
const SENT_LOG_FILE = path.join(__dirname, 'sent-log.json');
const UNSUBSCRIBE_FILE = path.join(__dirname, 'unsubscribed.json');

interface EnrichedRestaurant {
  name: string;
  metro: string;
  emails: string[];
  website?: string;
  phone?: string;
}

interface SentRecord {
  email: string;
  restaurantName: string;
  metro: string;
  stage: string;
  sentAt: string;
  resendId?: string;
}

const METRO_TO_CITY: Record<string, string> = {
  nyc: 'New York City', la: 'Los Angeles', sf: 'San Francisco',
  dc: 'Washington DC', nola: 'New Orleans', philly: 'Philadelphia',
  chicago: 'Chicago', dallas: 'Dallas', houston: 'Houston',
  phoenix: 'Phoenix', boston: 'Boston', portland: 'Portland',
  sandiego: 'San Diego', miami: 'Miami', atlanta: 'Atlanta',
  pittsburgh: 'Pittsburgh', minneapolis: 'Minneapolis', detroit: 'Detroit',
  tampa: 'Tampa', charlotte: 'Charlotte', nashville: 'Nashville',
  seattle: 'Seattle', stlouis: 'St Louis', baltimore: 'Baltimore',
  milwaukee: 'Milwaukee', denver: 'Denver', austin: 'Austin',
  raleigh: 'Raleigh', indianapolis: 'Indianapolis', columbus: 'Columbus',
};

async function sendEmail(to: string, template: ReturnType<typeof getColdOutreach>, tags: Record<string, string>): Promise<string | null> {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Jon at SkipTheFee <${FROM_EMAIL}>`,
      reply_to: REPLY_TO,
      to: [to],
      subject: template.subject,
      html: template.htmlBody.replace('{{unsubscribe_url}}', 
        `https://skipthefee.app/unsubscribe?email=${encodeURIComponent(to)}`),
      text: template.textBody,
      tags: Object.entries(tags).map(([name, value]) => ({ name, value })),
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`  Failed to send to ${to}: ${err}`);
    return null;
  }

  const data = await resp.json();
  return data.id;
}

async function main() {
  const args = process.argv.slice(2);
  const batchSize = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '10');
  const stage = args.find(a => a.startsWith('--stage='))?.split('=')[1] || 'cold';
  const dryRun = args.includes('--dry-run');

  // Load data
  const enriched: EnrichedRestaurant[] = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf8'));
  const sentLog: SentRecord[] = fs.existsSync(SENT_LOG_FILE) 
    ? JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf8')) 
    : [];
  const unsubscribed: string[] = fs.existsSync(UNSUBSCRIBE_FILE)
    ? JSON.parse(fs.readFileSync(UNSUBSCRIBE_FILE, 'utf8'))
    : [];

  // Filter: has email, not unsubscribed, not already sent this stage
  const sentEmails = new Set(sentLog.filter(s => s.stage === stage).map(s => s.email));
  const unsubSet = new Set(unsubscribed.map(e => e.toLowerCase()));
  
  const eligible = enriched.filter(r => 
    r.emails.length > 0 && 
    !unsubSet.has(r.emails[0].toLowerCase()) &&
    !sentEmails.has(r.emails[0])
  );

  console.log(`Stage: ${stage}`);
  console.log(`Eligible restaurants: ${eligible.length}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Dry run: ${dryRun}\n`);

  const batch = eligible.slice(0, batchSize);
  let sent = 0, failed = 0;

  for (const restaurant of batch) {
    const email = restaurant.emails[0];
    const city = METRO_TO_CITY[restaurant.metro] || restaurant.metro;
    
    // Get appropriate template
    const template = stage === 'cold' 
      ? getColdOutreach(restaurant.name, city)
      : stage === 'followup1'
        ? getFollowUp1(restaurant.name, city)
        : getFollowUp2(restaurant.name, city);

    if (dryRun) {
      console.log(`[DRY RUN] Would send "${template.subject}" to ${email}`);
      sent++;
      continue;
    }

    process.stdout.write(`Sending to ${email} (${restaurant.name})... `);
    const resendId = await sendEmail(email, template, { 
      stage, 
      metro: restaurant.metro, 
      restaurant: restaurant.name 
    });

    if (resendId) {
      sent++;
      sentLog.push({
        email,
        restaurantName: restaurant.name,
        metro: restaurant.metro,
        stage,
        sentAt: new Date().toISOString(),
        resendId,
      });
      console.log(`✅ ${resendId}`);
    } else {
      failed++;
    }

    // Rate limit: 2/second max on Resend free tier
    await new Promise(r => setTimeout(r, 600));
  }

  // Save sent log
  if (!dryRun) {
    fs.writeFileSync(SENT_LOG_FILE, JSON.stringify(sentLog, null, 2));
  }

  console.log(`\n=== CAMPAIGN RESULTS ===`);
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
  console.log(`Remaining eligible: ${eligible.length - batch.length}`);
}

main().catch(console.error);
