import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * POST /api/waitlist
 * Collect email addresses for launch notification.
 * v0: Append to a JSON file. v1: Database.
 */

export async function POST(req: NextRequest) {
  try {
    const { email, metro } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // For now, log to console (Vercel logs) and return success
    // In production: save to DB / send to Resend list
    console.log(`[waitlist] ${email} (${metro ?? 'unknown'})`);

    return NextResponse.json({ ok: true, message: 'You\'re on the list!' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
