/**
 * Full comparison test — exercises the compare API locally with real UE data.
 * Tests menu matching quality across different restaurant types.
 */

const API = 'http://localhost:3001';

interface TestCase {
  restaurant: string;
  metro: string;
  items: Array<{ name: string; price: number; quantity: number }>;
}

const TESTS: TestCase[] = [
  {
    restaurant: 'Chipotle',
    metro: 'dc',
    items: [
      { name: 'Burrito Bowl', price: 1195, quantity: 2 },
      { name: 'Chips & Guacamole', price: 595, quantity: 1 },
    ],
  },
  {
    restaurant: 'Whataburger',
    metro: 'austin',
    items: [
      { name: '#1 Whataburger', price: 693, quantity: 1 },
      { name: 'French Fries Medium', price: 329, quantity: 1 },
    ],
  },
  {
    restaurant: 'Panda Express',
    metro: 'austin',
    items: [
      { name: 'Orange Chicken', price: 1095, quantity: 1 },
      { name: 'Fried Rice', price: 495, quantity: 1 },
    ],
  },
  {
    restaurant: 'Five Guys',
    metro: 'dc',
    items: [
      { name: 'Cheeseburger', price: 1279, quantity: 1 },
      { name: 'Regular Fries', price: 649, quantity: 1 },
    ],
  },
  {
    restaurant: "Torchy's Tacos",
    metro: 'austin',
    items: [
      { name: 'Trailer Park', price: 595, quantity: 2 },
      { name: 'Green Chile Queso', price: 695, quantity: 1 },
    ],
  },
];

function normalizeMenuItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[®™©]/g, '')
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*-\s*delivered\s*/gi, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/#(\d+)\s+/g, '#$1 ')
    .replace(/\s*-\s*/g, ' ')
    .replace(/[^a-z0-9#\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function runTest(test: TestCase): Promise<void> {
  const items = test.items.map(i => ({
    ...i,
    normalizedName: normalizeMenuItemName(i.name),
  }));

  console.log(`\n📍 ${test.restaurant} (${test.metro}) — ${items.length} items`);

  try {
    const res = await fetch(`${API}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePlatform: 'doordash',
        restaurantName: test.restaurant,
        items,
        metro: test.metro,
      }),
    });

    if (!res.ok) {
      console.log(`  ❌ API error: ${res.status}`);
      return;
    }

    const result = await res.json();
    const sortedQuotes = result.quotes.sort((a: any, b: any) => a.fees.total - b.fees.total);

    for (const q of sortedQuotes) {
      const tag = q === sortedQuotes[0] ? '🏆 BEST' : '';
      const conf = q.confidence >= 0.5 ? '✅' : '📊';
      console.log(`  ${conf} ${q.platform.padEnd(10)} $${(q.fees.total / 100).toFixed(2).padStart(7)} (items: $${(q.fees.subtotal / 100).toFixed(2)}, svc: $${(q.fees.serviceFee / 100).toFixed(2)}, del: $${(q.fees.deliveryFee / 100).toFixed(2)}) ${tag}`);
    }

    if (result.savings > 0) {
      console.log(`  💰 Savings: $${(result.savings / 100).toFixed(2)}`);
    }
  } catch (err: any) {
    console.log(`  ❌ Error: ${err.message}`);
  }
}

async function main() {
  console.log('🍔 MealCompare Full Comparison Test\n');
  console.log(`Using API: ${API}`);

  // Check if local API is running
  try {
    await fetch(`${API}/api/health`);
  } catch {
    console.log('\n⚠️  Local API not running. Start with: npm run dev:web');
    console.log('Falling back to production API...\n');
    // Could use production but UE API calls from production are slow
    return;
  }

  for (const test of TESTS) {
    await runTest(test);
    // Rate limit UE API
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n✅ All tests complete');
}

main().catch(console.error);
