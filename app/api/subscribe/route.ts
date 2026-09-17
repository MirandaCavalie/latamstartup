import { getDatabase } from '@/db';
import { reserveIntake, intakePaused } from '@/lib/intake-budget';
import { readSmallJson, sameOriginJson } from '@/lib/request-checks';
import { validEmail } from '@/lib/submission-validation';
import { hashToken, PRIVACY_VERSION, validDeletionToken } from '@/lib/privacy';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  if (!data) return Response.json({ error: 'Revisa los datos enviados.' }, { status: 400 });
  if (data.website) return Response.json({ ok: true });
  const email = validEmail(data.email);
  if (!email || data.consent !== true || data.privacyVersion !== PRIVACY_VERSION || !validDeletionToken(data.deletionToken)) return Response.json({ error: 'Escribe un correo válido y acepta recibir novedades. Actualiza la página si el aviso cambió.' }, { status: 400 });
  try {
    if (!await reserveIntake(getDatabase(), 'subscribe')) return intakePaused();
    // Do not replace an existing subscriber's removal credential on re-submit.
    await getDatabase().prepare('INSERT OR IGNORE INTO subscribers (email, source, deletion_hash, privacy_version, status) VALUES (?, ?, ?, ?, ?)').bind(email, 'newsletter', await hashToken(data.deletionToken), PRIVACY_VERSION, 'unverified').run();
    return Response.json({ ok: true });
  } catch {
    console.error('Subscription storage failed');
    return Response.json({ error: 'No pudimos guardar tu correo ahora. Inténtalo más tarde.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  const token = data?.deletionToken;
  if (!validDeletionToken(token)) return Response.json({ error: 'Necesitas el código privado de tu suscripción para eliminarla.' }, { status: 400 });
  try {
    await getDatabase().prepare('DELETE FROM subscribers WHERE deletion_hash = ?').bind(await hashToken(token)).run();
    return Response.json({ ok: true });
  } catch {
    console.error('Unsubscribe storage failed');
    return Response.json({ error: 'No pudimos procesar la baja ahora.' }, { status: 503 });
  }
}
