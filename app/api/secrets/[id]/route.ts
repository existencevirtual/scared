import { NextRequest, NextResponse } from 'next/server';
import { readAndDestroySecret, secretExists } from '@/lib/secrets';

/**
 * GET /api/secrets/[id]
 * Checks whether a secret exists without consuming it.
 * Response 200: { exists: boolean }
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const exists = secretExists(params.id);
  return NextResponse.json({ exists });
}

/**
 * POST /api/secrets/[id]
 * Decrypts and permanently destroys a secret. Can only be called once.
 * Body: { key: string } — the AES decryption key (hex)
 * Response 200: { secret: string }
 * Response 404: { error: string } — not found, already viewed, or expired
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { key } = await req.json();
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    const plaintext = readAndDestroySecret(params.id, key);
    if (plaintext === null) {
      return NextResponse.json({ error: 'Secret not found, already viewed, or expired' }, { status: 404 });
    }
    return NextResponse.json({ secret: plaintext });
  } catch {
    return NextResponse.json({ error: 'Failed to read secret' }, { status: 500 });
  }
}
