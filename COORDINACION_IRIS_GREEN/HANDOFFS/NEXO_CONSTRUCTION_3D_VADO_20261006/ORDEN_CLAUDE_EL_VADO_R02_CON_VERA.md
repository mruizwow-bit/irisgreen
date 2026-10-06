# ORDEN A CLAUDE DESIGN · EL VADO R02 · JUEGO 3D CON VERA
Fecha: 2026-10-06.
Estado: ORDEN_DE_TRABAJO. Sustituye el carácter propuesto de CONSOLIDACION_PRISMA_NEXO_R02.md para este encargo.
Entrega: EL_VADO_R02_READY_FOR_REVIEW.
NO MAIN · NO PUBLIC DEPLOY · NO NUEVA RAMA.
Se autoriza desarrollar y probar el ejecutable aislado de este encargo. No modificar Sabik, Cielo, Peces ni el montaje general de la web.

## 1. Objetivo y punto de partida
Construye una siguiente versión JUGABLE de El Vado, en 3D real, con Vera como personaje controlable. La referencia de diseño es la construcción útil, la exploración y la respuesta del mundo de Dragon Quest Builders; no copiar sus personajes, assets o interfaz.
Partimos del ZIP iris-green-3d-vado.zip:
SHA256 308c370ef5b2dfce69fa8e0f7865d957390aa40a290d8f46145eb2a99fc1e59c.
Conserva su render 3D, cámara, terreno, preview, soportes y devolución de recursos cuando sirvan. No empezar con un cuadro y un punto ni entregar imágenes como sustituto del juego.
No asumir que tú creaste los storyboards previos: Prisma los realizó. Este documento contiene el alcance ejecutable sin depender de recordar otra conversación.

## 2. Material imprescindible: Vera de María
Usa VERA_FBX_ANIMACIONES_ORIGINAL.zip:
SHA256 f6077ae03b4ba7a22d99b9e6d52886c6423bf28efacde04e82111e45e18e8979
116238784 bytes.
Registro: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_VERA_PERSONAJE_CANONICO_20261006/VERA_ORIGINAL_Y_GUIA_INTEGRACION.md
Inventarios: INTAKE.json y FBX_STRUCTURE.json en la misma carpeta.
Los binarios están en el archivo que María adjunta, no en GitHub. El enlace autenticado de Biblioteca no garantiza acceso desde tu sesión. Si falta, indica exactamente ese impedimento; puedes trabajar el resto, pero no declarar integrada Vera ni sustituirla silenciosamente.
El ZIP contiene dos FBX y cuatro mapas. El FBX Merged_Animations tiene 20 entradas AnimationStack; no equivale a 20 acciones jugables verificadas. Hay Walking, Running, Idle_11 y Collect_Object, entre otras.
La figura procedimental actual queda sustituida por la Vera aportada, conservando cara, ropa, proporciones e identidad.
- Reproduce los clips antes de asignarlos. Comprueba unidades, orientación, materiales, skin, pies, ropa y escala en el mundo.
- Importa un solo personaje; no dupliques cuerpo por cargar ambos FBX.
- Usa movimiento del controlador o root motion de forma deliberada, sin sumarlos.
- Prepara derivado GLB/texturas optimizadas si conviene; conserva originales y procedencia. No cargues 116 MB de originales como solución de producto.
- Transiciones de reposo/caminar/correr y recogida sin deslizamientos o saltos de posición. Ajusta la velocidad del clip a la locomoción.
- No hay un clip de martillar/construir acreditado. No inventes que existe. Un gesto compatible sólo se usa después de verlo; si necesitas un clip adicional, documenta qué acción falta para pedirlo en Meshy.
- Un problema de integración no justifica regenerar Vera. Si aparece una deformación del asset, entrega clip, instante y captura del defecto.

## 3. Bucle jugable del prototipo
Explorar el pequeño enclave → recuperar recursos → construir un paso → cruzarlo con Vera → preparar un refugio útil → ver a un habitante usarlo → elegir qué ampliar.
La persona decide dónde y cómo construir dentro de reglas legibles. Sin cuenta atrás, examen ni checklist que sustituya el juego.
Mantén dos soluciones distintas de paso compatibles con los apoyos; prueba ambas. No entregar un puente preconstruido.
Los recursos se obtienen de objetos recuperables y una pequeña ruina, con alcance coherente y una acción clara, sin exigir golpear repetidamente.
Da recursos suficientes para experimentar. Retirar devuelve materiales; deshacer es seguro. Evita un bloqueo de progreso por gastar recursos en una forma distinta de la prevista.

## 4. Una construcción que sirva
Implementa UN refugio pequeño con un punto de descanso y un NPC que pueda alcanzarlo y utilizarlo.
Requisitos visibles y comprensibles: superficie transitable, acceso de tamaño suficiente, protección/techo sobre el punto de descanso y recorrido libre hasta él. Define dimensiones coherentes con los colliders de Vera y el NPC y documenta los valores.
No exigir una disposición única de bloques. Aceptar al menos dos refugios de geometría diferente.
El NPC cruza por el paso construido y llega físicamente al refugio; no teletransportarlo para simular funcionalidad. Si no puede pasar, señalar el bloqueo concreto.
Feedback de la obra: el refugio se reconoce, el habitante lo usa y aparece una siguiente elección de mejora realizable. Por ejemplo ampliar el refugio o construir un mirador con nuevas piezas del mismo sistema.
No considerar completado por colocar tres piezas y retirarlas. No añadir ahora huerto, horarios, economía o múltiples residentes.

## 5. Construcción y controles
Vera sigue siendo el centro de la acción. Equipar una pieza no secuestra WASD/flechas para mover un cursor por defecto.
- Ratón: selección directa de la superficie/pieza; preview de destino y colocación con alcance desde Vera. Arrastre de cámara claramente separado del clic. Cancelar gesto no ejecuta acciones.
- Teclado: movimiento de Vera, selección de pieza, colocar, girar y retirar mediante acciones documentadas. Flechas del teclado funcionan en el contexto del mundo; no interceptarlas en menús o controles nativos.
- Táctil: movimiento y acciones con controles reales de al menos 44 px. No exigir teclado/ratón.
- Precisión: opción explícita para alternar control de Vera y cursor preciso, con estado visible y salida predecible. No exigir dos dispositivos ni pulsaciones simultáneas para terminar.
- Rueda: zoom por defecto. No usar simultáneamente el mismo gesto para cambiar material.
Un router común de acciones mantiene reglas iguales entre vías. Enter/Espacio sobre botones realizan la acción del botón, sin colocar bloques a la vez.
Preview válido/inválido distinguible sin depender sólo del color, con motivo breve: fuera de alcance, sin apoyo, ocupado o falta material.
Un conjunto acotado de 8–10 piezas útiles, dos materiales y 2–3 recetas sencillas basta: paso, apoyo, escalera, suelo, pared, cubierta y punto de descanso. Reutiliza geometría cuando proceda.
Retirar muestra dependencias antes de afectar otra parte. No borrar estructuras ajenas a la pieza seleccionada.

## 6. Correcciones obligatorias del código base
Leer ANALISIS_CODIGO_PRODUCTO_Y_PROPUESTA.md y sus reproducciones en esta carpeta.
1. Teclado por contexto y limpieza de teclas retenidas al abrir interfaz/perder foco.
2. Retirar usa la pieza impactada, no la casilla adyacente calculada para colocar.
3. Deshacer y cualquier edición reconcilian soporte y colisión: Vera no queda suspendida.
4. Carga atómica: validar antes de sustituir el mundo; un guardado inválido conserva la partida. Historial y versión de datos coherentes.
5. Alcance de interacción con componente vertical; no recoger desde alturas imposibles.
6. Reflow móvil real: corregir controles/textos cortados; overflow:hidden no cuenta como solución.
7. Cámara que conserve a Vera comprensible cerca de paredes, sin exigir luchar contra ella.
8. Revisar material del agua y banda de vegetación del terreno conforme a los hallazgos.
No actualizar Three ni rehacer el terreno como voxels por obligación. Excavación general/túneles no entran en este corte. Optimiza según medición, no por aplicar instancing a una vegetación que ya es una malla agrupada.

## 7. Interfaz y canon
Escena protagonista, HUD compacto: recursos, pieza equipada, acción contextual y objetivo breve. Ayuda, recetas y ajustes se despliegan a petición. Costes siempre legibles; no amontonar paneles sobre Vera.
Sólo NAVY, sin selector claro:
fondo #0B1A2B; panel #15304A; superficie secundaria #1D3D5C;
texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA;
acento/foco #C3B8FF; bordes #8494A8; separadores #2A4460;
botón principal fondo #DCE8F2 y texto #0B1A2B.
Cuerpo Atkinson Hyperlegible 1rem, interlineado 1.6.
Títulos Newsreader 600, interlineado 1.2. Si hay portada: Newsreader 400, 40–56 px, 1.06; introducción ~19 px/1.58.
Fuentes locales. No reducir texto para esconder problemas de composición. NAVY rige la interfaz; el terreno y Vera conservan sus materiales.
ES/EN; 320/390/1440; texto al 200 %; foco distinto de seleccionado; forced-colors en UI.
NORMAL/REDUCED/NONE: reducir movimiento prescindible, sin teletransportar personajes, cambiar progreso o eliminar acciones. En NONE, nada de balanceo/cámara suave/ambiente automático; las acciones directas y cambios de estado siguen disponibles.
Audio opcional y desactivable, nunca única información. No añadir música de relleno.

## 8. Pruebas y evidencia
Primero revisa Vera sola y dentro del mundo: reposo, marcha, giro, escalera, recogida. Luego completa el recorrido.
Entrega grabación continua por interfaz pública de recoger → construir paso → cruzar → refugio → uso del NPC → guardar → recargar. Sin debug, inyección de piezas o cambios de estado para acreditar este recorrido.
Comprueba dos pasos y dos refugios distintos; retirada con dependencias; deshacer bajo Vera; carga dañada sin pérdida; recuperación de foco; menús y cámara; las tres modalidades de movimiento.
Prueba ratón y teclado por separado; reporta emulación táctil como emulación, no teléfono real.
Reflow al 200 %: inspección de clipping interno con paneles abiertos, no sólo scrollWidth.
Mide descarga real, tiempo de carga, memoria disponible, frames y entorno de medición. No extrapolar SwiftShader o escritorio a móvil físico.
Pruebas internas pueden preparar fixtures, pero van identificadas y no sustituyen el recorrido público.
La compatibilidad con lector de pantalla y el juego completo sin visión requieren evidencia propia: no declararlas a partir de etiquetas.
Registra fallos no resueltos con reproducción. No borrar pruebas adversas sólo para que el banco dé verde.

## 9. Entrega exacta
EL_VADO_R02_VERA.zip con ejecutable, dependencias locales, assets derivados y licencias; README con apertura exacta. Preferir doble clic offline si se verifica. Si el loader exige servidor, incluir arranque local reproducible y declararlo, sin simular soporte file://.
Añadir SHA256 del ZIP, manifest de archivos, versiones de contenido/runtime/guardado, procedencia de Vera, mapa acción→clip, controles ES/EN, pruebas y pendientes.
Banco técnico separado del paquete de producto. No exponer debug ni paneles del equipo a María.
Acompañar vídeo y capturas 320/390/1440 del ejecutable entregado. El canvas sólo es vista previa.
Gate de entrega: EL_VADO_R02_READY_FOR_REVIEW.
Después: Axioma retest independiente → HUMAN QA MARÍA. FEEL_PASS sólo tras probar que María comprende, construye sin luchar con controles y quiere continuar.
STOP antes de integración en main o despliegue público. No atribuir PASS a hashes, número de piezas o animaciones presentes.
