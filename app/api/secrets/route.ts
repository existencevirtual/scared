import { NextRequest, NextResponse } from 'next/server';
import { createSecret } from '@/lib/secrets';

/**
 * POST /api/secrets
 * Creates an AES-256-GCM encrypted secret and returns its ID and decryption key.
 * Body: { secret: string, ttl?: number (minutes, max 10080) }
 * Response 200: { id: string, key: string }
 * Response 400: { error: string }
 */
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
