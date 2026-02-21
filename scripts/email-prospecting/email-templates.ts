/**
 * Email Templates for Eddy Restaurant Prospecting
 * 
 * 3-email sequence:
 * 1. Cold outreach (Day 0)
 * 2. Follow-up with data (Day 3)
 * 3. Final nudge (Day 7)
 */

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export function getColdOutreach(restaurantName: string, city: string): EmailTemplate {
  return {
    subject: `${restaurantName} — are you losing 30% on every delivery order?`,
    htmlBody: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hi there,</p>
  
  <p>I'm reaching out because I noticed <strong>${restaurantName}</strong> in ${city} doesn't appear to have direct online ordering set up.</p>
  
  <p>That means every order through DoorDash, Uber Eats, or Grubhub is costing you <strong>15-35% in commissions</strong>. On a $40 order, that's $6-14 going straight to the delivery app — not your kitchen.</p>
  
  <p><strong>The fix takes about a week:</strong> Platforms like <a href="https://chownow.partnerlinks.io/wd7qfk394fwq" style="color: #2563eb;">ChowNow</a> and Toast let you accept orders directly from your own website or app — same convenience for customers, but you keep the margin.</p>
  
  <p>We run <a href="https://eddy.delivery" style="color: #2563eb;">Eddy</a>, a directory that helps diners find restaurants with direct ordering. We'd love to list ${restaurantName} — but first you need a direct ordering link.</p>
  
  <p><strong>Want a free consultation on getting set up?</strong> Just reply to this email and I'll connect you with the right platform for your needs. No cost, no obligation.</p>
  
  <p>Best,<br>
  Jon Guidroz<br>
  <a href="https://eddy.delivery" style="color: #2563eb;">Eddy</a> — Helping restaurants keep more of every order</p>
  
  <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    You're receiving this because ${restaurantName} is listed in our restaurant database without a direct ordering URL. 
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </p>
</div>`,
    textBody: `Hi there,

I'm reaching out because I noticed ${restaurantName} in ${city} doesn't appear to have direct online ordering set up.

That means every order through DoorDash, Uber Eats, or Grubhub is costing you 15-35% in commissions. On a $40 order, that's $6-14 going straight to the delivery app — not your kitchen.

The fix takes about a week: Platforms like ChowNow and Toast let you accept orders directly from your own website or app — same convenience for customers, but you keep the margin.

We run Eddy (https://eddy.delivery), a directory that helps diners find restaurants with direct ordering. We'd love to list ${restaurantName} — but first you need a direct ordering link.

Want a free consultation on getting set up? Just reply to this email and I'll connect you with the right platform for your needs. No cost, no obligation.

Best,
Jon Guidroz
Eddy — Helping restaurants keep more of every order

---
You're receiving this because ${restaurantName} is listed in our restaurant database without a direct ordering URL. Reply STOP to unsubscribe.`,
  };
}

export function getFollowUp1(restaurantName: string, city: string): EmailTemplate {
  return {
    subject: `Quick math: What ${restaurantName} could save on delivery fees`,
    htmlBody: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hi again,</p>
  
  <p>I sent a note a few days ago about direct ordering for ${restaurantName}. Quick follow-up with some numbers:</p>
  
  <p><strong>If you do 20 delivery orders/day at $35 average:</strong></p>
  <ul style="line-height: 1.8;">
    <li>Through DoorDash (30% fee): You lose <strong>$210/day → $6,300/month</strong></li>
    <li>Through your own site (0% fee): You keep <strong>all of it</strong></li>
    <li>Annual savings: <strong>$75,600</strong></li>
  </ul>
  
  <p>Even if half your delivery customers switch to direct ordering, that's <strong>$37,800/year</strong> back in your pocket.</p>
  
  <p>Setting up takes a week, costs $0-99/month depending on the platform, and most restaurants see ROI in the first month.</p>
  
  <p><strong>Want me to run the numbers for ${restaurantName} specifically?</strong> Just reply and I'll put together a custom savings estimate.</p>
  
  <p>Best,<br>
  Jon Guidroz<br>
  <a href="https://eddy.delivery" style="color: #2563eb;">Eddy</a></p>
  
  <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </p>
</div>`,
    textBody: `Hi again,

I sent a note a few days ago about direct ordering for ${restaurantName}. Quick follow-up with some numbers:

If you do 20 delivery orders/day at $35 average:
- Through DoorDash (30% fee): You lose $210/day → $6,300/month
- Through your own site (0% fee): You keep all of it
- Annual savings: $75,600

Even if half your delivery customers switch to direct ordering, that's $37,800/year back in your pocket.

Setting up takes a week, costs $0-99/month depending on the platform, and most restaurants see ROI in the first month.

Want me to run the numbers for ${restaurantName} specifically? Just reply and I'll put together a custom savings estimate.

Best,
Jon Guidroz
Eddy (https://eddy.delivery)

---
Reply STOP to unsubscribe.`,
  };
}

export function getFollowUp2(restaurantName: string, city: string): EmailTemplate {
  return {
    subject: `Last note about ${restaurantName}'s delivery fees`,
    htmlBody: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hi,</p>
  
  <p>Last note from me — I know you're busy running a restaurant.</p>
  
  <p>If you ever want to explore direct ordering for ${restaurantName}, here are two platforms I'd recommend:</p>
  
  <ol style="line-height: 2;">
    <li><strong><a href="https://chownow.partnerlinks.io/wd7qfk394fwq" style="color: #2563eb;">ChowNow</a></strong> — No commissions, flat monthly fee. Great for independents.</li>
    <li><strong>Toast</strong> — Full POS + online ordering. Best if you need a POS upgrade too.</li>
  </ol>
  
  <p>Both offer free demos and can have you up and running in a week.</p>
  
  <p>If you set up direct ordering, let us know and we'll feature ${restaurantName} on <a href="https://eddy.delivery" style="color: #2563eb;">Eddy</a> — free exposure to diners looking to order direct.</p>
  
  <p>Wishing you a great service,<br>
  Jon Guidroz<br>
  <a href="https://eddy.delivery" style="color: #2563eb;">Eddy</a></p>
  
  <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </p>
</div>`,
    textBody: `Hi,

Last note from me — I know you're busy running a restaurant.

If you ever want to explore direct ordering for ${restaurantName}, here are two platforms I'd recommend:

1. ChowNow (https://chownow.partnerlinks.io/wd7qfk394fwq) — No commissions, flat monthly fee. Great for independents.
2. Toast — Full POS + online ordering. Best if you need a POS upgrade too.

Both offer free demos and can have you up and running in a week.

If you set up direct ordering, let us know and we'll feature ${restaurantName} on Eddy (https://eddy.delivery) — free exposure to diners looking to order direct.

Wishing you a great service,
Jon Guidroz
Eddy

---
Reply STOP to unsubscribe.`,
  };
}
