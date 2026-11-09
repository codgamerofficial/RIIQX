// =============================================================================
// RIIQX — Cryptographic Security & Server-Side Session Token Verification
// Supabase Auth Authority • Fail-Closed Secret Validation • Constant-Time Signatures
// =============================================================================

import crypto from 'crypto';

export type { RiiqxUser } from './user';
export { getDefaultUser } from './user';

/**
 * Validates that SESSION_SECRET is configured.
 * Fails closed without hardcoded fallbacks to protect production integrity.
 */
function getRequiredSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.trim() === '' || secret === 'your-session-secret') {
    throw new Error('FATAL SECURITY ERROR: SESSION_SECRET is not configured. Server must fail closed.');
  }
  return secret;
}

/**
 * Creates a cryptographically signed session token for authenticated Supabase users.
 * Requires mandatory SESSION_SECRET; throws error if secret is missing.
 */
export function createSessionToken(userId: string): string {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId provided to createSessionToken');
  }

  const secret = getRequiredSessionSecret();
  const payload = JSON.stringify({
    uid: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(16).toString('hex'),
  });

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return Buffer.from(payload).toString('base64url') + '.' + signature;
}

/**
 * Verifies the cryptographic signature and expiration of a session token.
 * Fails closed if token is invalid, expired, or SESSION_SECRET is missing.
 */
export function verifySessionToken(token: string): { valid: boolean; userId?: string } {
  try {
    if (!token || typeof token !== 'string') return { valid: false };

    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.trim() === '') {
      // Fail closed: without SESSION_SECRET, no custom token can be verified
      return { valid: false };
    }

    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return { valid: false };

    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSig = hmac.digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }

    const data = JSON.parse(payload);
    if (!data.uid || typeof data.uid !== 'string') {
      return { valid: false };
    }

    if (Date.now() > data.exp) {
      return { valid: false };
    }

    return { valid: true, userId: data.uid };
  } catch {
    return { valid: false };
  }
}
