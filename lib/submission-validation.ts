import { atlasCountries } from './atlas.ts';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const countries = new Set([...atlasCountries.map((country) => country.name), 'Latinoamérica', 'Global']);
const kinds = new Set(['programa', 'aceleradora', 'fellowship', 'recurso', 'otro']);

export function validEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && emailPattern.test(email) ? email : null;
}

export type SuggestedProgram = {
  name: string;
  officialUrl: string;
  country: string;
  kind: string;
  note: string;
  replyEmail: string | null;
};

export function validSuggestion(input: unknown): SuggestedProgram | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const data = input as Record<string, unknown>;
  if (typeof data.name !== 'string' || typeof data.officialUrl !== 'string' ||
      typeof data.country !== 'string' || typeof data.kind !== 'string' ||
      typeof data.note !== 'string') return null;
  const name = data.name.trim();
  const country = data.country.trim();
  const kind = data.kind.trim();
  const note = data.note.trim();
  if (name.length < 2 || name.length > 120 || !countries.has(country) ||
      !kinds.has(kind) || note.length > 600) return null;
  let officialUrl: URL;
  try { officialUrl = new URL(data.officialUrl.trim()); } catch { return null; }
  if (officialUrl.protocol !== 'https:' || !officialUrl.hostname.includes('.') ||
      officialUrl.username || officialUrl.password || officialUrl.href.length > 500) return null;
  const replyEmail = data.replyEmail ? validEmail(data.replyEmail) : null;
  if (data.replyEmail && !replyEmail) return null;
  return { name, officialUrl: officialUrl.href, country, kind, note, replyEmail };
}
