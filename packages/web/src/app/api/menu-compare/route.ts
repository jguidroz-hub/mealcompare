import { NextRequest, NextResponse } from 'next/server';
import { compareChainPrices, findChain } from '@mealcompare/engine/src/ChainMenuScraper';
import { ACTIVE_CHAINS } from '@mealcompare/engine/src/data/chain-menus';

/**
 * GET /api/menu-compare?chain=chipotle&metro=austin
 * 
 * Returns item-level price comparison for a chain across delivery platforms.
 * Phase 2: Menu normalization for top chains.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chainName = searchParams.get('chain');
  const metro = searchParams.get('metro') ?? 'austin';

  if (!chainName) {
    // Return list of supported chains
    return NextResponse.json({
      chains: ACTIVE_CHAINS.map(c => ({
        name: c.chainName,
        slug: c.slug,
        category: c.category,
        itemCount: c.menuItems.length,
      })),
    });
  }

  const chain = findChain(chainName);
  if (!chain) {
    return NextResponse.json(
      { error: `Chain "${chainName}" not found. Use GET /api/menu-compare for supported chains.` },
      { status: 404 }
    );
  }

  try {
    const result = await compareChainPrices(chainName, metro);
    if (!result) {
      return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err) {
    console.error('[menu-compare] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
