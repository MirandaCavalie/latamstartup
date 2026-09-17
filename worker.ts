import handler from 'vinext/server/fetch-handler';

interface AppEnv {
  DB: D1Database;
  FORM_RATE_LIMIT: RateLimit;
  TOTAL_RATE_LIMIT: RateLimit;
  COLLECTION_ENABLED: string;
  PRIVACY_CONTACT_EMAIL: string;
}

function secure(response: Response, api: boolean) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000');
  // React SSR emits inline scripts; preserve hydration, disallow plugins/framing.
  headers.set('Content-Security-Policy', "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  if (api) headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: AppEnv, ctx: ExecutionContext) {
    const api = new URL(request.url).pathname.startsWith('/api/');
    if (api) {
      if (!['POST', 'DELETE'].includes(request.method)) return secure(Response.json({ error: 'Método no permitido.' }, { status: 405 }), true);
      if (request.method === 'POST' && (env.COLLECTION_ENABLED !== 'true' || !env.PRIVACY_CONTACT_EMAIL)) return secure(Response.json({ error: 'Los formularios aún no están disponibles. Puedes explorar y hacer tu match sin compartir datos.' }, { status: 503 }), true);
      // Coarse anonymous abuse safeguard. Shared networks may hit this limit.
      // IPs are not persisted in our database or application logs.
      const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
      if (!env.FORM_RATE_LIMIT || !env.TOTAL_RATE_LIMIT) return secure(Response.json({ error: 'Protección de formularios no disponible.' }, { status: 503 }), true);
      try {
        const [perIp, overall] = await Promise.all([
          env.FORM_RATE_LIMIT.limit({ key: `forms:${ip}` }),
          env.TOTAL_RATE_LIMIT.limit({ key: 'forms' }),
        ]);
        if (!perIp.success || !overall.success) return secure(Response.json({ error: 'Demasiados intentos. Espera un minuto e inténtalo otra vez.' }, { status: 429, headers: { 'Retry-After': '60' } }), true);
      } catch {
        return secure(Response.json({ error: 'Protección de formularios no disponible.' }, { status: 503 }), true);
      }
    }
    return secure(await handler.fetch(request, env, ctx), api);
  },
  async scheduled(_event: ScheduledController, env: AppEnv) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM match_profiles WHERE updated_at < datetime('now', '-12 months')"),
      env.DB.prepare("DELETE FROM subscribers WHERE consent_at < datetime('now', '-24 months')"),
      env.DB.prepare("DELETE FROM suggestions WHERE created_at < datetime('now', '-12 months')"),
    ]);
  },
};
