# Nexo · Construcción 3D «El vado» · Código, investigación y propuesta

Fecha: 2026-10-06. Estado: KEEP_3D_FOUNDATION · FIX_INPUT_AND_STATE · DEVELOP_BUILDING_GAME_LOOP.
Propuesta de evolución, no autorización de main ni despliegue. ZIP original intacto.

## 1. Qué se ha revisado y qué demuestra

Entrada: iris-green-3d-vado.zip, 1 885 597 bytes.
SHA256: 308c370ef5b2dfce69fa8e0f7865d957390aa40a290d8f46145eb2a99fc1e59c.
32 archivos extraídos; SHA256SUMS.txt valida 30/30 archivos (el listado y MANIFEST.txt quedan fuera de esa lista).
Leídos los ocho módulos propios de JS, HTML, CSS, README y banco jugar.mjs/resultados. Inspección visual de capturas entregadas 03-puente, 06-parcela y 07-movil.
Ejecutadas funciones originales en Node VM, con estados construidos, y geometría original con Three.js r149 sin WebGL. Se entregan reproduce.cjs/REPRODUCTIONS.json y geometry.cjs/GEOMETRY_RESULTS.json.
No se ha jugado ni renderizado en navegador en esta revisión. No medidos GPU, móvil físico, lector de pantalla, sensación de cámara, animación continua ni diversión. Las capturas y la partida de Playwright son evidencia del autor, no propia. No HUMAN QA PASS.

## 2. Conclusión de producto

Sí es 3D real. Es una base de construcción recorrible, claramente superior al cuadrado/punto anterior. El README delimita honestamente una escena pequeña de comprobación; no debe juzgarse como si afirmara entregar un Dragon Quest Builders completo.

Pero el siguiente salto no se consigue solamente ampliando el terreno o embelleciendo los cubos. Actualmente se termina una secuencia de instrucciones. Falta un ciclo en el que la persona elija qué quiere construir, consiga recursos, transforme el lugar, vea una utilidad y tenga una nueva razón para continuar.

La prueba más clara: colocando y retirando el mismo bloque tres veces se completa la parcela y quedan cero piezas. No es una infracción de la regla programada; es evidencia de que la regla mide uso del control, no un resultado de juego.

## 3. Cómo está hecho y qué conservar

| Capa | Implementación real | Valor y límite |
|---|---|---|
| config.js | Mapa 18×12, alturas, costes, alcance, tres nodos, caja, tres piezas | Un conjunto pequeño legible; reglas y contenido todavía unidos al único escenario. |
| world.js | Altura por columna + diccionario de piezas x,y,z; superficies; propagación de soporte cacheada | Permite construcción 3D sin física pesada. No es aún un terreno voxel editable completo: no hay excavación de terreno ni cuevas excavables. |
| build.js | Validación, inventario, apoyo, retirada dependiente, historial | Buena separación de reglas y dibujo. Deshacer y cargar deben preservar invariantes. |
| player.js | Movimiento relativo a cámara; colisión por ejes; apoyo; rampas; interacción por distancia horizontal | Personaje que usa lo construido. Faltan casos de soporte retirado, altura de interacción y futura habitabilidad. |
| escena3d.js | Three r149 local, PerspectiveCamera, BufferGeometry, raycast, sombras, agua, personaje jerárquico | Volumen real. Terreno y piezas agrupados en mallas; no necesita cambiar de motor por principio. |
| game.js | Estado, acciones, objetivos, teclado/punteros y requestAnimationFrame | Aquí se mezclan decisiones de entrada, simulación y progreso; conviene separarlas antes de extender. |
| ui.js / HTML / CSS | HUD DOM, botones, texto alternativo, NAVY, fuentes locales | Aprovechable, pero demasiado dominante sobre la escena y con conflictos de teclado. |
| save.js | JSON local, inventario, mundo y objetivos | Continuidad básica; necesita validación y carga atómica. |

Vera consta de 21 meshes y 3126 triángulos: cuerpo de primitivas con pivotes de brazos/piernas, no un sprite ni un modelo skinned importado. El terreno generado tiene 1024 triángulos. Son contadores de geometría, no medición de rendimiento.

Conservar: distribución modular, personaje femenino 3D, picking por caras, previa válida/inválida con símbolo y texto, construcción con coste/reembolso, dos maneras de atravesar, escaleras recorribles, fuentes locales y paquete offline. No pedir un cambio a otro motor ni actualizar Three sin necesidad concreta.

## 4. Defectos reproducidos y correcciones

### P0 · K01/K02 · El teclado del juego invade la interfaz
onKeyDown está en document. escribiendo() excluye ciertos campos de texto, pero no botones, radio, checkbox ni el panel de ajustes. Enter/Espacio llama colocar() y preventDefault incluso con Guardar enfocado. En fixture con cursor válido se colocó un bloque y piedra pasó de 20 a 19. ArrowRight en un radio también se cancela; los botones de cámara/cruceta tienen además handlers locales que burbujean.

Corregir por contexto de entrada: escena, construcción, panel y formulario. Enter sobre un botón activa únicamente ese botón; flechas en radios conservan su semántica. No basta un stopPropagation puntual. Al abrir ajustes o salir de la escena, vaciar movimiento pendiente y suspender acciones del mundo. Probar con Tab real y botones/radios reales en navegador.

### P0 · P01 · Retirar puede actuar sobre la casilla vecina
apuntar() devuelve golpe y colocar. apuntarCon() conserva únicamente colocar; Mayús+clic después llama retirar() sobre ese cursor. Fixture de impacto lateral sobre (6,3,7), con vecino (6,3,8): retira el vecino y deja la pieza apuntada.

Conservar por separado celda impactada, candidata de colocación y objetivo de retirada; cada acción usa la suya. Dibujar una previa de retirada sobre la pieza real. El fixture suministra el resultado de raycast: debe completarse con retest de puntero real sobre caras laterales/superiores y escaleras.

### P0 · U01 · Deshacer elimina el apoyo sin reconciliar a Vera
Retirar el bloque bajo Vera se rechaza. Deshacer sí lo quita; tras 120 actualizaciones inmóviles Vera sigue a y=4, terreno y=3, sin pieza. yObj no se recalcula.

Toda mutación debe reconciliar apoyo, ocupación, personaje, inventario y progreso. Elegir un contrato consistente: impedir el deshacer inseguro con explicación, o recolocar de forma segura conservando control. No dejarla flotando ni atrapada. Aplicar también al deshacer una retirada que repone un bloque donde ahora está Vera.

### P1 · S01 · Fallar al cargar ya puede haber destruido el mundo
cargar() vacía world.piezas antes de validar jugador e inventario. Fixture con JSON parseable v:1 incompleto devuelve error, pero borra la pieza existente.

Leer a estado temporal, validar enteros/rangos/tipos/costes y relaciones, y sólo entonces aplicar todo. Error conserva partida actual. Historial de deshacer debe reiniciarse o restaurarse de forma coherente al cargar. No presentar este fixture como archivo corrupto observado en el ordenador de María.

### P1 · I01 · Interacción sin altura ni visibilidad
objetivoCercano() usa sólo x,z. Vera a y=9 puede seleccionar madera situada sobre terreno y=3. El caso usa posición construida, no recorrido real hasta esa altura.

Introducir distancia vertical y, donde corresponda, visibilidad/alcance del objeto. Esto importa al añadir casas, pisos, cuevas y muebles.

### Producto · G01 · Objetivo final satisfecho con parcela vacía
Tres ciclos colocar-retirar la misma pieza: 3 colocadas, 3 retiradas, cero piezas, objetivo completo. Sustituir el contador de acciones por un resultado útil que persista: refugio utilizable o ruta conectada. Mantener deshacer como libertad, no convertirlo en obligación de misión.

## 5. Interfaz, imagen y pruebas que aún no sostienen el PASS

- La captura móvil entregada muestra la cruceta, opciones y copy cortados por el borde derecho. El CSS mantiene una fila de cámara no envolvente y #juego con overflow:hidden. No queda cerrado reflow porque no se vea scroll horizontal. Probar rectángulos internos, foco visible y todas las acciones en 320/390, 200 % y altura baja.
- En escritorio, el panel de objetivos se estira y deja gran espacio vacío; cámara, movimiento, instrucciones, estado y barra compiten con el mundo.
- El CSS reduce textos móviles a .8125rem y costes a .6875rem; bajo 420 oculta costes. No reducir legibilidad para encajar paneles: reorganizar.
- La entrega está sólo en español, con texto de interfaz/errores en JS. ES/EN queda pendiente, aunque NAVY y fuentes están incluidos.
- La alternativa textual es valiosa, pero su arranque depende de crear WebGL: si falla el renderer, no llega a inicializarse UI. No llamarla fallback independiente todavía.
- El panel Ajustes es una section flotante; no es modal accesible por el mero hecho de aparecer encima. Definir panel no modal coherente o diálogo con foco/retorno/inert, además de arreglar el router de teclado.
- En jugar.mjs hay entradas reales de teclado y ratón y exit code de fallo. También hay ayudas internas de rutas/proyección y cursorA inyectado para escaleras/parcela. Es prueba mixta; no demuestra toda la colocación usando únicamente controles públicos. Ruta alternativa de piedra, retirada/deshacer adversos, móvil y 200 % no quedan cubiertos por ese banco de partida.
- El script fija rutas /home/claude y /opt/npm-tools: hacerlo portable.

Dos hallazgos gráficos concretos:
1. El agua genera colores de profundidad por vértice, pero matAgua no activa vertexColors. Three r149 confirma false. Esos atributos de color no contribuyen por esa vía al material actual.
2. La ceja de hierba usa min(h, nh+0.22): sobre borde de h=3 y vecino h=1, el color de hierba va de 1.22 a 3 y el de tierra sólo de 1 a 1.22. La franja se calcula desde abajo, contrario a la intención descrita. Revisar con ceja cerca de h, preservando otros materiales.

Cámara: hoy comprueba la altura en la posición final; no la oclusión entre cámara y Vera. Antes de casas, probar pared interpuesta, interior y techo. Usar distancia de cámara limitada por obstáculos y ocultación/corte controlado de cubierta; evitar giros automáticos.

## 6. Investigación: qué aprender de las referencias

Fuentes consultadas 2026-10-06. Las siguientes decisiones de Iris Green son propuestas de Nexo, no afirmaciones de que una fuente las imponga.

**Dragon Quest Builders 2 — Nintendo/Square Enix.** La referencia combina exploración para obtener materiales, construcción personalizable, recetas y habitantes que utilizan las habitaciones. Los planos ayudan y la actividad del asentamiento da significado a las obras. Transferencia: crear algo cambia lo que se puede hacer y quién puede usar el lugar; el puente debe abrir posibilidades, no cerrar una casilla de checklist.
https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/DRAGON-QUEST-BUILDERS-2-1514364.html
https://na.store.square-enix-games.com/dragon-quest-builders-2

**Townscaper — página oficial.** Su colocación de bloques resuelve formas visuales a partir de vecinos. Transferencia limitada: bordes, remates, esquinas y encuentros de piezas pueden verse cuidados sin exigir que la persona monte cada detalle. No sustituir por ello la aventura y la progresión que María pide.
https://www.townscapergame.com/

**Microsoft XAG 107.** Ofrecer entradas alternativas equivalentes y evitar que velocidad, combinaciones o mantenimiento prolongado sean barreras. Propuesta: controles remapeables, cámara cómoda, ayudas opcionales y selección directa; conservar decisiones de construcción.
https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107

**W3C APG.** Enter/Espacio activan el botón enfocado; los radios tienen navegación propia. Aplicación: la capa del juego debe respetar el foco DOM.
https://www.w3.org/WAI/ARIA/apg/patterns/button/
https://www.w3.org/WAI/ARIA/apg/patterns/radio/

**Three.js.** Agrupar geometría reduce trabajo por objeto; sombras tienen coste adicional; escenas sin cambios pueden dibujarse bajo demanda. Aplicación: conservar mallas agrupadas, invalidar por cambio, medir antes de aumentar mundo y usar render continuo sólo mientras hay actividad que lo necesita. No copiar APIs nuevas sin comprobar compatibilidad r149.
https://threejs.org/manual/pages/optimize-lots-of-objects.html
https://threejs.org/manual/pages/shadows.html
https://threejs.org/manual/pages/rendering-on-demand.html
https://threejs.org/manual/pages/voxel-geometry.html

## 7. Propuesta jugable: «Vera · El enclave del vado»

Objetivo de la siguiente entrega: una pequeña aventura de construcción completa, diseñada para una primera sesión de unos 15–20 minutos, sin límite de tiempo. Duración a validar jugando, no promesa medida.

### Primera situación
Vera llega a un enclave abandonado: dos orillas, un pequeño taller incompleto y una terraza que invita a construir. Un segundo personaje quiere instalar allí un refugio. Ver una obra posible y un destino desde el principio, sin enseñar una solución exacta.
Objetivo visible: «Haz habitable este lugar». Se concreta por contexto en una necesidad cada vez, con ayuda opcional.

### Secuencia
1. Explorar el margen y recoger materiales de objetos visibles; seleccionar/usarlos directamente. Recolección corta, sin exigir machacar botones.
2. Elegir dónde y con qué cruzar. Madera o piedra cambian aspecto y coste. Ambas soluciones son válidas. Asegurar suficientes recursos y devolución para experimentar.
3. Cruzar abre un pequeño taller/depósito y un nuevo tipo de pieza útil; obtener acceso tiene una consecuencia más allá del texto.
4. Diseñar el refugio en el lugar permitido: forma y puerta elegidas por la persona, paredes, acceso y muebles. Plantilla opcional, nunca copia exacta obligatoria.
5. El segundo personaje cruza el paso construido, entra y utiliza el refugio. Esa actividad confirma la utilidad de la obra.
6. Queda una elección real: ampliar el refugio, preparar un mirador o abrir un atajo hacia otro recurso. Guardar conserva la obra y la siguiente intención.

No meter combate, hambre, multijugador o un ciclo de horarios en esta primera ampliación. No porque sean incompatibles con neurodiversidad, sino porque no son necesarios para probar esta propuesta concreta. El reto está en forma, acceso, espacio, recursos y elección. Se puede evaluar aventura/combate por separado si María lo quiere.

### Alcance acotado
Un enclave, una ruta con dos soluciones, un refugio funcional y un NPC. Dos materiales básicos, 8–10 piezas bien terminadas: bloque/pared, suelo, plataforma, escalera, puerta, ventana, cubierta, cama y banco de trabajo, reutilizando bases cuando proceda. Dos o tres recetas útiles y claras; evitar convertir el taller en una cadena repetitiva de menús.

El refugio se valida por propiedades: interior alcanzable, suelo transitable, entrada utilizable, cerramiento definido y mobiliario accesible. La cubierta debe tener una regla pública coherente si es obligatoria. No pedir coordenadas exactas ni una forma única. Detección geométrica más ruta desde fuera hasta los puntos de uso; no basta contar paredes/camas. Si falta algo, señalarlo en el propio mundo y en texto.

El NPC usa la misma transitabilidad que Vera (con parámetros corporales declarados), con estados simples esperar, ir y usar; sin teletransporte para fingir que una obra funciona. La ayuda de plano muestra qué falta; la construcción libre conserva decisiones.

## 8. Cómo debería sentirse y verse

- Ratón: apuntar a un objeto y usarlo; colocar/retirar muestran objetivos distintos; arrastrar orbita. WASD/flechas físicas para caminar. Cámara y cruceta alternativas disponibles bajo Vista/Accesibilidad, sin llenar el escritorio de flechas duplicadas.
- Modo Construir claramente distinto, con previa que coincide con el resultado. En táctil seleccionar + confirmar conserva seguridad. Una acción pública común alimenta ratón, teclado y texto.
- Un objetivo breve arriba, inventario compacto, barra de piezas abajo, herramienta seleccionada clara; ayuda larga y vista avanzada plegadas. En móvil priorizar personaje, destino y casilla, con paneles que no oculten controles ni costes.
- Cámara suficientemente elevada para leer el suelo, reset estable y giro configurable; modo construcción puede tener encuadre propio solicitado por la persona. No cámara que cambie sola de intención.
- Isla menos rectangular: recodos, escalones de terreno legibles, un acceso y una silueta de terraza reconocibles. Los hitos indican posibilidades jugables. Mantener coherencia estilística entre personaje, piezas y vegetación.
- Vera necesita respuesta breve de recoger/colocar/usar, además del caminar, sin bloquear el control hasta que termine la animación. Sombra/contacto y pies coherentes con la superficie.
- Remates automáticos sólo cosméticos y previsibles: no cambiar soporte, coste o espacio transitable sin mostrarlo en la previa.
- NAVY en interfaz con Atkinson Hyperlegible y Newsreader; el mundo conserva sus materiales y colores propios. No convertir todo el entorno en panel azul.
- Sonido de acciones opcional, discreto y silenciable; no hacer del sonido ni de efectos ambientales el contenido principal. Las acciones siguen siendo legibles sin audio.

## 9. Evolución técnica mínima y aprendizaje

Separar InputRouter → acciones → reglas/mutación → eventos → UI/render. Comandos colocar/retirar/deshacer con precondiciones, coste, soporte y reconciliación; cargado atómico. Datos del escenario separados de objetivos. Añadir detección de refugios y navegación sólo para el pequeño caso que se va a jugar.

El renderer ya agrupa terreno y piezas. No introducir un ECS o un sistema de chunks enorme por anticipación. Al crecer, medir reconstrucción de malla, draw calls, memoria y sombras para decidir particionado. Actualizar HUD por cambio, no reconstruir objetivos cada 250 ms sin necesidad. En pausa y NONE estático, dibujar sólo cuando cambie la escena; mantener actualización cuando la persona se mueve.

El autor declara 3–5 fps con SwiftShader y ~1 ms de trabajo de escena. Eso no acredita fluidez en GPU real ni permite exculpar todo el coste: medir percentiles de frame, latencia de entrada y coste GPU/CPU en dispositivo real. El dt recortado a 0.05 hace que por debajo de 20 fps el tiempo simulado avance más despacio; revisar subpasos limitados y manejo de pausas sin saltos. Añadir ajustes de calidad de sombras y DPR con alcance declarado.

## 10. Orden de prioridades y aceptación

1. Corregir teclado, retirada, deshacer/soporte, carga y encuadre móvil; retest dirigido. Preservar la base.
2. Entregar un ciclo completo puente → refugio elegido → uso por NPC → siguiente posibilidad. No ampliar catálogo antes de verlo funcionar.
3. Mejorar acabado, cámara interior, feedback y rendimiento medido.
4. HUMAN QA: María puede orientarse, construir sin luchar con los controles, entender qué permite su obra y elegir algo que quiere añadir. Observar conducta y escuchar su valoración; no declarar diversión por hashes, coordenadas o contadores.

Pruebas de juego: dos refugios distintos válidos; un cierre bonito pero inaccesible no cuenta; varias rutas de puente; retirar/reponer modifica acceso; guardar/cargar conserva obra; teclado y touch recorren la misma aventura. Separar pruebas de motor con fixtures de partida real sin debug.

Aprendizaje central: 3D resuelve representación; construir exige reglas; un juego de construcción necesita además intención, elección, consecuencias y apropiación del lugar. Las tres capas deben verificarse por separado.
