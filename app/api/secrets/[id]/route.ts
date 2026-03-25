import { NextRequest, NextResponse } from 'next/server';
import { readAndDestroySecret, secretExists } from '@/lib/secrets';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const exists = secretExists(params.id);
  return NextResponse.json({ exists });
}

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
