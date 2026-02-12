#!/usr/bin/env npx tsx
/**
 * Demo: Run comparisons on popular orders across both metros.
 * Shows the real savings MealCompare provides.
 */

const API = process.argv[2] || 'https://mealcompare.vercel.app';

interface Order {
  restaurant: string;
  metro: string;
  items: Array<{ name: string; normalizedName: string; price: number; quantity: number }>;
}

const ORDERS: Order[] = [
  {
    restaurant: 'Chipotle',
    metro: 'austin',
    items: [
      { name: 'Burrito Bowl', normalizedName: 'burrito bowl', price: 1175, quantity: 2 },
      { name: 'Chips & Guacamole', normalizedName: 'chips guacamole', price: 595, quantity: 1 },
    ],
  },
  {
    restaurant: 'Chick-fil-A',
    metro: 'austin',
    items: [
      { name: 'Chick-fil-A Deluxe Sandwich', normalizedName: 'chick fil a deluxe sandwich', price: 649, quantity: 2 },
      { name: 'Waffle Fries Medium', normalizedName: 'waffle fries medium', price: 279, quantity: 2 },
      { name: 'Lemonade Medium', normalizedName: 'lemonade medium', price: 249, quantity: 2 },
    ],
  },
  {
    restaurant: 'Wingstop',
    metro: 'dc',
    items: [
      { name: '20 Piece Pack', normalizedName: '20 piece pack', price: 2499, quantity: 1 },
      { name: 'Large Fries', normalizedName: 'large fries', price: 499, quantity: 1 },
    ],
  },
  {
    restaurant: 'CAVA',
    metro: 'dc',
    items: [
      { name: 'Greens + Grains Bowl', normalizedName: 'greens grains bowl', price: 1295, quantity: 2 },
      { name: 'Pita Chips', normalizedName: 'pita chips', price: 349, quantity: 1 },
    ],
  },
  {
    restaurant: 'Shake Shack',
    metro: 'austin',
    items: [
      { name: 'ShackBurger', normalizedName: 'shackburger', price: 799, quantity: 2 },
      { name: 'Cheese Fries', normalizedName: 'cheese fries', price: 599, quantity: 1 },
      { name: 'Shake', normalizedName: 'shake', price: 649, quantity: 2 },
    ],
  },
];

async function runComparison(order: Order): Promise<void> {
  const res = await fetch(`${API}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourcePlatform: 'doordash',
      restaurantName: order.restaurant,
      items: order.items,
      metro: order.metro,
    }),
  });

  if (!res.ok) {
    console.log(`  ❌ API error: ${res.status}`);
    return;
  }

  const data = await res.json();
  const sourceTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  console.log(`\n📍 ${order.restaurant} (${order.metro.toUpperCase()}) — ${order.items.length} items, cart ~$${(sourceTotal / 100).toFixed(2)}`);

  const sorted = data.quotes.sort((a: any, b: any) => a.fees.total - b.fees.total);
  for (const q of sorted) {
    const f = q.fees;
    const isBest = q === sorted[0];
    const conf = q.confidence >= 0.5 ? '✅' : '📊';
    const tag = isBest ? ' ← BEST' : '';
    const diff = isBest ? '' : ` (+$${((f.total - sorted[0].fees.total) / 100).toFixed(2)})`;
    console.log(`  ${conf} ${q.platform.padEnd(10)} $${(f.total / 100).toFixed(2)}${diff}${tag}`);
  }
  console.log(`  💰 Max savings: $${(data.savings / 100).toFixed(2)}`);
}

async function main() {
  console.log('🍔 MealCompare Demo — Real Price Comparisons\n');
  console.log(`API: ${API}`);
  console.log('═'.repeat(55));

  for (const order of ORDERS) {
    await runComparison(order);
    await new Promise(r => setTimeout(r, 1000)); // Rate limit
  }

  console.log('\n' + '═'.repeat(55));
  console.log('Done. All comparisons use real Uber Eats prices.\n');
}

main().catch(console.error);
