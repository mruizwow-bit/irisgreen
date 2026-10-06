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
