// Caps accepted submissions globally across locations, not the billable traffic.
// One conditional UPSERT makes concurrent admission atomic in D1.
export const DAILY_INTAKE_LIMITS = { subscribe: 200, suggest: 100, match: 1000 } as const;
export type IntakeKind = keyof typeof DAILY_INTAKE_LIMITS;

export const INTAKE_SQL = `INSERT INTO daily_intake (day, kind, used)
  VALUES (date('now'), ?, 1)
  ON CONFLICT(day, kind) DO UPDATE SET used = daily_intake.used + 1
  WHERE daily_intake.used < ?
  RETURNING used`;

export async function reserveIntake(db: D1Database, kind: IntakeKind): Promise<boolean> {
  const row = await db.prepare(INTAKE_SQL).bind(kind, DAILY_INTAKE_LIMITS[kind]).first<{ used: number }>();
  return !!row;
}

export function intakePaused() {
  return Response.json({ error: 'Por seguridad, hoy pausamos la recepción de este formulario. Inténtalo mañana. Puedes seguir explorando y hacer tu match sin compartir respuestas.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z') + 86400000 - Date.now()) / 1000)) } });
}
