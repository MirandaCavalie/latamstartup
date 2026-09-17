# Chancletazo

Atlas en español para descubrir oportunidades y recursos para emprender. Proyecto originalmente llamado Mapping; conserva su carpeta, URL y preferencias guardadas.

- Portada con globo interactivo, selección de países y controles accesibles de rotación.
- 18 oportunidades de origen peruano, 6 beneficios internacionales y 17 fichas de México, Colombia, Chile, Argentina y Brasil.
- 20 países en el atlas; los que no tienen fichas aparecen como “Por mapear”.

- 41 fichas editoriales de Estado, universidades, empresas y organizaciones.
- Inversión por participación en una categoría propia: Platanus, Latitud, 500 Global y Rockstart no se confunden con subvenciones o capital semilla condonable.
- Enlaces directos a los sitios oficiales; las postulaciones se realizan allí.
- Búsqueda sin sensibilidad a tildes, filtros, recursos y guardados locales.
- Match en cuatro pasos: etapa, tipo de negocio/sector, objetivos y región.
- Afinidad explicada, sin prometer elegibilidad o aprobación.
- Fechas con zona horaria de Perú y revisión de vigencia a los 45 días.
- Diseño adaptable a móvil y escritorio, controles accesibles y navegación por teclado.
- Cartel chicha original en la portada, con tintas planas brillantes sobre papel negro y movimiento discreto que respeta la preferencia de movimiento reducido.
- Identidad independiente: chancla monocroma y nombre Chancletazo en encabezado y pie; el afiche no es el logo. Interfaz en blanco y negro, con banderas y marcas a color.
- Logos oficiales locales en las 41 fichas, con fuentes y distinción entre marca del programa y de su institución.
- Sin claves de API, registro de usuarios, pagos ni base de datos.

## Uso local

Requiere Node 22.13+ y npm. Para las pruebas TypeScript sin compilación, usa Node 22.18+ (validado con Node 26.7).

```sh
git clone https://github.com/MirandaCavalie/latamstartup.git
cd latamstartup
npm ci
npm run dev
```

Abrir la URL que muestre la consola. El puerto se ajusta si ya está ocupado.

## Verificación

```sh
npm test
npx tsc --noEmit
npm run build
npm run check:links
```

El resultado de producción es un sitio estático en `dist/client`. La publicación usa únicamente ese directorio: no incluye un servidor de funciones React, rutas de API ni optimización de imágenes.

## Archivos principales

- `lib/opportunities.ts`: catálogo, fuentes, requisitos y reglas editoriales.
- `lib/latam-opportunities.ts`: fichas revisadas de los cinco países incorporados.
- `lib/atlas.ts`: países, identificadores ISO, coordenadas de referencia y conteos derivados.
- `components/opportunity-atlas.tsx`: globo y acceso al catálogo por origen.
- `lib/match.ts`: afinidad, búsqueda, validación de perfil y vigencia.
- `app/page.tsx`: exploración, filtros, formulario, guardados y fichas.
- `app/globals.css`: diseño adaptable.
- `components/chicha-poster.tsx`: cartel de portada como imagen, no como logo.
- `components/site-mark.tsx`: chancla monocroma y nombre breve en encabezado y pie.
- `public/brand/`: cartel original y chancla, con sus prompts exactos.
- `lib/provider-logos.ts`: relación entre cada ficha y su logotipo.
- `public/logos/SOURCES.md`: procedencia de los logos oficiales.
- `tests/branding.test.mjs`: cobertura de imágenes, seguridad de SVG y paleta neutra.
- `lib/webmcp.ts`: búsqueda y lectura para navegadores con WebMCP.
- `tests/match.test.mjs`: pruebas de los criterios de recomendación.
- `scripts/check-links.mjs`: revisión HTTP de enlaces.
- `SOP.md`: mantenimiento y decisiones de alcance.

## Privacidad

El perfil y los guardados se almacenan exclusivamente en localStorage en el navegador del visitante. No se envían a un servidor del catálogo. Los proveedores externos aplican sus propias políticas cuando el visitante abre sus enlaces. El acceso al sitio privado publicado lo controla Sites.

## Estado de la revisión

Fecha editorial inicial: 16 de septiembre de 2026. Ver `SOP.md` para limitaciones, revisión de fuentes y mantenimiento.

## Cartografía y expansión

El globo usa [D3 Geo](https://d3js.org/d3-geo) y [world-atlas](https://github.com/topojson/world-atlas) 2.0.2, a partir de Natural Earth 1:110m. Se incluye en el sitio, sin claves ni peticiones a un proveedor de mapas. Los marcadores sitúan países, no sedes de instituciones. Consultar `public/map-attribution.txt` para la licencia.

Para un nuevo país, añadir fichas revisadas con `geography` igual a su nombre en español y `countryCode` ISO alfa-2. Las opciones y conteos se derivan de los datos; nunca añadir cifras manuales. El match todavía utiliza regiones peruanas y excluye fichas locales de otros países. Ampliar el cuestionario, reglas y pruebas antes de ofrecer match internacional.
