import { getDatabase } from '@/db';
import { readSmallJson, sameOriginJson } from '@/lib/request-checks';
import { validSuggestion } from '@/lib/submission-validation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  if (!data) return Response.json({ error: 'Revisa los datos enviados.' }, { status: 400 });
  if (data.website) return Response.json({ ok: true });
  const suggestion = validSuggestion(data);
  if (!suggestion) return Response.json({ error: 'Completa nombre, país, tipo y un enlace oficial HTTPS válido.' }, { status: 400 });
  try {
    await getDatabase().prepare(
      'INSERT INTO suggestions (name, official_url, country, kind, note, reply_email) VALUES (?, ?, ?, ?, ?, ?)',
    ).bind(suggestion.name, suggestion.officialUrl, suggestion.country, suggestion.kind, suggestion.note, suggestion.replyEmail).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Suggestion storage failed', error);
    return Response.json({ error: 'No pudimos guardar la sugerencia ahora. Inténtalo más tarde.' }, { status: 503 });
  }
}
