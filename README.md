# La Combi

Atlas en español para descubrir oportunidades y recursos para emprender. Proyecto originalmente llamado Mapping y después Chancletazo; conserva su carpeta, URL y preferencias guardadas.

- Entrada visual con globo, acceso sin cuenta dentro de la aplicación y opción voluntaria de recibir novedades; el atlas interactivo sigue después.
- 18 oportunidades de origen peruano, 6 beneficios globales, 18 fichas de México, Colombia, Chile, Argentina y Brasil, y 3 fellowships regionales.
- 20 países en el atlas; los que no tienen fichas aparecen como “Por mapear”.

- 45 fichas editoriales de Estado, universidades, empresas y organizaciones.
- Fellowships e intercambios separados de aceleración e inversión: Puentes (ingeniería, estancia parcialmente cubierta, convocatoria cerrada), YLAI (intercambio en EE. UU., próximo plazo por confirmar) y Makers (remoto y gratuito).
- Inversión por participación en una categoría propia: Platanus, Latitud, 500 Global y Rockstart no se confunden con subvenciones o capital semilla condonable.
- Enlaces directos a los sitios oficiales; las postulaciones se realizan allí.
- Búsqueda sin sensibilidad a tildes, filtros, recursos y guardados locales.
- Match en cuatro pasos: etapa, tipo de negocio/sector, objetivos y país donde opera el negocio.
- Afinidad explicada, sin prometer elegibilidad o aprobación.
- Fechas con zona horaria de Perú y revisión de vigencia a los 45 días.
- Diseño adaptable a móvil y escritorio, controles accesibles y navegación por teclado.
- Interfaz minimalista blanca y negra con detalles lila y verde ácido, fondo punteado y marcos ligeros de ventana para el mapa.
- Dos stickers originales: «Tu envidia es mi progreso» y «HECHO EN LATAM». Reemplazan el póster grande; la combi ilustrada sigue siendo el logo y las banderas y marcas oficiales conservan sus colores.
- Entrada breve de stickers y respuesta sutil al cursor; sin bucles permanentes y con soporte de movimiento reducido.
- Tipografía Geist para marca, títulos y lectura. La fuente y los carteles del branding anterior se conservan como archivos históricos, sin uso en la interfaz actual.
- Logos oficiales locales en las 45 fichas, con fuentes y distinción entre marca del programa y de su institución.
- Lista de correo y buzón de sugerencias persistentes en D1. Sin cuenta propia, pagos ni envío automático de campañas; las propuestas pasan por revisión humana.

## Uso local

Requiere Node 22.13+ y npm. Para las pruebas TypeScript sin compilación, usa Node 22.18+ (validado con Node 26.7).

```sh
git clone https://github.com/MirandaCavalie/latamstartup.git
cd latamstartup
npm ci
npm run dev
```

Abrir la URL que muestre la consola. El puerto se ajusta si ya está ocupado.

La vista previa de formularios necesita una base D1 local. Tras generar la compilación, aplicar la migración una vez (no repetirla si ya existe):

```sh
npm run build
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_absent_captain_cross.sql
```

Después iniciar `npm run dev`. Los datos de prueba locales no se envían al sitio publicado.

## Verificación

```sh
npm test
npx tsc --noEmit
npm run build
npm run check:links
```

La publicación incluye la interfaz, dos rutas de recepción de datos y la base D1. La plataforma aplica las migraciones versionadas antes de publicar el Worker. El catálogo de oportunidades permanece editorial en archivos TypeScript; D1 almacena solo correos con consentimiento y sugerencias pendientes.

## Archivos principales

- `lib/opportunities.ts`: catálogo, fuentes, requisitos y reglas editoriales.
- `lib/latam-opportunities.ts`: fichas revisadas de los cinco países incorporados.
- `lib/regional-opportunities.ts`: fellowships transfronterizos, cobertura, restricciones y fechas.
- `lib/atlas.ts`: países, identificadores ISO, coordenadas de referencia y conteos derivados.
- `components/opportunity-atlas.tsx`: globo y acceso al catálogo por origen.
- `components/welcome-gate.tsx`: entrada y formulario voluntario de novedades.
- `components/contribute.tsx`: propuesta de programas y baja de novedades.
- `app/api/subscribe/route.ts` y `app/api/suggest/route.ts`: validación y escritura de formularios.
- `db/schema.ts`, `db/index.ts`, `drizzle/`: estructura y migración de la base.
- `lib/match.ts`: afinidad, búsqueda, validación de perfil y vigencia.
- `app/page.tsx`: exploración, filtros, formulario, guardados y fichas.
- `app/globals.css`: diseño adaptable.
- `components/brand-sticker.tsx`: imágenes decorativas de los dos stickers actuales.
- `components/chicha-poster.tsx`: componente histórico del cartel, actualmente sin uso.
- `components/site-mark.tsx`: combi y nombre La Combi en entrada, encabezado y pie.
- `public/brand/`: logo de combi, stickers y sus prompts exactos en `STICKERS-PROMPTS.md`; carteles anteriores conservados como historial.
- `lib/provider-logos.ts`: relación entre cada ficha y su logotipo.
- `public/logos/SOURCES.md`: procedencia de los logos oficiales.
- `tests/branding.test.mjs`: cobertura de imágenes, seguridad de SVG, identidad y movimiento reducido.
- `lib/webmcp.ts`: búsqueda y lectura para navegadores con WebMCP.
- `tests/match.test.mjs`: pruebas de los criterios de recomendación.
- `scripts/check-links.mjs`: revisión HTTP de enlaces.
- `SOP.md`: mantenimiento y decisiones de alcance.

## Privacidad

El perfil y los guardados se almacenan exclusivamente en localStorage en el navegador del visitante. La entrada como invitado se recuerda solo en la sesión. Si la persona marca consentimiento y envía un correo, se guarda en D1 para futuras novedades; puede retirarlo desde «Cómo funciona y privacidad». Las propuestas de programas se guardan pendientes de revisión, con un correo opcional para pedir aclaraciones; no se publican automáticamente ni se añaden a la lista de novedades. No hay envíos de correo automatizados. Los proveedores externos aplican sus propias políticas cuando el visitante abre sus enlaces. El acceso al sitio publicado sigue privado y lo controla Sites; «invitado» significa sin cuenta adicional de la aplicación, no acceso público hasta que la propietaria decida cambiarlo.

## Estado de la revisión

Fecha editorial inicial: 16 de septiembre de 2026; nuevas fichas regionales revisadas el 17 de septiembre. Ver `SOP.md` para limitaciones, revisión de fuentes y mantenimiento.

## Cartografía y expansión

El globo usa [D3 Geo](https://d3js.org/d3-geo) y [world-atlas](https://github.com/topojson/world-atlas) 2.0.2, a partir de Natural Earth 1:110m. Se incluye en el sitio, sin claves ni peticiones a un proveedor de mapas. Los marcadores sitúan países, no sedes de instituciones. Consultar `public/map-attribution.txt` para la licencia.

Para un nuevo país, añadir fichas revisadas con `geography` igual a su nombre en español y `countryCode` ISO alfa-2. Las opciones y conteos se derivan de los datos; nunca añadir cifras manuales. El cuestionario permite elegir los 20 países del atlas. El match combina fichas locales del país seleccionado con programas regionales o globales; no mezcla las fichas nacionales de otros países. Los programas con sede nacional y alcance regional confirmado usan `matchScope: 'Latinoamérica'`, sin cambiar su capítulo en el mapa. Cuando falta catálogo local se avisa y solo se buscan opciones transfronterizas. La afinidad no confirma elegibilidad, residencia, inscripción del negocio ni disponibilidad para viajar. Puentes queda fuera porque evalúa perfiles individuales de ingeniería. Los perfiles antiguos con un departamento peruano válido se migran a Perú conservando las otras respuestas; el país puede cambiarse desde «Editar mi perfil».
