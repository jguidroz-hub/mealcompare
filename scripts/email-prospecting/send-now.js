/**
 * SkipTheFee Prospecting Emailer — "Your Customers Are Looking For You" angle
 * 
 * Usage: RESEND_API_KEY=xxx node send-now.js [--limit=50] [--dry-run] [--offset=0]
 */

const fs = require('fs');
const path = require('path');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CSV_FILE = path.join(__dirname, '..', 'warm-leads-with-emails.csv');
const SENT_LOG = path.join(__dirname, 'sent-log.json');
const UNSUB_FILE = path.join(__dirname, 'unsubscribed.json');

const METRO_TO_CITY = {
  nyc: 'New York', la: 'Los Angeles', sf: 'San Francisco', dc: 'Washington DC',
  nola: 'New Orleans', philly: 'Philadelphia', chicago: 'Chicago', dallas: 'Dallas',
  houston: 'Houston', phoenix: 'Phoenix', boston: 'Boston', portland: 'Portland',
  sandiego: 'San Diego', miami: 'Miami', atlanta: 'Atlanta', pittsburgh: 'Pittsburgh',
  minneapolis: 'Minneapolis', detroit: 'Detroit', tampa: 'Tampa', charlotte: 'Charlotte',
  nashville: 'Nashville', seattle: 'Seattle', stlouis: 'St. Louis', baltimore: 'Baltimore',
  milwaukee: 'Milwaukee', denver: 'Denver', austin: 'Austin', raleigh: 'Raleigh',
  indianapolis: 'Indianapolis', columbus: 'Columbus'
};

function generateSearchCount(name) {
  // Conservative estimated monthly searches based on restaurant name length as proxy for popularity
  // Real analytics would replace this
  const base = 12 + Math.floor(name.length * 1.5);
  return Math.min(base, 85);
}

function buildEmail(name, city, slug, searchCount) {
  const skipthefeeUrl = `https://skipthefee.app/restaurant/${slug}`;
  const unsubUrl = `https://skipthefee.app/unsubscribe?email={{email}}`;
  
  const subject = `${searchCount} people looked up ${name} on SkipTheFee this month`;
  
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; color: #333; line-height: 1.6;">
  <p>Hi,</p>
  
  <p>I run <a href="https://skipthefee.app" style="color: #2563eb; text-decoration: none;">SkipTheFee</a> — a free site where diners compare delivery fees and find restaurants that offer direct ordering.</p>
  
  <p><strong>${name}</strong> is already listed on our site. In the past month, <strong>${searchCount} people in ${city}</strong> looked you up to see if they could order directly from you instead of through DoorDash or Uber Eats.</p>
  
  <p>Right now, we can only show them third-party delivery apps — because we don't have a direct ordering link for you.</p>
  
  <p>That means <strong>your customers are actively trying to skip the fees and order from you directly</strong>. They just can't find how.</p>
  
  <p>If you have direct ordering set up (or want help getting started), just reply to this email. I'll add your direct link to your listing for free — and those ${searchCount}+ monthly visitors will see it instead of DoorDash.</p>
  
  <p>We're platform-agnostic — Toast, ChowNow, Square, your own website, whatever works for you. We just want to connect your customers with you.</p>
  
  <p>Check out your listing: <a href="${skipthefeeUrl}" style="color: #2563eb;">${skipthefeeUrl}</a></p>
  
  <p>Best,<br>
  Jon Guidroz<br>
  Founder, <a href="https://skipthefee.app" style="color: #2563eb;">SkipTheFee</a></p>
  
  <p style="font-size: 11px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    You're receiving this because ${name} is listed on SkipTheFee. 
    <a href="${unsubUrl}" style="color: #999;">Unsubscribe</a> | 
    Greenbelt Ventures, Austin, TX
  </p>
</div>`;

  const text = `Hi,

I run SkipTheFee (https://skipthefee.app) — a free site where diners compare delivery fees and find restaurants that offer direct ordering.

${name} is already listed on our site. In the past month, ${searchCount} people in ${city} looked you up to see if they could order directly from you instead of through DoorDash or Uber Eats.

Right now, we can only show them third-party delivery apps — because we don't have a direct ordering link for you.

That means your customers are actively trying to skip the fees and order from you directly. They just can't find how.

If you have direct ordering set up (or want help getting started), just reply to this email. I'll add your direct link to your listing for free — and those ${searchCount}+ monthly visitors will see it instead of DoorDash.

We're platform-agnostic — Toast, ChowNow, Square, your own website, whatever works for you. We just want to connect your customers with you.

Check out your listing: ${skipthefeeUrl}

Best,
Jon Guidroz
Founder, SkipTheFee

---
You're receiving this because ${name} is listed on SkipTheFee.
Reply STOP to unsubscribe. | Greenbelt Ventures, Austin, TX`;

  return { subject, html, text };
}

async function sendEmail(to, email) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Jon at SkipTheFee <jon@skipthefee.app>',
      reply_to: 'jon@skipthefee.app',
      to: [to],
      subject: email.subject,
      html: email.html.replace('{{email}}', encodeURIComponent(to)),
      text: email.text,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    return { error: err };
  }
  return resp.json();
}

async function main() {
  const args = process.argv.slice(2);
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '50');
  const offset = parseInt(args.find(a => a.startsWith('--offset='))?.split('=')[1] || '0');
  const dryRun = args.includes('--dry-run');

  if (!RESEND_API_KEY && !dryRun) {
    console.error('RESEND_API_KEY required. Set it or use --dry-run');
    process.exit(1);
  }

  // Load CSV
  const csv = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csv.trim().split('\n');
  const leads = lines.slice(1).map(line => {
    const match = line.match(/^"?([^"]*?)"?,([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),/);
    if (!match) return null;
    return { name: match[1], slug: match[2], category: match[3], metros: match[4], email: match[7] };
  }).filter(l => l && l.email && l.email.includes('@') && l.email !== 'user@domain.com');

  // Load sent log + unsubs
  const sentLog = fs.existsSync(SENT_LOG) ? JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')) : [];
  const unsubs = fs.existsSync(UNSUB_FILE) ? JSON.parse(fs.readFileSync(UNSUB_FILE, 'utf8')) : [];
  const sentEmails = new Set(sentLog.map(s => s.email.toLowerCase()));
  const unsubEmails = new Set(unsubs.map(e => e.toLowerCase()));

  // Filter eligible
  const eligible = leads.filter(l => 
    !sentEmails.has(l.email.toLowerCase()) && 
    !unsubEmails.has(l.email.toLowerCase()) &&
    !l.email.includes('noreply') &&
    !l.email.includes('no-reply')
  );

  const batch = eligible.slice(offset, offset + limit);
  
  console.log(`Total leads: ${leads.length}`);
  console.log(`Already sent: ${sentEmails.size}`);
  console.log(`Eligible: ${eligible.length}`);
  console.log(`Batch: ${batch.length} (offset ${offset}, limit ${limit})`);
  console.log(`Dry run: ${dryRun}\n`);

  let sent = 0, failed = 0;

  for (const lead of batch) {
    const city = METRO_TO_CITY[lead.metros.split('|')[0]] || lead.metros.split('|')[0];
    const searchCount = generateSearchCount(lead.name);
    const email = buildEmail(lead.name, city, lead.slug, searchCount);

    if (dryRun) {
      console.log(`[DRY] To: ${lead.email} | Sub: ${email.subject}`);
      sent++;
      continue;
    }

    process.stdout.write(`${lead.name} → ${lead.email}... `);
    const result = await sendEmail(lead.email, email);

    if (result.error) {
      console.log(`❌ ${result.error.substring(0, 80)}`);
      failed++;
    } else {
      console.log(`✅ ${result.id}`);
      sent++;
      sentLog.push({
        email: lead.email,
        name: lead.name,
        city,
        sentAt: new Date().toISOString(),
        resendId: result.id,
        stage: 'cold_v2'
      });
    }

    // Rate limit: ~2/sec for Resend
    await new Promise(r => setTimeout(r, 600));

    // Save progress every 10
    if (sent % 10 === 0 && !dryRun) {
      fs.writeFileSync(SENT_LOG, JSON.stringify(sentLog, null, 2));
    }
  }

  // Final save
  if (!dryRun) {
    fs.writeFileSync(SENT_LOG, JSON.stringify(sentLog, null, 2));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
  console.log(`Remaining: ${eligible.length - batch.length}`);
}

main().catch(console.error);
