# Nexo · Revisión de IRIS_GREEN_WEB_R02
Fecha: 2026-10-06
Gate: NEXO_WEB_R02_KEEP_NAVIGATION_AND_COMPONENTS__VISUAL_CONTENT_AND_QA_PATCH_REQUIRED
Entrega de diseño navegable; NO HUMAN QA PASS · NO MAIN · NO PUBLIC DEPLOY.

## Base y alcance real
ZIP SHA256 f4e2dd62a4f92fcf1e4ea12d7bd7cb8d8496768ad6eab416bea1f47b4d0b4281, coincidente con .sha256 adjunto.
193 archivos: 56 páginas públicas (28 ES + 28 EN), fuentes, imágenes, generador, pruebas y capturas.
Verificación independiente: HASHES 192/192; manifest 191/191; procedencia 18/18 hashes. Las dos líneas de cabecera de HASHES no son entradas ni fallos.
Regeneración en copia independiente mediante gen/generar.py: 0 archivos cambiados. Enlaces/assets locales de las 56 páginas: 0 destinos de archivo inexistentes en comprobación estática.
Leídos app.js, ajustes-pronto.js, CSS, generador, cuerpos HTML, procedencia y banco. Revisadas capturas entregadas de portada 320/390/1440 y áreas Creación/Descubrimiento/Juegos.
Dos reproducciones independientes ejecutan el app.js original en Node VM con DOM mínimo: rama resize de menú y error al guardar ajustes. No son pruebas de navegador ni lector de pantalla.
Las 47 pruebas Chromium siguen siendo evidencia del autor; no las he repetido aquí. Capturas revisadas pertenecen al paquete, no son un render independiente.

## KEEP
Seis áreas canónicas, sin Intereses/Taller duplicados en navegación. Juegos separado de rutinas; apoyos relacionados con pictogramas en Recursos. NAVY y fuentes locales; navegación HTML; ES/EN; buscador indexado y filtros; estados de experiencias no conectadas declarados. Imágenes reales en las seis puertas.
La home de 390 mejora al combinar imagen lateral y acción. Creación recupera identidad propia mediante su taller y mesas. Conservar esto sin pedir rediseño total otra vez.
El mapa y la hoja sirven como ilustraciones de área; no prueban cobertura de Información ni equivalen a imágenes de Rincón/Pecera.

## P1 · Imágenes: bytes intactos no significa encuadre íntegro
CSS .tarjeta__imagen impone aspect-ratio:3/2 y object-fit:cover a láminas 1086×1448 (3/4). En ese contenedor sólo se conserva aproximadamente la mitad de la altura original: la captura Descubrimiento 1440 corta cabeza del carbonero, parte de la amapola, bordes de amatista/moneda.
.puerta__dibujo img aplica cover cuadrado también a retratos y escenas completas.
Corregir por tipo: contain o proporción natural para espécimen/constelación/moneda y storyboard; recorte editorial sólo para escenas donde no elimina contenido necesario. No editar ni regenerar masters.
Corregir dimensiones HTML: construcción 1440 declara height960 pero el PNG mide1440×900; variante390 declara390×260 pero mide390×844. Evitar reserva de espacio con proporción falsa.
Revisar resultado en320/390/1440; no basta naturalWidth>0 ni hash.

## P1 · Referencias históricas y promesas de producto
Construcción usa el F01 antiguo de Prisma (artifact11348661943, gate READY_FOR_HUMAN_QA), bajo nombre «El Vado» y copy «escena aprobada». Ese gate no acredita HUMAN QA ni que el dibujo represente el juego3D actual. María ya rechazó el resultado plano y estamos preparando Vera nueva.
Sustituir por imagen del prototipo3D vigente cuando esté disponible y revisada. Mientras tanto identificar referencia provisional en revisión interna; no certificarla como escena final aprobada ni alterar el storyboard antiguo para fingir3D.
Cielo enseña la figura completa y nombra Orión en alt antes de entrar, incluida home. Para la ruta inicial de descubrimiento mantener imagen de cielo sin resolución del primer objetivo; usar assets existentes apropiados, no generar astronomía. Reservar la identificación/figura para profundidad o rutas explícitas de objetos ya descubiertos.
Caballito de mar es lámina heredada del catálogo: no prometer que aparece en el tramo mesopelágico entregado. Puede representar el tema general si se diferencia del contenido de esta experiencia; preferible imagen representativa del paquete realmente conectado.
La procedencia distingue repositorio antiguo4893d3c y storyboard posterior: no afirmar que todo sale del mismo commit. Estar en el repositorio no acredita aprobación vigente.

## P1 · Estado público y copy
«Lo que ya puedes explorar» enlaza fichas cuyo Explorar termina en experiencia no conectada. Mostrar disponibilidad antes del clic: «Conoce las experiencias»/«En preparación» hasta integración; cuando se conecten, CTA directo al runtime correcto y retorno a su ficha.
experiencia.html ignora tema=cielo/peces y ofrece dos retornos indistintos: mantener contexto aun en estado pendiente.
Retirar del flujo público debates de producción: «Ordenar los pasos de una rutina no es un juego», «no se enseña una versión falsa», «la escena que ves es la aprobada», «no hay precios ni condiciones que aceptar» y comentarios sobre llegada de descripción. Dejar lenguaje útil breve y trasladar decisiones al README.
No definir por adelantado todos los juegos como «sin puntuación» ni Plus como «parte más amplia de cada tema». Conservar Para todos/Plus como estructura pendiente, sin inventar beneficios o reparto.
Creación afirma guardado, privacidad y deshacer para mesas aún desconectadas. Declarar estos contratos por experiencia al integrarla, sin convertir una intención futura en función ya comprobada.
La lista heredada de «los otros cuatro temas» no es inventario completo de Descubrimiento: incluir/reconciliar Fósiles y los demás temas desde el registro canónico, con estado real, sin fabricar experiencias.
No confundir una galería de láminas con la experiencia EXPLORE→LOCATE→REVEAL.

## P1 · Menú y ajustes
MENU_RESIZE_FOCUS: abrir enfoca Cerrar; al alcanzar1100px abrir(false,false) no traslada foco y CSS oculta .menu-cabecera. Fixture conserva el foco en ese botón ahora oculto. En navegador puede quedar en ese nodo o caer a BODY: ambos requieren destino explícito coherente (enlace de área correspondiente o control visible). Probar desde Cerrar y utilidades móviles, no sólo desde enlaces que sobreviven.
El banco actual acepta a===document.body como foco visible, así que ese PASS no acredita continuidad.
STORAGE_FAILURE_NOTICE: setItem lanza, el catch ignora y aun así se anuncia «Ajuste guardado en este navegador». Reproducido con app.js original. Aplicar temporalmente y anunciar sin prometer persistencia; guardar aviso sólo tras éxito.
Reconciliar preferencia efectiva: CSS responde a reduce del sistema, pero radios inician normal sin consultar esa preferencia; validar valor almacenado y mostrar estado efectivo. No clasificar esto por sí solo como incumplimiento normativo.
El selector de esta web sólo cambia atributos/CSS del contenedor. No controla todavía Cielo/Peces/Ritmo desconectados; antes de prometer «toda la web» acordar adaptador con cada runtime, conservando elecciones del usuario.

## P1 · Oráculos de las47 pruebas
El test «nada se corta dentro de su caja» inspecciona sólo overflow hidden horizontal de main. No compara scrollHeight/clientHeight, no cubre overflow:clip ni estados abiertos/cabecera. No demuestra ausencia de clipping vertical al200%.
Targets se comprueban sólo en CLAVE, no56 páginas/ambos idiomas; excepción inline excluye cualquier enlace cuyo padre tenga otro texto, que puede excluir controles independientes. Si la regla interna es44×44, medirla explícitamente, no altura44/ancho24.
Resize debe exigir destino visible concreto, nunca BODY. Añadir fallo de localStorage y preferencia del sistema.
La prueba de ancla cubre un destino en escritorio: no demuestra todos los anclajes con cabecera de altura variable a200%.
No necesidad de ampliar banco sin fin: cerrar estos riesgos con casos que fallen sobreR02 y pasen sobrepatch. No declarar lectores/táctil real/Firefox/Safari comprobados.

## P2 · Composición
A320 la home apila imagen y texto ya a tamaño normal porque84+14+11rem supera el espacio interior. Contradice la descripción de miniatura lateral en móvil; no es clipping ni obligación de meter seis áreas en un viewport.
Mantener imagen reconocible con columna compacta y texto flexible en320; permitir apilado cuando crece el texto. No reducir fuente/targets.
En Juegos, la tarjeta vacía «Más juegos» se estira a toda la altura de Construcción. Sustituir por nota breve; dar prioridad al contenido existente.
En Descubrimiento, las cuatro opciones no disponibles reciben imágenes mucho mayores que las dos experiencias principales. Dar jerarquía a destinos utilizables y usar avance secundario para el catálogo futuro.
En Creación, ubicar la entrada a la primera herramienta cerca del inicio cuando exista; no enterrarla detrás de seis mesas cerradas y cuatro tarjetas explicativas.
Imágenes de portada llevan descripciones extensas dentro del enlace (la del taller enumera seis personas/acciones). Simplificar nombre accesible a área+acción; si la imagen es decorativa en esa puerta usar alt vacío, manteniendo descripción donde aporta información. El banco debe permitir alt vacío justificado en vez de exigir texto a toda imagen.

## P2 · Documentación
MANIFEST.imagenes y pendientes aún dicen que faltan imágenes presentes y que María no concedió lectura; README§9 conserva lo mismo. Reconciliar sitio.json, estados y manifest con el paquete real.
LICENCIA-MULBERRY.txt contiene aviso y URL CC BY-SA4.0, no el texto completo que anuncia README. Describirlo como aviso de licencia o adjuntar lo que se promete. Esta revisión no emite validación jurídica ni verifica derechos de todo el repositorio.
La fuente IG Zero no viaja y figura primera en CSS. Usar Atkinson para esta entrega según canon o documentar incorporación explícita y volver a medir con sus bytes; no cambiar silenciosamente la tipografía al integrar.
Hay una fuente central de navegación, pero cuerpos ES/EN conservan nombres/imágenes/copy propios: regeneración idéntica demuestra reproducibilidad, no que todo texto esté gobernado por sitio.json.

## Orden siguiente, sin reabrir lo que funciona
Patch de encuadres + representatividad de imágenes + estados/copy + menú/guardado + pruebas señaladas.
Conservar arquitectura, componentes útiles, NAVY, ES/EN, fuentes y assets originales. No esperar Vera nueva para arreglar el resto. La imagen de Juego3D es dependencia de integración, no motivo para rehacer esta web.
Entregar ZIP nuevo, hashes, capturas de mismos anchos y casos reparados. Separar explícitamente:
1. Revisión de diseño/navegación.
2. Conexión de runtimes y contenido real, cada cual con su gate.
3. HUMAN QA María sobre recorridos realmente disponibles.
La web completa conectada todavía no está entregada; una carcasa navegable puede revisarse sin fingir esas conexiones.


## Consolidación con Prisma · orden vigente del patch · 2026-10-06
Entrada: conclusiones de Prisma trasladadas íntegramente por María en esta conversación. Se integran con la revisión anterior, no son un rediseño ni una orden alternativa.
Estado conjunto: PATCH_REQUIRED_BEFORE_HUMAN_QA.
Gate Prisma comunicado: WEB_R02_KEEP_NAVIGATION_CORE__ASSET_ASSIGNMENT_A11Y_ALT_AND_PRODUCT_STATUS_PATCH_REQUIRED.
Conservar arquitectura, componentes, seis áreas, NAVY, ES/EN, sitio.json, buscador/filtros, perfiles de movimiento, responsive y procedencia. No volver a construir la web desde cero. NO MAIN · NO PUBLIC DEPLOY.

### Decisiones y aceptación
1. **Encuadres y dimensiones.** Especímenes/constelaciones/monedas y storyboard íntegros mediante contain o proporción natural. Cover sólo si el encuadre preserva el contenido pertinente. Corregir width/height de Construcción. Revisar cabeza de ave, flor, mineral y moneda en320/390/1440. Masters intactos.
2. **Asignación semántica.** Registro con subjectVerified, role, assignmentStatus, approvedFor, gate, license, alt por idioma y focalPoint cuando haya recorte; además sourceRef y hash. Distinguir rol del archivo y rol de cada colocación: la misma imagen puede ser informativa en ficha y redundante en un enlace. Campos desconocidos explícitos; no rellenar PASS por estar en el repositorio. Filename no decide sujeto.
3. **Cielo.** Puerta neutra de exploración, sin figura/nombre de Orión anticipados tampoco en alt. EXPLORE→LOCATE→REVEAL. Reutilizar material existente apropiado; no generar estrellas ni alterar masters.
4. **Construcción.** Precisión sobre APPROVED_DESIGN_PREVIEW: el gate disponible del artifact11348661943 es READY_FOR_HUMAN_QA, no HUMAN QA PASS. Registrar DESIGN_PREVIEW / HUMAN_QA_PENDING; no añadir APPROVED sin evidencia de esa aprobación concreta. No es captura del juego3D final. Sustituir por captura del runtime3D cuando exista y se revise; no detener el resto del patch por esperar esa imagen.
5. **Disponibilidad/copy.** Estado por experiencia antes del CTA: disponible, vista previa o en preparación, según entrega conectada real. No prometer explorar/guardar/deshacer/privacidad sin respaldo operativo. Conservar retorno contextual por tema en página pendiente. Sin debates internos en sobre.html ni páginas públicas. Sabik se trabaja aparte; no modificarlo como parte de este patch.
6. **Migas.** Retirar Inicio › … / Home › … desde generador y plantillas, regenerar ES/EN y quitar espacio reservado. El código generar.py:migas confirma su presencia. La atribución de regresión ya cerrada en#369 procede del informe recibido de Prisma; no se ha reconstruido aquí ese historial. Es decisión de producto para esta web, no prohibición universal de breadcrumbs. Conservar navegación global, título y aria-current; no quitar retornos útiles de experiencias.
7. **Menú/foco.** Resize con menú abierto hacia escritorio debe dejar foco en destino visible y lógico. Probar desde Cerrar y utilidades que desaparecen. BODY no es PASS; conservar cerrar/Escape/tabulación.
8. **Persistencia/movimiento.** Mensaje guardado sólo tras setItem exitoso. Si falla, ajuste temporal y aviso honesto. Preferencia mostrada debe coincidir con efectiva (sistema/usuario); no prometer control de runtimes aún desconectados.
9. **Alt por función.** ALT_APPROPRIATE_FOR_IMAGE_ROLE sustituye obligación indiscriminada de alt no vacío. Redundante dentro de enlace con nombre suficiente: alt="". Imagen que aporta información: alternativa pertinente. Imagen única de un control: nombre de acción/destino. Probar nombre accesible completo, no sólo presencia de atributo.
10. **QA200%.** Añadir contraejemplos de clipping vertical y overflow:clip, cabecera, menú y estados abiertos; foco visible y targets del canon44×44 con excepciones justificadas, sin eximir por cualquier texto vecino. Conservar alcance limitado de las pruebas previas y separar fixtures, navegador y AT. No inventar PASS dispositivo físico.
11. **Documentación.** Un registro operativo de disponibilidad/asignación alimenta derivados. Reconciliar README, MANIFEST, PROCEDENCIA y texto público; eliminar pendientes resueltos sin borrar los reales. La regeneración debe seguir siendo reproducible.
12. **Lenguaje.** En esta entrega describir el enfoque como lenguaje claro / plain language. No afirmar Easy Read/Lectura Fácil ni conformidad con ISO sólo por una etiqueta: esas afirmaciones requieren evidencia específica. Verificado en fuente: generar.py, sitio.json y lectura-accesible contienen Easy reading. Corregir ambos idiomas de manera coherente sin renombrar rutas y romper enlaces innecesariamente.
13. **Carga.** Recuento propio:56 páginas finales,48 img sin loading ni decoding. El96 de Prisma puede incluir plantillas; no atribuir96 a páginas finales sin reconciliar inventario. Aplicar loading=lazy a imágenes fuera de primera pantalla; NO a imagen principal/LCP ni indiscriminadamente a puertas visibles inicialmente. decoding=async donde resulte adecuado no equivale a lazy ni garantiza mejora. Derivados/thumbnails/srcset si reducen transferencia, dimensiones/sizes correctos, relación con master y hashes; originales intactos. Probar primera carga y scroll; no fijar número de img lazy como oráculo de rendimiento.
14. **Plus.** Conservar ámbito Para todos/Plus en registro. Sin reparto, beneficios, precios ni checkout inventados; presentación pendiente discreta cuando sea necesaria, sin CTA comercial. Ocultar el reclamo comercial hasta decisión correspondiente; no bloquear contenidos disponibles por ausencia de esa decisión.
15. **Espacio tranquilo/Creación.** Hoja=mood art del área, no Pecera/Rincón. Mesas=taller general, no captura de Ritmo. Reconciliar assets existentes del proyecto antes de pedir nuevos; mantener pendientes de representación específica explícitos, sin rediseñar áreas dentro del patch.

### Procedencia, prioridades y entrega
mapa/Mulberry/Orión/taller/hoja/láminas: referencias del repositorio4893d3c según paquete.
construccion-vado-1440.png y390.png: storyboardR02, run37318454037, artifact11348661943. No todo viene del commit de septiembre.
Primero encuadres/asignación/estados y defectos menú/persistencia; después lenguaje, documentación y carga, verificando el conjunto. Mantener mejoras de composición señaladas arriba; no inventar otros temas ni eliminar Fósiles del inventario por copiar sólo las cuatro láminas antiguas.
Entregar un ZIP patch con versión inequívoca, SHA256, changelog ligado a los15 puntos, estados/dependencias reales y capturas comparables. Mantener documentación interna separada del flujo público.
Secuencia: PATCH → NEXO RETEST → AXIOMA PRECHECK → HUMAN QA MARÍA. Este registro no ejecuta ni aprueba el patch. Unificar el encargo para el ejecutor asignado; no dos implementaciones simultáneas.

Fuentes técnicas contrastadas para estos matices:
- https://www.w3.org/WAI/tutorials/images/decision-tree/
- https://www.w3.org/WAI/tutorials/images/decorative/
- https://web.dev/learn/performance/lazy-load-images-and-iframe-elements


## Incorporación Axioma · mismo patch consolidado
Revisión remitida por María: #369 comentario6014091277.
Gate: AXIOMA_WEB_R02_KEEP_ARCHITECTURE_AND_REAL_IMAGE_HOME__PATCH_REQUIRED_BEFORE_HUMAN_QA.
Axioma informa revisión del ZIP exacto f4e2dd62…b4281,192/192 hashes,191/191 manifest,18/18 procedencia y regeneración56 páginas sin diferencias. Informa contraste de16 assets atribuidos al commit4893d3c y su tamaño registrado; no convertir comprobación de existencia/tamaño en comparación de hashes contra ese commit si no se documentó.
Coincide con el KEEP y los defectos ya consolidados; no genera otra implementación ni un nuevo rediseño.
Precisiones que el ejecutor debe cubrir en el mismo patch:
- Migas: Axioma registra27 páginasES+27EN. Retirar desde fuente y comprobar derivados en ambos idiomas, manteniendo navegación/retornos pertinentes.
- Documentación: incluir página pública Accesibilidad además de MANIFEST/README. En sobre.html retirar «Contenido de esta sección pendiente de redactar con María» del flujo público; redactar sólo contenido confirmado o retirar bloque pendiente. No inventar biografía, compromisos ni servicios.
- Mulberry: LICENCIA-MULBERRY.txt es aviso+enlace, no texto completo. Corregir la promesa del README (o adjuntar texto íntegro si ese fuera el entregable), conservando atribución/licencia existente. Axioma aporta https://mulberrysymbols.org/ como fuente; esta actualización no es dictamen jurídico ni revalidación independiente de derechos.
- «47/47» permanece como resultado del banco del autor con su alcance: no se invalida aritméticamente por no probar clipping vertical ni se eleva a conformidad global.
Secuencia ratificada: PATCH R02 → RETEST NEXO → PRECHECK AXIOMA → HUMAN QA MARÍA. NO MAIN · NO PUBLIC DEPLOY · NO REGENERAR MASTERS.
