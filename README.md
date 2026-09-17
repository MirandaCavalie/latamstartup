# La Combi

Atlas en español para descubrir oportunidades y recursos para emprender. Proyecto originalmente llamado Mapping y después Chancletazo; conserva su carpeta, URL y preferencias guardadas.

- El mapa plano ocupa la pantalla inicial debajo de la navegación. No hay pantalla de acceso previa: seleccionar un país acerca el mapa y muestra programas, combi y stickers.
- «Base de datos» abre todas las fichas con sus filtros. «Volver al mapa» recupera el último país seleccionado. Los stickers se reemplazan al cambiar de país, entran escalonados y flotan suavemente; con movimiento reducido permanecen quietos.
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
- Mapa monocromático de borde a borde, con selección, zoom y desplazamiento; tarjetas flotantes con marcas oficiales y acceso a cada ficha sin perder el país seleccionado.
- Cuatro stickers neón originales: «Tu envidia es mi progreso», «HECHO EN LATAM», «SIGUIENTE PARADA» e «IDEAS SIN FRONTERAS». Solo aparecen al seleccionar un país; la combi es logo y marcador. Banderas y marcas oficiales conservan sus colores.
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

La vista previa de formularios usa D1 local, nunca la base de producción. Aplicar las migraciones pendientes es repetible:

```sh
npm run db:local
npm run build
npm start -- --port 8787 --var COLLECTION_ENABLED:true --var PRIVACY_CONTACT_EMAIL:privacy@example.invalid
```

En otra terminal: `npm run test:forms`. Esta prueba solo acepta localhost, usa direcciones ficticias y elimina sus registros. En desarrollo normal la recepción permanece desactivada salvo configuración explícita.

## Verificación

```sh
npm test
npx tsc --noEmit
npm run build
npm run check:links
```

La publicación propia utiliza Cloudflare Workers con assets y D1. `npm run deploy` verifica, compila, aplica migraciones pendientes y publica en la cuenta indicada en `wrangler.jsonc`. El catálogo y los logos permanecen en GitHub; los correos, matches compartidos y sugerencias están en D1 privado. Ver [operación de producción](docs/PRODUCTION.md) para requisitos, seguridad, despliegue y consultas de analítica. `.openai/hosting.json` corresponde al alojamiento histórico y no controla este despliegue.

## Archivos principales

- `lib/opportunities.ts`: catálogo, fuentes, requisitos y reglas editoriales.
- `lib/latam-opportunities.ts`: fichas revisadas de los cinco países incorporados.
- `lib/regional-opportunities.ts`: fellowships transfronterizos, cobertura, restricciones y fechas.
- `lib/atlas.ts`: países, identificadores ISO, coordenadas de referencia y conteos derivados.
- `components/opportunity-atlas.tsx`: mapa plano, combis, selección y tarjetas de oportunidades por país.
- `lib/map-camera.ts`: encuadre y zoom, con espacio reservado para tarjetas en escritorio y móvil.
- `components/newsletter-dialog.tsx`: formulario opcional de novedades; no bloquea el mapa.
- `components/welcome-gate.tsx`: entrada histórica, sin uso en la página actual.
- `components/contribute.tsx`: propuesta de programas y baja de novedades.
- `app/api/subscribe/route.ts` y `app/api/suggest/route.ts`: validación y escritura de formularios.
- `db/schema.ts`, `db/index.ts`, `drizzle/`: estructura y migración de la base.
- `lib/match.ts`: afinidad, búsqueda, validación de perfil y vigencia.
- `app/page.tsx`: exploración, filtros, formulario, guardados y fichas.
- `app/globals.css` y `app/map.css`: diseño adaptable y superficie cartográfica.
- `components/brand-sticker.tsx`: imágenes decorativas de los cuatro stickers actuales.
- `components/chicha-poster.tsx`: componente histórico del cartel, actualmente sin uso.
- `components/site-mark.tsx`: combi y nombre La Combi en entrada, encabezado y pie.
- `public/brand/`: logo de combi, stickers y sus prompts exactos en `STICKERS-PROMPTS.md` y `COUNTRY-STICKERS-PROMPTS.md`; carteles anteriores conservados como historial.
- `lib/provider-logos.ts`: relación entre cada ficha y su logotipo.
- `public/logos/SOURCES.md`: procedencia de los logos oficiales.
- `tests/branding.test.mjs`: cobertura de imágenes, seguridad de SVG, identidad y movimiento reducido.
- `lib/webmcp.ts`: búsqueda y lectura para navegadores con WebMCP.
- `tests/match.test.mjs`: pruebas de los criterios de recomendación.
- `scripts/check-links.mjs`: revisión HTTP de enlaces.
- `SOP.md`: mantenimiento y decisiones de alcance.

## Privacidad

Explorar y hacer match no requiere registro. Perfil y guardados se recuerdan localmente. Solo una casilla opcional, inicialmente desmarcada, permite guardar una copia estructurada del match para analítica; no se vincula al correo. La lista de novedades tiene un consentimiento independiente. Las propuestas requieren consentimiento y revisión humana. `/privacidad` explica los campos, proveedores, plazos y permite borrar registros con códigos privados conservados en el navegador. Los correos aún no se verifican ni se envían campañas. Retención automática: 12 meses para matches y propuestas, 24 meses para suscripciones. Cloudflare procesa información técnica de conexión; no se añaden trackers de marketing. No subir exports, claves, correos ni respuestas a GitHub.

La recepción se mantiene desactivada si faltan `COLLECTION_ENABLED=true` o un contacto de privacidad. Desactivar recepción no bloquea las bajas. El sitio anterior en Sites permanece privado y sin cambios; el nuevo destino será público por solicitud de la propietaria. La publicación y la conexión automática con GitHub deben comprobarse en Cloudflare, no se deducen de tener código en el repositorio.

## Estado de la revisión

Fecha editorial inicial: 16 de septiembre de 2026; nuevas fichas regionales revisadas el 17 de septiembre. Ver `SOP.md` para limitaciones, revisión de fuentes y mantenimiento.

## Cartografía y expansión

El mapa plano usa [D3 Geo](https://d3js.org/d3-geo) y [world-atlas](https://github.com/topojson/world-atlas) 2.0.2, a partir de Natural Earth 1:110m. Se incluye en el sitio, sin claves ni peticiones a un proveedor de mapas. Los marcadores sitúan países, no sedes de instituciones. Consultar `public/map-attribution.txt` para la licencia.

Para un nuevo país, añadir fichas revisadas con `geography` igual a su nombre en español y `countryCode` ISO alfa-2. Las opciones y conteos se derivan de los datos; nunca añadir cifras manuales. El cuestionario permite elegir los 20 países del atlas. El match combina fichas locales del país seleccionado con programas regionales o globales; no mezcla las fichas nacionales de otros países. Los programas con sede nacional y alcance regional confirmado usan `matchScope: 'Latinoamérica'`, sin cambiar su capítulo en el mapa. Cuando falta catálogo local se avisa y solo se buscan opciones transfronterizas. La afinidad no confirma elegibilidad, residencia, inscripción del negocio ni disponibilidad para viajar. Puentes queda fuera porque evalúa perfiles individuales de ingeniería. Los perfiles antiguos con un departamento peruano válido se migran a Perú conservando las otras respuestas; el país puede cambiarse desde «Editar mi perfil».
