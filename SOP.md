# SOP: La Combi — mapa de oportunidades

## Qué hace

Abre directamente con un mapa plano a pantalla completa debajo de la navegación; elegir un país acerca la vista y muestra sus oportunidades con logos. Las novedades por correo son opcionales y se abren desde el mapa. El atlas permite descubrir programas, aceleradoras, inversión y recursos por país, y proponer fuentes faltantes para revisión. El match pregunta el país entre los 20 del atlas y combina el catálogo local disponible con opciones regionales o globales; la inscripción sucede en el sitio de cada institución.

## Por qué se construyó así (build/buy/kill)

Se construyó un prototipo acotado porque el usuario pidió una experiencia propia de descubrimiento y match que conecte fuentes públicas, universitarias y corporativas. Se mantiene la edición humana de fuentes y requisitos: el catálogo no se actualiza ni aprueba postulaciones automáticamente. El match utiliza reglas transparentes y no requiere API de IA. La entrega original era estática; los formularios solicitados ahora necesitan una pequeña base persistente y un Worker, mientras las preferencias locales siguen en el navegador.

Diagnóstico aplicado antes de implementar la lógica:

1. Volumen: tráfico y frecuencia real de uso desconocidos; no se afirma retorno de inversión. Hay 45 fichas revisadas como prueba del producto.
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

Decisión: construir la experiencia autorizada; mantener manual la aprobación de datos y posponer la extracción automática. La lista de novedades y las sugerencias se guardan en D1 porque deben sobrevivir a las sesiones; no se contrató una plataforma externa de newsletter sin que exista aún una campaña o proveedor elegido. Si crecen volumen o abuso, añadir verificación antispam, gestión editorial y proveedor de correo antes de hacer campañas. No se envían solicitudes automáticas a instituciones.

Ampliación visual solicitada: el atlas proyecta datos de Natural Earth con D3, sin contratar un servicio de mapas ni automatizar recopilación adicional. Se reutilizaron catálogo, match y almacenamiento local. El nuevo nombre visible no cambia las claves guardadas ni la URL existente.

Primer rebranding a La Combi (17/09/2026, versión histórica): el usuario sustituyó la chancla por un colectivo y pidió una identidad inspirada en cartelería, collage y azulejos populares latinoamericanos. La portada utilizaba un PNG original de 1448 × 1086 con papel amarillo, letras rojas y azules, flores y hojas de borde. No era el logo. Se conservan `combi-mark.png` (1254 × 1254 con transparencia real) y el nombre La Combi. Los prompts de esa versión están en `public/brand/COMBI-PROMPTS.md`.

Rebranding actual minimalista (17/09/2026): siguiendo la referencia Heyclicky aportada por el usuario, se sustituyó el póster grande por dos stickers originales con transparencia: «Tu envidia es mi progreso» y «HECHO EN LATAM». La interfaz usa blanco, negro, lila y pequeños acentos verde ácido, tipografía Geist, fondo punteado y marcos ligeros de ventana. El mapa conserva geometría, arrastre, rotación y selección de países; las banderas, logos oficiales y datos no se modificaron. La entrada conserva las cuatro secciones de navegación y permite abrir directamente el match. Los stickers son decorativos, no botones: tienen entrada de 800 ms y un movimiento leve al pasar el cursor por su grupo, sin bucles; movimiento reducido los deja quietos. Los prompts exactos están en `public/brand/STICKERS-PROMPTS.md`.

Presentación histórica del cartel: inclinación de −2°, sombra tenue y entrada de 850 ms, una sola vez. El componente y los assets se conservan sin montaje en la interfaz actual. No se aplican filtros de color a las imágenes.

Las 45 fichas muestran imágenes oficiales almacenadas localmente. Cuando se utiliza la marca de una institución en vez de la del programa, se distingue en el registro y en el texto alternativo. Las fuentes están en `public/logos/SOURCES.md`; los prompts actuales de la marca y el cartel están en `public/brand/COMBI-PROMPTS.md`. La chancla, el afiche negro y la antigua caligrafía se conservan como versiones históricas, sin referencias desde la interfaz. La clave interna `chancletazo.entered.v1` se mantiene para no perder la preferencia de entrada de una sesión existente; no aparece como marca visible.

La expansión regional añade 17 fichas: 5 de México y 3 de cada uno de Colombia, Chile, Argentina y Brasil. Se crea `Inversión de capital` para programas privados que invierten a cambio de participación, separados de subvenciones y del capital semilla condonable del SENA. Algunos programas regionales figuran en el capítulo de su base o referencia principal; ello no limita ni promete elegibilidad territorial. Las convocatorias 2026 cerradas se conservan como referencia, nunca se anuncian como abiertas. El match utiliza el país elegido y distingue el origen editorial del alcance regional explícito.

La ampliación del 17/09/2026 incorpora tres fichas en un origen independiente «Latinoamérica» y categoría «Fellowships e intercambios». Puentes es para ingenieros de LATAM, no una aceleradora: la cohorte de octubre ya cerró y Antigravity cubre alojamiento y la mayoría de comidas, pero no vuelos ni transporte; no garantiza empleo ni permiso de trabajo. YLAI es un intercambio para emprendedores elegibles en EE. UU.; la documentación de IREX sobre pasajes y estancia corresponde a una edición anterior y exige reconfirmación cuando se anuncie la próxima convocatoria. Makers es gratuito y remoto, de 18 a 25 años, con cierre anunciado el 20/09/2026. La fuente no publica hora de cierre; el fin del día se usa solo para no mantener el estado abierto después. Se revisaron también otras opciones: MassChallenge no se añadió porque su estancia puede exigir viaje autofinanciado y sus términos reservan el uso de la marca; otros programas con cuotas no se presentan como gratuitos. Esta selección no intenta agotar los programas regionales.

El filtro «Programa regional» distingue esas fichas de los beneficios globales y de los capítulos nacionales. El match puede sugerir YLAI o Makers por afinidad desde el país elegido, pero no valida cobertura territorial, edad, idioma, visa ni admisión; los deja pendientes. Puentes se excluye del match empresarial porque selecciona talento individual. Mantener esa distinción al extender el cuestionario.

Entrada y colaboración (17/09/2026): la portada adicional abre con un globo de los seis países con catálogo, número de fichas y dos acciones. «Entrar como invitado» no crea cuenta y se recuerda durante esa sesión; el formulario de novedades guarda solo el correo normalizado y la fecha de consentimiento en D1. El formulario «¿Conoces otro programa?» guarda nombre, enlace oficial, país/alcance, tipo, nota y correo opcional con estado `pending`. No alimenta automáticamente el catálogo. Se eligió un buzón del propio sitio en lugar de publicar el correo personal de la propietaria: permite estructurar fuentes, moderar y no exponer una dirección a spam. La lista no envía correos por sí sola; un proveedor y una política de campañas quedan como trabajo posterior.

Historial: el Site original permanece privado y sin cambios. El 17/09/2026 la propietaria autorizó publicar una instancia pública en su propia cuenta Cloudflare y almacenar correos y matches voluntarios. El estado y procedimiento actuales están en `docs/PRODUCTION.md`; la antigua pantalla de invitado ya no forma parte del flujo.

Actualización de stickers (17/09/2026): se reemplazaron únicamente las dos ilustraciones decorativas por tipografía gruesa e irregular, fucsia/verde eléctrico y una estrella amarilla/violeta, siguiendo las nuevas referencias del usuario. Se conserva la interfaz minimalista, posiciones, animaciones accesibles, navegación, mapa y catálogo. Los nuevos archivos llevan sufijo `-neon` para evitar imágenes antiguas en caché; los anteriores siguen disponibles como historial. Procedencia y prompts en `public/brand/STICKERS-PROMPTS.md`.

Mapa como superficie principal (17/09/2026): se eliminó el paso de bienvenida del flujo activo y el globo se sustituyó por Mercator con zoom y desplazamiento. La combi marca países, no oficinas; seleccionar cualquiera de los 20 países muestra su catálogo local o un aviso de falta de fichas. Las tarjetas abren el detalle existente, conservando mapa y país detrás, y enlazan al proveedor oficial. Los cuatro stickers solo se montan después de seleccionar un país; los dos nuevos se documentan en `public/brand/COUNTRY-STICKERS-PROMPTS.md`. Se preservan catálogo, recursos, guardados, match, propuestas, bajas y consentimiento para correo. Ya no se utiliza la antigua preferencia de entrada de sesión. El botón del logo vuelve al mapa; el selector y restablecer permiten cambiar de país. No se añadieron empleos, sedes inventadas ni nuevos programas.

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

5. Formularios locales: `npm run db:local`, `npm run build`, `npm start -- --port 8787 --var COLLECTION_ENABLED:true --var PRIVACY_CONTACT_EMAIL:privacy@example.invalid`. En otra terminal, `npm run test:forms`. El directorio de persistencia debe ser `.wrangler/state` tanto para CLI como para el servidor; otro directorio crea otra base local y produce errores de tablas ausentes.
6. Producción: seguir `docs/PRODUCTION.md`, autenticar Wrangler en la cuenta autorizada y ejecutar `npm run deploy`. No publicar mediante Sites; `.openai/hosting.json` queda como historial. GitHub contiene solo código, catálogo y recursos públicos.

## Entradas y salidas

- Entrada editorial: `lib/opportunities.ts`, `lib/latam-opportunities.ts` y `lib/regional-opportunities.ts`, con URL oficial, fuente adicional opcional, descripción, requisitos, beneficios, costo, estado, fechas, alcance, modalidad, tipos, sectores y necesidades.
- Entrada geográfica: `lib/atlas.ts` y el dataset world-atlas 2.0.2. Coordenadas a escala país, no ubicaciones de proveedores. Los conteos se calculan del catálogo.
- Entrada visual: PNG de los stickers y marca de combi en `public/brand/`, logos oficiales PNG/SVG/WebP en `public/logos/`. Las imágenes no son enlaces a servicios de logos ni dependen de un proveedor externo durante la visita.
- Entrada del visitante: etapa, tipo de negocio, sector, objetivos y país donde opera el negocio; no se solicitan departamentos.
- Entrada voluntaria: correo y consentimiento para novedades; propuestas de programas con nombre, país, enlace HTTPS y correo de respuesta opcional.
- Salida: lista filtrada, explicación de afinidad, ficha detallada y enlace oficial en nueva pestaña.
- Preferencias: `mapping.saved.v1` y `mapping.profile.v1` en localStorage. Se valida su estructura al recuperar; no se requieren identificadores personales. Los perfiles antiguos sin `countryCode` y con una región peruana válida se migran a `PE`, conservando las otras respuestas y descartando `region`. Un país explícito inválido no se sustituye silenciosamente. Los guardados no cambian.
- Persistencia: D1 privado contiene `subscribers`, `suggestions` y `match_profiles`. El match se envía solo con consentimiento opcional independiente del correo. Un hash de un código aleatorio permite actualizar/borrar el último perfil compartido; no identifica usuarios únicos. La baja de correo requiere su propio código privado, no conocer una dirección. No se generan postulaciones ni envíos de campañas.

## Casos límite conocidos

- Mapa plano: 30 pruebas automatizadas cubren el catálogo, los 20 encuadres nacionales, zoom anclado, inversión de coordenadas después de desplazar, acceso directo, assets y consentimiento. TypeScript y compilación de producción completados; no se realizó QA de navegador de esta versión. Las comprobaciones de navegador descritas más abajo son históricas.
- En móvil las tarjetas se desplazan horizontalmente; en escritorio, verticalmente. Se reserva espacio al encuadrar para que el panel no tape el país. En pantallas de muy poca altura la página conserva una altura mínima utilizable y puede requerir desplazamiento vertical. El zoom y arrastre no requieren gestos multitáctiles: hay controles y un selector de los 20 países como alternativa.
- Abrir/cerrar una ficha conserva país y encuadre. La navegación visible se llama «Base de datos»; «Volver al mapa» recupera el país seleccionado y ajusta su encuadre (no conserva desplazamientos manuales). El logo también devuelve al mapa. No hay enlaces permanentes ni historial de navegador por país en esta versión. Las coordenadas representan países y no ubicaciones de programas.

- Convocatorias cerradas: visibles para referencia, excluidas del match.
- Fechas: se almacenan con desfase explícito de la fuente, normalmente UTC-5 y, para Puentes, UTC-7. Cuando solo se publica el día, se utiliza el final del día de manera editorial y se advierte que la hora real debe verificarse.
- Fuentes sin fechas verificables: “Consultar convocatoria”. No se inventan aperturas futuras.
- Información antigua: después de 45 días sin revisión se muestra “Revisar vigencia”. Esto no detecta cambios automáticamente.
- Beneficios globales y regionales: requieren confirmación de elegibilidad desde el país seleccionado; el match lo indica sin prometer admisión territorial.
- Perfil sin requisitos suficientes: la afinidad no evalúa documentación, nivel de ventas, capital recibido, antigüedad ni otros criterios particulares; se enumeran para revisión.
- Ubicación: las fichas nacionales solo se sugieren para el país elegido. No se calcula afinidad entre departamentos. Las actividades presenciales, híbridas o con modalidad por confirmar muestran la ubicación real y piden comprobar sede/asistencia; elegir un país no confirma residencia legal ni disponibilidad para viajar.
- Mujer Produce: el género no se solicita; la condición de negocio liderado por mujeres se explica como requisito pendiente.
- Créditos/beneficios: no son efectivo ni acceso ilimitado. Se explica consumo excedente, vencimiento y condiciones relevantes.
- Guardados: son del navegador/dispositivo y no se sincronizan. Bloqueo de almacenamiento muestra aviso; el catálogo sigue funcionando.
- Importes: solo se incluyen tarifas ligadas a ediciones identificadas. Confirmar en la fuente.
- BCP devolvió 403 al verificador automatizado; su página oficial se leyó con la herramienta de búsqueda. No se considera un enlace inexistente.
- En la revisión de enlaces del 16/09/2026, Nafin y Latitud no pudieron verificarse automáticamente; Brasil Mais Produtivo respondió 403 al verificador. Esos resultados no prueban que el sitio esté caído. Los demás enlaces nuevos respondieron HTTP 200. HTTP 200 no garantiza que las bases estén actualizadas.
- `npm audit --omit=dev` del 17/09/2026 reportó cinco avisos de severidad alta y uno bajo en dependencias del servidor/entorno, incluidos `vinext`, `react-server-dom-webpack` y `undici`. Esta versión sigue privada: evaluar actualizaciones compatibles y repetir las pruebas antes de abrirla al público; no aplicar `npm audit fix --force` sin verificar cambios de versión y comportamiento.
- Atlas: 18 fichas de origen peruano, 6 globales, 18 en los cinco países añadidos y 3 regionales. HubSpot se reclasificó como internacional después de revisar su fuente oficial; su inclusión de Perú no lo convierte en un programa local.
- IFE Accelerator (17/09/2026): sexta ficha de México; alcance internacional, aceleración EdTech, no inversión garantizada. Se enlazan la web y las bases 2026; ambos cierres publicados ya pasaron y sus calendarios difieren. Se mantiene cerrado, sin fecha futura inventada. La ficha explica comisión comercial y gastos excluidos; no se incluye en «gratis». Antes de reabrirlo, reconfirmar condiciones con IFE. La marca mostrada es institucional.
- Otros países: “Por mapear” significa que faltan fichas en este catálogo, no que el país carezca de programas. No hay fechas prometidas de lanzamiento.
- Match: contempla los 20 países del atlas. Hay catálogo nacional en Perú, México, Colombia, Chile, Argentina y Brasil; los demás reciben un aviso y solo opciones regionales o globales compatibles. `matchScope: 'Latinoamérica'` identifica el alcance regional ya descrito en las fichas de 500 Global, Latitud y Rockstart sin moverlas de su capítulo nacional. Las convocatorias cerradas siguen excluidas y Puentes no participa del match empresarial. Los requisitos particulares siempre quedan por confirmar.
- Cartografía: límites simplificados de Natural Earth, no una referencia legal de fronteras; no solicita geolocalización. Si la interacción de arrastre no está disponible, usar los botones de país y rotación.
- QA: pruebas de reglas y separación territorial, TypeScript y compilación. El rebranding se comprobó en navegador a 1440 × 1000 y 390 × 844: entrada como invitado, selección de México y catálogo, imágenes sin fallos, ausencia de desbordamiento horizontal móvil y marca sin animación con movimiento reducido. No es una auditoría integral de accesibilidad. Se preservan las dos herramientas WebMCP previamente verificadas.
- Corrección territorial del match (17/09/2026): 24 pruebas automatizadas cubren los seis catálogos nacionales, opciones transfronterizas desde los 20 países, exclusión de convocatorias cerradas y migración de perfiles. En navegador se completó el cuestionario con México y Brasil, se comprobó que no aparecen departamentos, se verificaron el aviso para Ecuador, la edición tras recargar y la migración de un perfil antiguo de Cusco sin perder objetivos. La vista móvil de 390 × 844 no mostró desbordamiento horizontal.
- Logos: si una imagen falla, se muestra el nombre de la institución como texto, no un logo inventado. El original de ITP tiene resolución limitada (137 × 72). Los logos se muestran sin alterar sus proporciones o colores.
- Formularios: validación de origen exacto, JSON acotado a 3000 bytes, campos cerrados y SQL parametrizado. Honeypot en newsletter/propuestas y límites anónimos de 20 peticiones/minuto por IP y 200 por punto de presencia. No son protección perfecta contra bots ni un techo de facturación. La baja exige un código privado de 256 bits; si se pierde, la responsable gestiona la solicitud proporcionalmente. No activar campañas sin verificar correos y configurar doble opt-in.

## Umbral de aprobación humana

La publicación de una nueva ficha o el cambio de monto, fechas, gratuidad, elegibilidad o enlace debe revisarlo la persona responsable del catálogo contra la fuente oficial. Nunca se marca una admisión como aprobada: la decisión pertenece a la institución. Cambiar de acceso privado a público requiere instrucción del propietario del sitio.

Cada sugerencia recibida queda en estado `pending` hasta revisión de la fuente, condiciones, logo y vigencia. No promoverla al catálogo por volumen de votos ni por recibir un formulario; no usar la lista de correos para campañas sin verificar consentimiento, bajas y proveedor elegido.

## Mantenimiento

Refuerzo de costes (17/09/2026): la propietaria decidió mantener Workers Paid. Se desplegaron límites de 50 ms CPU/10 subpeticiones, 60 páginas/minuto/IP y los límites de formularios existentes. Se añadieron cupos globales diarios de 200 correos, 100 propuestas y 1,000 matches compartidos, índices de bajas/retención y desactivación de logs persistentes. Las bajas no consumen cupo diario. Se verificaron 39 pruebas y la integración local, más respuestas HTTP del dominio público. Decisión: controles simples dentro del Worker/D1 y avisos gestionados de Cloudflare; no construir otro servicio de monitorización ni activar builds automáticos mientras no hagan falta. Los cupos controlan recepción/crecimiento, no garantizan un máximo monetario. `docs/PRODUCTION.md` describe límites, operación y riesgos residuales. El registro de alertas vive en la cuenta Cloudflare, no en GitHub; su destinatario no autoriza publicar ese correo en Privacidad.

Responsable: propietario/editor de Mapping; no hay un mantenedor externo contratado.

- Corrección del mapa del 17/09/2026: los grupos de stickers y resultados tenían claves React iguales al cambiar de país; ahora usan prefijos distintos para evitar nodos decorativos huérfanos. El SVG impide selección y arrastre nativos con CSS y eventos, para prevenir el resaltado azul observado; esta causa del azul es una hipótesis basada en la captura, no una reproducción en navegador. No se desactiva la selección de texto de las fichas ni la navegación por teclado.
- Los stickers del mapa tienen entrada escalonada de 650 ms y flotación de hasta 9 px/3 grados con periodos diferentes. Conservan espacios separados en escritorio/móvil. `prefers-reduced-motion` desactiva ambas animaciones. Las notas anteriores sin bucles describen versiones previas al mapa plano.
- Verificación de esta corrección: 34 pruebas automatizadas, incluidas identidades de elementos, protección de gestos, regreso al país y reglas de movimiento reducido; TypeScript y compilación de producción. No se realizó QA interactivo de navegador en esta revisión.

- Revisar semanalmente convocatorias con cierre próximo y mensualmente recursos permanentes.
- Abrir la fuente oficial antes de actualizar `checkedAt`; que un enlace responda no sustituye la revisión de contenido.
- Para añadir una ficha: copiar una estructura existente en `lib/opportunities.ts`, `lib/latam-opportunities.ts` o `lib/regional-opportunities.ts`, asignar ID único, llenar todos los campos y validar la fuente. La cantidad visible se calcula del catálogo; actualizar la expectativa del test si cambia el tamaño.
- No reutilizar fechas de una edición anterior para anunciar una nueva.
- Revisar con prioridad las fechas y condiciones de Platanus, 500 Global, Latitud y Rockstart: inversión por participación no equivale a subvención. Confirmar la nueva cohorte antes de cambiar `status`.
- Usar `npm run check:links` para detectar cambios de rutas. Revisar manualmente 403, 429, timeouts y redirecciones.
- La lógica de afinidad vive en `lib/match.ts`. Ajustar pruebas cuando cambien reglas.
- Para incorporar otro país: verificar sus fuentes, agregar `countryCode` ISO alfa-2 y `geography` con su nombre del atlas. La selección y los conteos se actualizan con las fichas; los beneficios globales permanecen separados. El cuestionario deriva los países de `atlasCountries`. Usar `matchScope` solo cuando la fuente editorial confirme alcance regional; añadir pruebas de inclusión local, exclusión de otros países y alcance transfronterizo.
- Verificar y publicar otra vez tras editar datos o código. No existe actualización automática en segundo plano.
- Consultar las tablas privadas desde Cloudflare D1 con acceso autorizado. `docs/PRODUCTION.md` incluye consultas agregadas sin correos. No exponerlas con GET público ni guardar exports en GitHub. El formulario no es una bandeja de administración.
- No editar migraciones ya aplicadas. Para cambios de esquema, actualizar `db/schema.ts`, correr `npm run db:generate`, inspeccionar el nuevo SQL y probarlo localmente antes de publicar.
- Revisar dependencias y el gasto/abuso de escrituras antes de abrir el sitio al público. Implementar protección antispam y un proveedor de correo con doble opt-in si se lanzan campañas; mantener baja disponible.
- Mantener los stickers separados del símbolo de combi. Para cambiarlos, regenerar los assets y actualizar `components/brand-sticker.tsx`, dimensiones y pruebas. Son decorativos y no deben recibir interacción falsa. Conservar transparencia, colores sin filtros y movimiento reducido. Prompts actuales en `public/brand/STICKERS-PROMPTS.md`; tokens y posiciones adaptables en `app/globals.css`. La interfaz usa Geist; Bowlby y los carteles antiguos se conservan como historial, no como tipografía activa.
- Verificación del rebranding minimalista: 25 pruebas automatizadas aprobadas, TypeScript sin errores y compilación de producción completada. Las pruebas cubren assets RGBA, eliminación del póster de la interfaz, navegación de entrada y reglas de movimiento reducido. No se realizó QA de navegador de esta versión; las verificaciones de navegador descritas arriba pertenecen a versiones anteriores.
- Limpieza editorial del 17/09/2026: eliminados los encabezados «Explora a tu manera», «EL MAPA SE HACE ENTRE TODOS» y «OPORTUNIDADES PARA EMPRENDER EN LATAM», el texto descriptivo repetido bajo cartel/catálogo y el resumen duplicado de cifras del catálogo. El conteo de resultados sigue disponible para lectores de pantalla, pero ya no se muestra debajo de «Descubre oportunidades». Se conservan los conteos por país, filtros y mapa, que aportan contexto funcional.
- Para una nueva ficha, agregar su logo oficial a `public/logos/`, registrar su fuente y asignarlo en `lib/provider-logos.ts`. No generar marcas de instituciones con IA. No aplicar filtros globales de escala de grises: las banderas y los logos deben conservar su color.
