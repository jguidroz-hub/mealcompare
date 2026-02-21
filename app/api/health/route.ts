import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const startTime = Date.now();

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: process.env.APP_VERSION || '0.3.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
  });
}
