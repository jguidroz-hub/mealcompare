#!/usr/bin/env npx tsx
/**
 * Full demo: Simulate a family dinner order comparison in both metros.
 * This is the pitch script — shows the core value prop with real data.
 */

const API = 'https://mealcompare.vercel.app';

async function compare(restaurant: string, metro: string, items: any[]) {
  const res = await fetch(`${API}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourcePlatform: 'doordash', restaurantName: restaurant, items, metro }),
  });
  return res.json();
}

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║               🍔  MealCompare Demo  🍔                      ║
║          "Kayak for Food Delivery"                           ║
║                                                              ║
║  Same food. Same restaurants. Different prices.              ║
║  We show you the cheapest way to order.                      ║
╚══════════════════════════════════════════════════════════════╝
`);

  // ── Scenario 1: Family dinner in DC ──
  console.log('━━━ SCENARIO 1: Family Dinner in DC ━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Restaurant: Shake Shack');
  console.log('Order: 2 ShackBurgers, 2 Fries, 2 Shakes\n');

  const dc = await compare('Shake Shack', 'dc', [
    { name: 'ShackBurger', normalizedName: 'shackburger', price: 799, quantity: 2 },
    { name: 'Fries', normalizedName: 'fries', price: 499, quantity: 2 },
    { name: 'Shake', normalizedName: 'shake', price: 649, quantity: 2 },
  ]);

  printResult(dc);

  await new Promise(r => setTimeout(r, 1500));

  // ── Scenario 2: Quick lunch in Austin ──
  console.log('\n━━━ SCENARIO 2: Quick Lunch in Austin ━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Restaurant: Chipotle');
  console.log('Order: 1 Burrito Bowl, 1 Chips & Guac\n');

  const atx = await compare('Chipotle', 'austin', [
    { name: 'Burrito Bowl', normalizedName: 'burrito bowl', price: 1175, quantity: 1 },
    { name: 'Chips & Guacamole', normalizedName: 'chips guacamole', price: 595, quantity: 1 },
  ]);

  printResult(atx);

  await new Promise(r => setTimeout(r, 1500));

  // ── Scenario 3: Office lunch in DC ──
  console.log('\n━━━ SCENARIO 3: Team Lunch in DC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Restaurant: CAVA');
  console.log('Order: 4 Bowls, 2 Pita Chips\n');

  const team = await compare('CAVA', 'dc', [
    { name: 'Greens + Grains Bowl', normalizedName: 'greens grains bowl', price: 1295, quantity: 4 },
    { name: 'Pita Chips', normalizedName: 'pita chips', price: 349, quantity: 2 },
  ]);

  printResult(team);

  // ── Summary ──
  const totalSavings = dc.savings + atx.savings + team.savings;
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  💰 Total savings across 3 orders: ${fmt(totalSavings).padEnd(28)}║
║                                                              ║
║  Average American orders delivery 3x/week.                   ║
║  At ${fmt(Math.round(totalSavings / 3))}/order savings, that's ${fmt(Math.round(totalSavings / 3 * 3 * 52))}/year.              ║
║                                                              ║
║  MealCompare: Free Chrome extension.                         ║
║  Install: mealcompare.vercel.app                             ║
╚══════════════════════════════════════════════════════════════╝
`);
}

function printResult(data: any) {
  const sorted = data.quotes.sort((a: any, b: any) => a.fees.total - b.fees.total);
  const cheapest = sorted[0].fees.total;
  const expensive = sorted[sorted.length - 1].fees.total;

  for (const q of sorted) {
    const f = q.fees;
    const isBest = q === sorted[0];
    const conf = q.confidence >= 0.5 ? '✅' : '📊';
    const platform = q.platform.toUpperCase().padEnd(10);
    const total = fmt(f.total).padEnd(8);
    const breakdown = `Items: ${fmt(f.subtotal)} | Service: ${fmt(f.serviceFee)} | Delivery: ${fmt(f.deliveryFee)}`;
    const tag = isBest ? ' ← CHEAPEST' : ` (+${fmt(f.total - cheapest)})`;
    
    console.log(`  ${conf} ${platform} ${total} ${tag}`);
    console.log(`     ${breakdown}`);
  }
  console.log(`\n  💰 Savings: ${fmt(data.savings)} per order`);
}

main().catch(console.error);
