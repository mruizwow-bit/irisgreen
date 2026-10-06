# Claude Design · Vida marina · Correcciones R03 y siguiente prototipo
Fecha: 2026-10-06. Emisor: Nexo, por petición de María.
Decisión: KEEP_CORE · TARGETED_REWORK_BEFORE_SCALE.
Orden documental lista para entrega a Claude; no implica recepción ni ejecución.

## 1. Base y fuentes
Conservar motor, dirección visual, cámara navegable, gesto directo, composición alfa, assets aprobados y contrato ACTION → CONSEQUENCE → INFERENCE → REVEAL.

Base R03 exacta:
- APP SHA256: 8db78a2746d5171331813fb6757d30eacbea0e4cbbe2227f3a17470c0fe5a144
- ASSETS SHA256: 70f8624f441fc4c42cb84fe5382e8f0e7e0866a71f53572ec733c66a941d58cc
- Vídeo SHA256: 0e26985a0b82dad2799c18c3da31838223f96599e4b1463aa7a187a2f228dad4
- Consolidación Nexo/Prisma/Axioma: CONSOLIDACION_ABIERTA_NEXO_PRISMA_AXIOMA.md en este directorio, commit 96af70306bff3f2b7b9f9cadaffe9ea69ce11097. Contiene referencias y atribución de pruebas.
Si falta un binario, identificarlo; no reconstruir animales ni fingir acceso.

## 2. Primer entregable: patch R03 ejecutable

### Interacción y continuidad
- pointercancel limpia el gesto y nunca apunta, selecciona o examina. Cancelar no añade acción; no se exige deshacer un pan ya visible.
- Clic/tap quieto funciona aunque dure más de 420 ms. Separar arrastre por desplazamiento; contemplar cancelación/multitouch sin dobles acciones.
- Puntero igual de preciso en NORMAL/REDUCED/NONE; quitar cuantización 1/14 de la entrada directa.
- Cambiar Movimiento conserva posición, pose, encuadre y objetivo. NONE congela el estado visible; no devuelve animales a anclas.
- Giro dependiente del tiempo dt, coherente a 30/60/120 Hz.
- Si desaparece el candidato enfocado, conservar temporalmente su nodo o transferir foco a un destino estable y lógico. Nunca BODY como efecto accidental.
- Enter/Espacio con varias señales comunica cuántas hay y cómo elegir; no elige por la persona.
- Reanunciar feedback importante tras acciones deliberadas repetidas, con control para no saturar el live region.

### Pantalla y controles
- Acción contextual junto a la escena, alcanzable sin buscarla bajo instrucciones largas. Ayuda, fuentes y explicación extensa secundarias.
- Quitar Subir/Bajar tramo mientras no haya destinos reales.
- Ratón/touch: clic directo orienta luz; drag mueve cámara. No volver a una retícula obligatoria ni a crucetas como vía principal del ratón. Flechas físicas del teclado equivalentes; alternativa de puntero simple al drag.
- Conservar Encuadrar e iluminar como ayuda guiada explícita: avisar de encuadre/zoom/pausa. Orientación relativa opcional; no obligar a buscar antes de pedir ayuda.
- Revisar alt/texto repetidos en visor según información aportada por imagen.
- Comprobar en touch físico que se puede desplazar también la página sin quedar atrapado en la escena.

### Producto, contenido y rendimiento
- Generar build de producto y build de equipo separadas. Producto sin selector privado, intake, fixtures ni rutas/datos técnicos accesibles. No depender de recordar cambiar una bandera.
- Corregir «tramo validado» donde sólo hay asignación HEREDADO. Taxón/talla/zona pendientes siguen pendientes; no añadir especies a escena pública sin respaldo.
- Versionar runtime, contenido, esquema y guardado con compatibilidad/migración explícita. No perder álbum por renombrar una clave.
- Carga por escena/vecindad, resolución adecuada y liberación de recursos. WebP/AVIF reduce descarga, no garantiza menor RAM decodificada a igual resolución. Preservar geometría y alfa.
- Mantener los assets originales aprobados. Cualquier defecto anatómico del par se reporta con evidencia, no se redibuja silenciosamente.

### Evidencia y entrega
- ZIP portable abierto desde extracción limpia con file://, fuentes locales y cero dependencias externas; manifest y SHA256.
- Pruebas de los casos anteriores, incluidos candidato enfocado que desaparece, varios candidatos, clic lento, cancelación y transiciones de Movimiento.
- 320/390/1440 y texto 200 %: comprobar clipping interno y solapamiento, además de scrollWidth. Estados: escena, identidad, varios candidatos, controles, ajustes, álbum y visor.
- Natación: continuidad de trayectoria/pose/giro y vídeo continuo. Píxeles cambiados no equivalen a natación convincente.
- Barrido luz→oscuro de cada par usado; anatomía, transparencia, postura y máscara alineadas.
- Declarar qué se probó en navegador/dispositivo real y qué queda pendiente. No afirmar lector de pantalla/touch físico/móvil de gama baja sin ejecutarlo.
- Gate de entrega propuesto: CLAUDE_MARINE_R03_TARGETED_PATCH_READY_FOR_REVIEW. No Axioma PASS ni HUMAN QA PASS.

## 3. Siguiente prototipo: una microescena viva y completa
Preparar su diseño/inventario mientras se corrige R03. Implementación sobre la base revisada; no ampliar aún a 200 especies.

Propuesta: roca y borde de arena en una localidad documentada, si el inventario real lo permite. Objetivo orientativo 8–10 animales y hasta seis encuentros distintos; no inventar convivencia ni conducta para cubrir números.

Encuentros candidatos:
1. Animal visible en tránsito.
2. Indicio en grieta.
3. Animal parcialmente oculto bajo saliente.
4. Camuflaje o semienterramiento en arena.
5. Pequeño grupo/cardumen.
6. Conducta observada documentada: alimentación o relación entre especies.

El escenario interviene en el descubrimiento: refugios, oclusiones, pistas, posición y conducta. No poner algas/rocas como decoración idéntica en todos los hábitats. En 2D, definir cómo funciona asomarse: vistas discretas o geometría/capas reales; pan por sí solo no revela detrás de una roca.

Un clic sobre indicio tiene una consecuencia visible y comprensible; Examinar identifica explícitamente. Definir por estado cuándo el clic apunta luz o selecciona para que no haga ambas cosas de forma ambigua. Sin persecución de precisión, espera obligatoria, recompensas arbitrarias ni minijuegos añadidos.

El primer dato explica lo observado en ese encuentro. Después, ficha y fuentes opcionales. Volver conserva lugar y estado.

Separar:
- Movimiento: NORMAL / REDUCED / NONE.
- Densidad ambiental: baja / normal / alta, sólo para elementos prescindibles.
En NONE: estados discretos y avance voluntario, sin animación automática. Ninguna preferencia elimina animales, pistas esenciales o información.

Modelar por separado locomoción individual, conducta y agrupación. Una misma especie puede nadar con una familia y participar en cardumen. Metadatos con fuente por taxón, hábitat/localidad, profundidad, refugio, pista, rasgo y encuentros permitidos; desconocido no significa libre asignación.

Entregar experiencia completa, no sólo storyboard: entrada→exploración→indicio→acción→consecuencia→identificación→explicación→retorno, con ayudas equivalentes.

Tras observación María de esta microescena, ampliar hasta doce encuentros en tres contextos para probar reutilización (no doce adicionales obligatorios). Cinco/ocho hábitats y 200–280 plazas son hipótesis de capacidad, no cobertura de especies únicas. Mantener matriz de cobertura real del inventario.

## 4. Canon visual obligatorio
Sólo NAVY, sin selector claro.
- Fondo general #0B1A2B
- Paneles #15304A; superficie secundaria #1D3D5C
- Texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA
- Acento/foco #C3B8FF; bordes controles #8494A8; separadores #2A4460
- Botón principal fondo #DCE8F2 y texto #0B1A2B
- Cuerpo Atkinson Hyperlegible 1rem, interlineado 1.6
- Títulos Newsreader 600, interlineado 1.2
- Portada Newsreader 400, 40–56 px adaptable, interlineado 1.06
- Introducción Atkinson Hyperlegible ~19 px, interlineado 1.58
- Targets ≥44 px; foco independiente de selected; teclado, forced-colors, ES/EN y reflow.
Escena protagonista; no reducir fuente/targets para encajar.

## 5. Límites
No rehacer assets aprobados. No ampliar automáticamente lote privado a producto.
No main, no despliegue público. La orden no sustituye revisión independiente ni HUMAN QA María.
