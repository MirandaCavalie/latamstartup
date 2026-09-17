import { getDatabase } from '@/db';
import { readSmallJson, sameOriginJson } from '@/lib/request-checks';
import { validEmail } from '@/lib/submission-validation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  if (!data) return Response.json({ error: 'Revisa los datos enviados.' }, { status: 400 });
  if (data.website) return Response.json({ ok: true });
  const email = validEmail(data.email);
  if (!email || data.consent !== true) return Response.json({ error: 'Escribe un correo válido y acepta recibir novedades.' }, { status: 400 });
  try {
    await getDatabase().prepare('INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)').bind(email, 'landing').run();
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Subscription storage failed', error);
    return Response.json({ error: 'No pudimos guardar tu correo ahora. Inténtalo más tarde.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  const email = validEmail(data?.email);
  if (!email) return Response.json({ error: 'Escribe un correo válido.' }, { status: 400 });
  try {
    await getDatabase().prepare('DELETE FROM subscribers WHERE email = ?').bind(email).run();
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Unsubscribe storage failed', error);
    return Response.json({ error: 'No pudimos procesar la baja ahora.' }, { status: 503 });
  }
}
