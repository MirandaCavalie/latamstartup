# Producción · La Combi

Actualizado: 17/09/2026. Responsable: Miranda Cavalie.

## Arquitectura y estado

- GitHub: `MirandaCavalie/latamstartup`, rama `main`. Código, fichas y logos públicos; ningún registro de visitantes.
- Cloudflare Workers + Static Assets: aplicación `la-combi` en cuenta `0bf0d27309f3760ed9cf10dd111c88bc`.
- D1: `la-combi-production`, ID `ae5a231a-257e-43d8-b302-7a2f6a2a7544`, binding `DB`. Creada en WNAM; no implica residencia exclusiva en LATAM.
- Las tres migraciones de `drizzle/` se aplicaron a la base remota nueva. Las tablas del Site anterior estaban vacías; no se migraron datos de visitantes.
- Estado inicial de este cambio: compilación y pruebas locales aprobadas, publicación pendiente del plan y del contacto de privacidad. `COLLECTION_ENABLED=false` hasta configurar un correo público autorizado. No confundir la carga de assets con un despliegue exitoso.
- El dominio `workers.dev` proporciona HTTPS sin comprar dominio. Obtener la URL final del resultado de `wrangler deploy`; no anunciarla antes de verificarla.
- El Site histórico se conserva privado y no se vuelve a publicar desde este repositorio.

## Decisión construir / contratar / posponer

Se reutiliza el hosting y la base gestionados de Cloudflare en vez de mantener servidores, autenticación o backups propios. El catálogo editorial sigue versionado en GitHub: no necesita un CMS ni migrar a SQL por aumentar países. Un Worker pequeño gestiona consentimiento, validación, bajas y retención, que sí son específicos del producto. El match es local por defecto, sin API de IA.

Para despliegues repetidos se prefiere Workers Builds con acceso solo al repositorio autorizado, si la propietaria aprueba la integración GitHub; mientras tanto, el comando de despliegue manual es suficiente y auditable. No se instala una plataforma de marketing antes de definir campañas. Rúbrica de automatización (5 favorece construir): especificidad 2 para hosting / 4 para formularios; volumen 2; costo de contratar 1; tiempo a valor 4; mantenimiento 2. La conclusión es combinar servicio gestionado y poca lógica propia. A 10× tráfico, revisar costes, índices, bot protection y herramientas editoriales antes de añadir infraestructura.

## Publicar

Node 22.18+ y npm. Desde la raíz del checkout:

```sh
npm ci
npx wrangler login --scopes account:read user:read workers:write workers_scripts:write workers_tail:read d1:write
npx wrangler whoami
npm run deploy
```

Comprobar la cuenta antes de cualquier comando remoto. No copiar tokens OAuth en GitHub ni pedirlos por chat. El flujo oficial los conserva localmente. Las credenciales de CI, si se requieren, deben ir en el gestor de secretos correspondiente, limitadas a esta cuenta y con rotación.

`npm run deploy` ejecuta pruebas, tipos y build; `deploy:built` aplica migraciones pendientes y publica el artefacto generado. No editar `dist/server/wrangler.json`: se regenera desde `wrangler.jsonc`. No editar migraciones aplicadas. Para cambiar tablas: modificar `db/schema.ts`, generar, revisar SQL y probar localmente primero. Los permisos de D1 del despliegue deben permitir aplicar migraciones.

Antes de recibir datos: publicar un correo autorizado en `PRIVACY_CONTACT_EMAIL` y cambiar `COLLECTION_ENABLED` a `true` en la configuración versionada; reconstruir y desplegar. El correo de contacto es público, no una credencial. No activar captura con una dirección ficticia.

### Workers Builds / GitHub

La conexión no existe solo por hacer `git push`. Configurar en Cloudflare → Workers & Pages → la-combi → Settings → Builds:

- Repositorio: solo `MirandaCavalie/latamstartup`; rama de producción `main`; raíz `/`.
- Build command: `npm run check`.
- Deploy command: `npm run deploy:built`.
- No desplegar previews de otras ramas contra D1 de producción. Desactivar builds no productivos o usar una base separada.
- Mantener Node 22.18+ (preferible 24 LTS) y el lockfile. El token de build debe tener Workers Scripts Write y D1 Write de esta cuenta.
- La propietaria debe aprobar la instalación/permisos del GitHub App. No dar acceso a todos sus repositorios.

Hasta verificar un build disparado por commit, considerar despliegue automático **pendiente**, y utilizar `npm run deploy` manualmente.

## Pruebas

```sh
npm run check
npm audit --omit=dev
npm run db:local
npm start -- --port 8787 --var COLLECTION_ENABLED:true --var PRIVACY_CONTACT_EMAIL:privacy@example.invalid
```

En otra terminal, `npm run test:forms`. Solo acepta localhost y usa D1 local. Verifica consentimiento, origen, no lectura pública, duplicados sin reemplazar códigos, match separado del correo, borrado, propuestas, retención y límites. El fixture se borra incluso si falla. Una prueba de ráfaga puede bloquear siguientes pruebas durante un minuto: reiniciar el servidor local antes de repetir. No cambiar este script a producción.

Tras publicar, comprobar por HTTP `/`, `/privacidad`, los assets y que `GET /api/subscribe` no expone datos. No inferir que los formularios funcionan solo porque carga la portada. Las pruebas de esta revisión son de código e integración HTTP/D1, no QA visual de navegador ni auditoría de penetración.

Verificado en esta revisión: 36 pruebas unitarias/regresión, TypeScript y compilación; integración HTTP/D1 local incluida la ejecución del cron y eliminación de fixtures; `npm audit --omit=dev` sin vulnerabilidades conocidas. El lint global aún reporta reglas de componentes UI heredados y convenciones React/Next (por ejemplo navegación HTML y montaje desde localStorage); no se declara un lint limpio ni se desactivan esas reglas para ocultarlo.

## Datos, consentimiento y analítica

- `subscribers`: correo normalizado, consentimiento, versión del aviso, estado `unverified`, hash del código privado para baja. Sin campañas ni validación de propiedad del correo todavía. Un duplicado no reemplaza el código original y devuelve la misma respuesta para no revelar si existe.
- `match_profiles`: país, etapa, tipo, sector, objetivos, IDs recomendados, versión del algoritmo/aviso y fechas. Sin email, nombre, texto libre, IP o user-agent. La casilla de compartir empieza desmarcada. No llamar a estos datos anónimos: combinaciones raras pueden identificar.
- `suggestions`: datos de programa, comentario, correo opcional, consentimiento y estado `pending`. No publicar sin revisión humana. No enviar este correo a campañas.
- Credenciales de baja aleatorias y separadas para newsletter/match. El navegador conserva el código; la base solo su hash SHA-256. Copiar un código otorga capacidad de borrar el registro, por lo que no debe ponerse en URLs, logs ni chats.
- Un perfil guardado por código no equivale a una persona única. Actualizar el match reemplaza el perfil anterior de ese código, no conserva un historial de navegación. Borrar almacenamiento local no elimina automáticamente D1; `/privacidad` ofrece controles separados.

Consultas agregadas para la propietaria, en la consola privada de D1 (no crear endpoints públicos):

```sql
SELECT country_code, count(*) AS perfiles
FROM match_profiles GROUP BY country_code ORDER BY perfiles DESC;

SELECT stage, sector, count(*) AS perfiles
FROM match_profiles GROUP BY stage, sector HAVING count(*) >= 5;

SELECT j.value AS objetivo, count(*) AS perfiles
FROM match_profiles, json_each(match_profiles.needs) AS j
GROUP BY j.value ORDER BY perfiles DESC;

SELECT status, count(*) AS solicitudes FROM subscribers GROUP BY status;
SELECT count(*) AS pendientes FROM suggestions WHERE status='pending';
```

Evitar compartir grupos pequeños o exports de filas individuales. No juntar emails y matches por inferencias de hora u otros datos. Para acceso, corrección o baja por contacto, verificar propiedad proporcionalmente; no borrar por petición de un tercero que solo conozca un email. Sin el código no es posible atribuir de forma fiable un match a una persona. Los formularios públicos no son un panel de administración.

## Seguridad y retención

- Solo POST/DELETE en la API; GET devuelve 405. Origin exacto, tipo JSON, máximo 3000 bytes, campos validados, SQL parametrizado, respuestas sin datos privados y `Cache-Control: no-store`.
- IP usada transitoriamente en el límite de 20 peticiones/minuto; límite general 200/minuto por punto de presencia. No se guarda en D1. Estos límites de Cloudflare son aproximados y locales a sus puntos de presencia, no un techo global de gasto. Redes compartidas pueden recibir 429.
- Honeypot para newsletter y propuestas. No se afirma que sustituya CAPTCHA/verificación; si aparece abuso distribuido, evaluar Turnstile y bloqueo de bots, informar su tratamiento técnico y probar accesibilidad.
- Cabeceras de anti-framing, nosniff, política de referencia y restricciones de cámara/micrófono/geolocalización. La CSP limita objetos/framing/formularios, pero no es una CSP estricta de scripts por la hidratación React; no presentarla como protección XSS completa.
- No logs de cuerpos, correos o códigos. Logs de invocaciones desactivados; registrar solo errores genéricos. Cloudflare procesa metadatos técnicos como proveedor, fuera de las tablas de producto.
- Cron diario 05:17 UTC: elimina matches/propuestas de más de 12 meses y emails de más de 24 meses desde consentimiento. Puede existir hasta un día de demora por la ejecución diaria. Alertar/revisar si falla el cron.
- No cookies publicitarias, píxeles ni SDK de analítica de terceros. LocalStorage recuerda preferencias y códigos; no añadir un «aceptar todo» vacío. Si cambian proveedores/finalidades o se incorpora tracking, reevaluar consentimiento y aviso.
- Revisar el aviso y obligaciones locales con asesoría adecuada antes de campañas o expansión comercial. Esta implementación técnica no certifica cumplimiento legal en todos los países.

## Costes y límites

Workers Free rechazó `limits.cpu_ms=50`; la configuración está preparada para Paid ($5/mes base). Los $5 **no son un techo total**: puede haber consumo adicional por solicitudes, CPU, D1, logs o builds. Configurar avisos de facturación y revisar métricas en Cloudflare. El límite de 50 ms por petición controla CPU por ejecución, no el número de peticiones; ajustarlo solo con medición. Assets estáticos usan la entrega nativa y no requieren ejecutar la app.

El framework actual es vinext beta; mantener una ruta de rollback y vigilar cambios incompatibles. La auditoría de dependencias de producción reportó cero vulnerabilidades conocidas; herramientas de desarrollo pueden tener avisos pendientes. Repetir controles al actualizar. No usar `npm audit fix --force` sin revisión.

## Incidentes y recuperación

1. Detener captura: establecer `COLLECTION_ENABLED=false` y desplegar. Las bajas DELETE siguen funcionando. No borrar la base como mecanismo de pausa.
2. Revertir código: elegir una versión previa verificada en Deployments. No revertir migraciones SQL automáticamente junto con código.
3. D1 Time Travel está habilitado por el servicio: 7 días Free / 30 días Paid. Consultar `npx wrangler d1 time-travel info la-combi-production`. Restaurar sobrescribe datos; requiere aprobación humana y plan para no reactivar bajas ni consentimientos retirados. Una recuperación puede devolver registros previamente eliminados: reconciliar solicitudes de baja antes de reabrir captura/campañas.
4. No exportar copias a GitHub. Guardar exports solo si son necesarios en almacenamiento privado cifrado y eliminarlos tras el propósito; `/backups/`, `.dev.vars*` y `.env*` están ignorados, pero revisar `git diff --cached` igualmente.
5. Si se filtra una credencial, revocarla y rotarla en el proveedor; quitarla del último commit no elimina la exposición histórica. Activar MFA en GitHub/Cloudflare y limitar miembros de la cuenta.

## Referencias

- [Rate limiting de Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Integración con Git](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)
- [Precios de Workers](https://developers.cloudflare.com/workers/platform/pricing/)
