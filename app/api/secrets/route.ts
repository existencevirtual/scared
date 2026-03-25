import { NextRequest, NextResponse } from 'next/server';
import { createSecret } from '@/lib/secrets';

export async function POST(req: NextRequest) {
  try {
    const { secret, ttl } = await req.json();
    if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
      return NextResponse.json({ error: 'Secret text is required' }, { status: 400 });
    }
    if (secret.length > 10000) {
      return NextResponse.json({ error: 'Secret too long (max 10,000 characters)' }, { status: 400 });
    }
    const ttlMinutes = Number(ttl) > 0 ? Math.min(Number(ttl), 10080) : 60;
    const { id, key } = createSecret(secret.trim(), ttlMinutes);
    return NextResponse.json({ id, key });
  } catch {
    return NextResponse.json({ error: 'Failed to create secret' }, { status: 500 });
  }
}
