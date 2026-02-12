import { NextRequest, NextResponse } from 'next/server';
import { CompareRequest } from '@mealcompare/shared';
import { ComparisonEngine } from '@mealcompare/engine';
import { DoorDashAdapter } from '@mealcompare/engine/dist/adapters/doordash';
import { UberEatsAdapter } from '@mealcompare/engine/dist/adapters/ubereats';
import { GrubhubAdapter } from '@mealcompare/engine/dist/adapters/grubhub';

// Initialize engine with all adapters
const engine = new ComparisonEngine();
engine.registerAdapter(new DoorDashAdapter());
engine.registerAdapter(new UberEatsAdapter());
engine.registerAdapter(new GrubhubAdapter());

export async function POST(req: NextRequest) {
  try {
    const body: CompareRequest = await req.json();

    if (!body.restaurantName || !body.items?.length) {
      return NextResponse.json(
        { error: 'Missing restaurantName or items' },
        { status: 400 }
      );
    }

    const result = await engine.compare(
      body.sourcePlatform,
      body.restaurantName,
      body.items,
      body.deliveryAddress,
      body.metro
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[compare] Error:', err);
    return NextResponse.json(
      { error: 'Comparison failed' },
      { status: 500 }
    );
  }
}
