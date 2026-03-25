import crypto from 'crypto';

interface SecretEntry {
  encryptedData: string;
  iv: string;
  authTag: string;
  key: string;
  expiresAt: number;
  viewed: boolean;
}

// In-memory store
const store = new Map<string, SecretEntry>();

// Cleanup expired secrets every minute
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, id) => {
    if (entry.expiresAt < now || entry.viewed) {
      store.delete(id);
    }
  });
}, 60_000);

export function createSecret(plaintext: string, ttlMinutes: number = 60): { id: string; key: string } {
  const id = crypto.randomBytes(16).toString('hex');
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  store.set(id, {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
    key: key.toString('hex'),
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    viewed: false,
  });
  
  return { id, key: key.toString('hex') };
}

export function readAndDestroySecret(id: string, keyHex: string): string | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (entry.viewed) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(id);
    return null;
  }
  if (entry.key !== keyHex) return null;
  
  try {
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(entry.iv, 'hex');
    const authTag = Buffer.from(entry.authTag, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(entry.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Mark as viewed and schedule deletion
    entry.viewed = true;
    store.delete(id);
    
    return decrypted;
  } catch {
    return null;
  }
}

export function secretExists(id: string): boolean {
  const entry = store.get(id);
  if (!entry) return false;
  if (entry.viewed || Date.now() > entry.expiresAt) {
    store.delete(id);
    return false;
  }
  return true;
}
