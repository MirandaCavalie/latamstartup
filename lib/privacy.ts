export const PRIVACY_VERSION = '2026-09-17';
export const MATCH_POLICY_VERSION = 'match-v1';
export const MATCH_TOKEN_KEY = 'lacombi.match-deletion.v1';
export const SUBSCRIBER_TOKEN_KEY = 'lacombi.subscription-deletion.v1';

export function validDeletionToken(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

export async function hashToken(token: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Persist the removal credential BEFORE sending data. If storage is blocked,
// do not upload a profile the visitor would be unable to remove themselves.
export function deletionToken(key: string): string {
  const saved = localStorage.getItem(key);
  if (validDeletionToken(saved)) return saved;
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
  localStorage.setItem(key, token);
  return token;
}
