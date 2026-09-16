# Tu envidia es mi progreso

Atlas en español para descubrir oportunidades y recursos para emprender. Proyecto originalmente llamado Mapping; conserva su carpeta, URL y preferencias guardadas.

- Portada con globo interactivo, selección de países y controles accesibles de rotación.
- 18 oportunidades de origen peruano y 6 beneficios internacionales, sin atribuir cobertura territorial no verificada.
- 20 países en el atlas; los que no tienen fichas aparecen como “Por mapear”.

- 24 fichas editoriales de Estado, universidades, empresas y organizaciones.
- Enlaces directos a los sitios oficiales; las postulaciones se realizan allí.
- Búsqueda sin sensibilidad a tildes, filtros, recursos y guardados locales.
- Match en cuatro pasos: etapa, tipo de negocio/sector, objetivos y región.
- Afinidad explicada, sin prometer elegibilidad o aprobación.
- Fechas con zona horaria de Perú y revisión de vigencia a los 45 días.
- Diseño adaptable a móvil y escritorio, controles accesibles y navegación por teclado.
- Sin claves de API, registro de usuarios, pagos ni base de datos.

## Uso local

Requiere Node 22.13+ y npm. Para las pruebas TypeScript sin compilación, usa Node 22.18+ (validado con Node 26.7).

```sh
cd /Users/mcavalie/Documents/ChatGPT/Mapping
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
- `lib/atlas.ts`: países, identificadores ISO, coordenadas de referencia y conteos derivados.
- `components/opportunity-atlas.tsx`: globo y acceso al catálogo por origen.
- `lib/match.ts`: afinidad, búsqueda, validación de perfil y vigencia.
- `app/page.tsx`: exploración, filtros, formulario, guardados y fichas.
- `app/globals.css`: diseño adaptable.
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
