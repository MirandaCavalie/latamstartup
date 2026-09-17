# SOP: Chancletazo — mapa de oportunidades

## Qué hace

Abre con un globo interactivo de Latinoamérica, que permite descubrir el catálogo por país. Reúne programas, aceleradoras, inversión y recursos con enlaces oficiales, filtros, guardados y match para negocios en Perú. La inscripción y evaluación suceden en el sitio de cada institución.

## Por qué se construyó así (build/buy/kill)

Se construyó un prototipo acotado porque el usuario pidió una experiencia propia de descubrimiento y match que conecte fuentes públicas, universitarias y corporativas. Se mantiene la edición humana de fuentes y requisitos: el catálogo no se actualiza ni aprueba postulaciones automáticamente. El match utiliza reglas transparentes y no requiere API de IA. La entrega es una exportación estática, suficiente para el catálogo y las preferencias locales.

Diagnóstico aplicado antes de implementar la lógica:

1. Volumen: tráfico y frecuencia real de uso desconocidos; no se afirma retorno de inversión. Hay 44 fichas revisadas como prueba del producto.
2. Entradas: sitios oficiales, bases y directorios enlazados, más respuestas estructuradas al cuestionario del visitante.
3. Formato: fuentes HTML/PDF no uniformes, normalizadas editorialmente a registros TypeScript. El cuestionario usa opciones cerradas.
4. Destino: catálogo y recomendaciones en la web; la acción final siempre va a la institución.
5. Aprobación: solo se automatizan filtros, vencimiento de fechas y afinidad; la institución decide elegibilidad y admisión.
6. Costo del error: pérdida de tiempo o decisiones basadas en condiciones equivocadas. Se muestran requisitos pendientes, enlace oficial y fecha de revisión.
7. Casos observados: Startup UNI exige prototipo y rechaza ideas; AWS ofrece créditos de consumo, no efectivo; Nexpro conserva texto promocional aunque su cierre de agosto ya pasó. Algunas webs bloquean verificaciones HTTP.

Rúbrica de automation-decision (1–5; 5 favorece construir):

| Criterio         | Valor | Razón                                                                                                                                                                 |
| ---------------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Especificidad    |     4 | Criterios y fuentes variados, enfocados en emprendimiento desde Perú.                                                                                                 |
| Volumen/urgencia |     2 | Demanda y tráfico aún no medidos.                                                                                                                                     |
| Costo de comprar |     2 | No se investigaron cotizaciones ni se afirma que no existan competidores. Un directorio genérico serviría para explorar, pero el usuario pidió su propia experiencia. |
| Tiempo a valor   |     5 | Un catálogo acotado y reglas de afinidad permiten probar el concepto.                                                                                                 |
| Mantenimiento    |     3 | Las condiciones requieren revisión editorial; se separaron del diseño y la lógica.                                                                                    |

Decisión: construir la experiencia autorizada; mantener manual la aprobación de datos y posponer la extracción automática. Si el catálogo o tráfico crece 10 veces, la exportación estática puede seguir sirviendo visitas, pero conviene añadir edición compartida, historial editorial y revisión asistida de enlaces. No se justifica todavía una plataforma pesada ni solicitudes automáticas a instituciones.

Ampliación visual solicitada: el atlas proyecta datos de Natural Earth con D3, sin contratar un servicio de mapas ni automatizar recopilación adicional. Se reutilizaron catálogo, match y almacenamiento local. El nuevo nombre visible no cambia las claves guardadas ni la URL existente.

Cartel chicha e identidad separados: la portada usa un PNG original de 1448 × 1086, generado con imagegen integrado, con el texto “Tu envidia es mi progreso”. Representa papel negro mate con bordes ligeramente irregulares, pliegues sutiles y caligrafía de tintas planas fucsia, amarillo y lima; el exterior del papel es transparente. No es el logo. Encabezado, pie y favicon usan una chancla monocroma original, con el nombre Chancletazo en encabezado y pie. Su prompt y limitación de tinta raster están en `public/brand/CHANCLA-PROMPT.md`. La interfaz y el globo siguen en tonos neutros; banderas y logos oficiales conservan sus colores.

Presentación del cartel: inclinación de −2°, sombra tenue y entrada de 850 ms, una sola vez. Al pasar el cursor se endereza y levanta ligeramente; no hay bucle de animación. `prefers-reduced-motion: reduce` desactiva entrada, transición y movimiento al pasar el cursor. El texto alternativo conserva el encabezado accesible. No se aplican filtros de color a las imágenes.

Las 44 fichas muestran imágenes oficiales almacenadas localmente. Cuando se utiliza la marca de una institución en vez de la del programa, se distingue en el registro y en el texto alternativo. Las fuentes están en `public/logos/SOURCES.md`; el prompt exacto del cartel está en `public/brand/POSTER-PROMPT.md`. El PNG y prompt de la antigua caligrafía transparente se conservan como versión histórica, sin referencias desde la interfaz.

La expansión regional añade 17 fichas: 5 de México y 3 de cada uno de Colombia, Chile, Argentina y Brasil. Se crea `Inversión de capital` para programas privados que invierten a cambio de participación, separados de subvenciones y del capital semilla condonable del SENA. Algunos programas regionales figuran en el capítulo de su base o referencia principal; ello no limita ni promete elegibilidad territorial. Las convocatorias 2026 cerradas se conservan como referencia, nunca se anuncian como abiertas. El match sigue siendo peruano hasta contar con un perfil territorial para los otros países.

La ampliación del 17/09/2026 incorpora tres fichas en un origen independiente «Latinoamérica» y categoría «Fellowships e intercambios». Puentes es para ingenieros de LATAM, no una aceleradora: la cohorte de octubre ya cerró y Antigravity cubre alojamiento y la mayoría de comidas, pero no vuelos ni transporte; no garantiza empleo ni permiso de trabajo. YLAI es un intercambio para emprendedores elegibles en EE. UU.; la documentación de IREX sobre pasajes y estancia corresponde a una edición anterior y exige reconfirmación cuando se anuncie la próxima convocatoria. Makers es gratuito y remoto, de 18 a 25 años, con cierre anunciado el 20/09/2026. La fuente no publica hora de cierre; el fin del día se usa solo para no mantener el estado abierto después. Se revisaron también otras opciones: MassChallenge no se añadió porque su estancia puede exigir viaje autofinanciado y sus términos reservan el uso de la marca; otros programas con cuotas no se presentan como gratuitos. Esta selección no intenta agotar los programas regionales.

El filtro «Programa regional» distingue esas fichas de los beneficios globales y de los capítulos nacionales. El match peruano puede sugerir YLAI o Makers por afinidad, pero no valida edad, idioma, visa ni admisión; los deja pendientes. Puentes se excluye del match empresarial porque selecciona talento individual. Mantener esa distinción al extender el cuestionario.

## Cómo correrlo

1. Instalar Node 22.18 o posterior y npm (pruebas ejecutadas con Node 26.7).
2. En una terminal:

```sh
git clone https://github.com/MirandaCavalie/latamstartup.git
cd latamstartup
npm ci
npm run dev
```

3. Abrir la URL exacta impresa por el servidor.
4. Ejecutar verificaciones:

```sh
npm test
npx tsc --noEmit
npm run build
npm run check:links
```

5. La exportación estática está en `dist/client`. Para revisarla sin el servidor de desarrollo, ejecutar `python3 -m http.server 3002 --bind 127.0.0.1 --directory dist/client` y abrir `http://127.0.0.1:3002/` (requiere Python 3). Recompilar después de cada cambio antes de esta revisión. Sites conserva la configuración del proyecto en `.openai/hosting.json`. Publicar una nueva versión tras cambios validados; conservar acceso privado salvo instrucción del propietario. El repositorio GitHub contiene código y recursos públicos, no perfiles ni guardados de los visitantes.

## Entradas y salidas

- Entrada editorial: `lib/opportunities.ts`, `lib/latam-opportunities.ts` y `lib/regional-opportunities.ts`, con URL oficial, fuente adicional opcional, descripción, requisitos, beneficios, costo, estado, fechas, alcance, modalidad, tipos, sectores y necesidades.
- Entrada geográfica: `lib/atlas.ts` y el dataset world-atlas 2.0.2. Coordenadas a escala país, no ubicaciones de proveedores. Los conteos se calculan del catálogo.
- Entrada visual: PNG del cartel y marca de chancla en `public/brand/`, logos oficiales PNG/SVG/WebP en `public/logos/`. Las imágenes no son enlaces a servicios de logos ni dependen de un proveedor externo durante la visita.
- Entrada del visitante: etapa, tipo de negocio, sector, objetivos y región.
- Salida: lista filtrada, explicación de afinidad, ficha detallada y enlace oficial en nueva pestaña.
- Preferencias: `mapping.saved.v1` y `mapping.profile.v1` en localStorage. Se valida su estructura al recuperar; no se requieren identificadores personales.
- No se generan postulaciones ni se envían correos, mensajes o solicitudes a instituciones.

## Casos límite conocidos

- Convocatorias cerradas: visibles para referencia, excluidas del match.
- Fechas: se almacenan con desfase explícito de la fuente, normalmente UTC-5 y, para Puentes, UTC-7. Cuando solo se publica el día, se utiliza el final del día de manera editorial y se advierte que la hora real debe verificarse.
- Fuentes sin fechas verificables: “Consultar convocatoria”. No se inventan aperturas futuras.
- Información antigua: después de 45 días sin revisión se muestra “Revisar vigencia”. Esto no detecta cambios automáticamente.
- Beneficios globales: requieren confirmación de elegibilidad territorial en Perú; se indica en la ficha y el match.
- Perfil sin requisitos suficientes: la afinidad no evalúa documentación, nivel de ventas, capital recibido, antigüedad ni otros criterios particulares; se enumeran para revisión.
- Región: reduce afinidad si una actividad menciona Lima y el perfil está fuera de Lima/Callao; no determina residencia legal ni disponibilidad de un centro local.
- Mujer Produce: el género no se solicita; la condición de negocio liderado por mujeres se explica como requisito pendiente.
- Créditos/beneficios: no son efectivo ni acceso ilimitado. Se explica consumo excedente, vencimiento y condiciones relevantes.
- Guardados: son del navegador/dispositivo y no se sincronizan. Bloqueo de almacenamiento muestra aviso; el catálogo sigue funcionando.
- Importes: solo se incluyen tarifas ligadas a ediciones identificadas. Confirmar en la fuente.
- BCP devolvió 403 al verificador automatizado; su página oficial se leyó con la herramienta de búsqueda. No se considera un enlace inexistente.
- En la revisión de enlaces del 16/09/2026, Nafin y Latitud no pudieron verificarse automáticamente; Brasil Mais Produtivo respondió 403 al verificador. Esos resultados no prueban que el sitio esté caído. Los demás enlaces nuevos respondieron HTTP 200. HTTP 200 no garantiza que las bases estén actualizadas.
- El scaffold incluye dependencias con avisos npm en herramientas y componentes de servidor. Esta entrega publica solo archivos estáticos, sin servidor RSC ni procesador de imágenes. Revisar dependencias antes de añadir backend.
- Atlas: 18 fichas de origen peruano, 6 globales, 17 en los cinco países añadidos y 3 regionales. HubSpot se reclasificó como internacional después de revisar su fuente oficial; su inclusión de Perú no lo convierte en un programa local.
- Otros países: “Por mapear” significa que faltan fichas en este catálogo, no que el país carezca de programas. No hay fechas prometidas de lanzamiento.
- Match: por ahora solo contempla emprendimientos en Perú. Excluye las fichas nacionales de los otros países; puede sugerir programas latinoamericanos de acceso regional con requisitos pendientes y excluye Puentes, dirigido a ingenieros individuales.
- Cartografía: límites simplificados de Natural Earth, no una referencia legal de fronteras; no solicita geolocalización. Si la interacción de arrastre no está disponible, usar los botones de país y rotación.
- QA: pruebas de reglas y separación territorial, TypeScript y compilación. Comprobación visual y de navegación del atlas en navegador; no es una auditoría integral de accesibilidad. Se preservan las dos herramientas WebMCP previamente verificadas.
- Logos: si una imagen falla, se muestra el nombre de la institución como texto, no un logo inventado. El original de ITP tiene resolución limitada (137 × 72). Los logos se muestran sin alterar sus proporciones o colores.
- Vista previa: el servidor de desarrollo presentó un bucle de solicitudes de trazas de error durante esta revisión. La compilación estática terminó correctamente y se revisó con un servidor HTTP local; no se cambió la arquitectura de la aplicación para eludirlo.

## Umbral de aprobación humana

La publicación de una nueva ficha o el cambio de monto, fechas, gratuidad, elegibilidad o enlace debe revisarlo la persona responsable del catálogo contra la fuente oficial. Nunca se marca una admisión como aprobada: la decisión pertenece a la institución. Cambiar de acceso privado a público requiere instrucción del propietario del sitio.

## Mantenimiento

Responsable: propietario/editor de Mapping; no hay un mantenedor externo contratado.

- Revisar semanalmente convocatorias con cierre próximo y mensualmente recursos permanentes.
- Abrir la fuente oficial antes de actualizar `checkedAt`; que un enlace responda no sustituye la revisión de contenido.
- Para añadir una ficha: copiar una estructura existente en `lib/opportunities.ts`, `lib/latam-opportunities.ts` o `lib/regional-opportunities.ts`, asignar ID único, llenar todos los campos y validar la fuente. La cantidad visible se calcula del catálogo; actualizar la expectativa del test si cambia el tamaño.
- No reutilizar fechas de una edición anterior para anunciar una nueva.
- Revisar con prioridad las fechas y condiciones de Platanus, 500 Global, Latitud y Rockstart: inversión por participación no equivale a subvención. Confirmar la nueva cohorte antes de cambiar `status`.
- Usar `npm run check:links` para detectar cambios de rutas. Revisar manualmente 403, 429, timeouts y redirecciones.
- La lógica de afinidad vive en `lib/match.ts`. Ajustar pruebas cuando cambien reglas.
- Para incorporar otro país: verificar sus fuentes, agregar `countryCode` ISO alfa-2 y `geography` con su nombre del atlas. La selección y los conteos se actualizan con las fichas; los beneficios globales permanecen separados. Ampliar cuestionario y reglas antes de habilitar match para residentes de ese país.
- Verificar y publicar otra vez tras editar datos o código. No existe actualización automática en segundo plano.
- Revisar las dependencias antes de ampliar la arquitectura o incorporar funciones de servidor.
- Mantener el cartel separado del símbolo de identidad. Para cambiar su texto, regenerar el asset y actualizar `components/chicha-poster.tsx`, dimensiones, texto alternativo y pruebas; no reconstruirlo con una fuente CSS. Conservar colores sin filtros y respetar movimiento reducido. El prompt exacto está documentado en `public/brand/POSTER-PROMPT.md`.
- Para una nueva ficha, agregar su logo oficial a `public/logos/`, registrar su fuente y asignarlo en `lib/provider-logos.ts`. No generar marcas de instituciones con IA. No aplicar filtros globales de escala de grises: las banderas y los logos deben conservar su color.
