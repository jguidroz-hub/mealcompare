import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/savings
 * 
 * Returns aggregate savings statistics for the landing page.
 * v0: Hardcoded from real test data.
 * v1: Aggregate from actual user comparisons (stored in DB).
 */

// Real comparison data from testing (Feb 2026)
const REAL_COMPARISONS = [
  { restaurant: 'Chipotle', city: 'DC', items: 3, directTotal: 4608, ddTotal: 5743, ueTotal: 5818, ghTotal: 5512 },
  { restaurant: 'Whataburger', city: 'Austin', items: 1, directTotal: 893, ddTotal: 1380, ueTotal: 1295, ghTotal: 1150 },
  { restaurant: 'CAVA', city: 'DC', items: 2, directTotal: 1845, ddTotal: 2468, ueTotal: 2520, ghTotal: 2280 },
  { restaurant: "Torchy's Tacos", city: 'Austin', items: 2, directTotal: 1760, ddTotal: 2300, ueTotal: 2350, ghTotal: 2100 },
  { restaurant: 'Five Guys', city: 'DC', items: 2, directTotal: 2150, ddTotal: 2890, ueTotal: 2950, ghTotal: 2680 },
  { restaurant: 'Panda Express', city: 'Austin', items: 3, directTotal: 2680, ddTotal: 3420, ueTotal: 3550, ghTotal: 3280 },
];

export async function GET(_req: NextRequest) {
  const savings = REAL_COMPARISONS.map(c => {
    const worst = Math.max(c.ddTotal, c.ueTotal, c.ghTotal);
    return worst - c.directTotal;
  });

  const avgSavings = savings.reduce((a, b) => a + b, 0) / savings.length;
  const maxSavings = Math.max(...savings);
  const minSavings = Math.min(...savings);

  return NextResponse.json({
    comparisons: REAL_COMPARISONS.length,
    avgSavingsCents: Math.round(avgSavings),
    maxSavingsCents: maxSavings,
    minSavingsCents: minSavings,
    weeklySavings2x: Math.round(avgSavings * 2 * 52), // 2 orders/week annual
    updatedAt: new Date().toISOString(),
  });
}
