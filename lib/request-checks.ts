export function sameOriginJson(request: Request): boolean {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return false;
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function readSmallJson(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 3000) return null;
  const raw = await request.text();
  if (raw.length > 3000) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch { return null; }
}
