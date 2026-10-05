# Estudio de código · Webs Claude y representación de Construcción Prisma

Fecha: 2026-10-05. Estudio de transferencia para Nexo, Prisma y Axioma. No es otra auditoría de aprobación ni una atribución de culpa.

## Alcance y método

Lectura directa de HTML, CSS, JavaScript, scripts de exportación y bancos entregados. No se ejecutó navegador en este estudio. Las conclusiones de ejecución ajenas se identifican como evidencia entregada, no como reproducción independiente. Se estudiaron estas copias concretas:

- `discovery-area-r01-1-review/DESCUBRIMIENTO_AREA_NAVEGABLE_R01/`: web Descubrimiento R01_1; ZIP referenciado en conversación con SHA-256 `d0ef4877a09e892cf219afdb90089a44cad83b181544b2f70df7972c815b04e3`.
- `games-r01-3-review/CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3/`: diseño Juegos R01_3, no área jugable integrada; SHA-256 referenciado `6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5`.
- `download-bundle-sources/construction-final/`: ejecutable de Construcción Prisma; ZIP referenciado `e2370c5e6e71177412f66623077e8f66fc47b03b98985a40b6e89fb59b958b2a`.

Verificación posterior de Nexo: SHA de los tres ZIP confirmado; 39/39 archivos de Descubrimiento, 75/75 de Juegos y 7/7 de Construcción coinciden byte a byte con las copias leídas (PACKAGE_COMPARISON.json). Las rutas de código siguientes se entienden relativas a cada paquete.

No se comparan como si una portada, una experiencia de descubrimiento y un juego fueran el mismo producto. Tampoco se deduce que un autor conoce o desconoce una materia a partir de un solo archivo. Se comparan decisiones observables, capacidades demostradas y aprendizajes que faltan por demostrar.

## 1. Qué resuelve bien la web de Descubrimiento de Claude

### Separación de presentación, contenido y acciones

`assets/css/app.css` declara en `:root` los colores de función, familias de cuerpo/título y superficies del canon NAVY. Los valores no son sólo una muestra visual: los componentes usan `var(--fondo)`, `var(--panel)`, `var(--texto)`, etc. Hay cuatro `@font-face` con WOFF2 locales, body en 1rem/1.6, Newsreader para títulos y `clamp()` para la escala de portada. Esto convierte una orden de estilo en reglas reutilizables y reduce divergencias entre fichas.

`index.html` ofrece landmarks reales (`header`, `nav`, `main`, `footer`), salto al contenido y secciones nombradas. Una tarjeta que navega es un enlace completo, con el aparente CTA como `span`, de modo que no anida un botón dentro del enlace. Lo relevante no es la cantidad de ARIA: es que la estructura visible y la acción tienen un elemento HTML que corresponde a su función.

El layout es fluido: contenedor con máximo, espaciado por breakpoint, Flexbox que envuelve y Grid con `minmax(0,1fr)`. El texto conserva ancho legible en `ch`. Hay tratamiento explícito de títulos largos y botones que envuelven. Frente a reducir indiscriminadamente tipografía para que todo quepa, el documento puede crecer en vertical. Este patrón sirve para las páginas de Iris Green; no determina cómo debe renderizarse el mundo del juego.

### Datos: tema no equivale a acceso

`datos/registro.json` distingue `temas`, `ambitos`, `acceso`, imágenes, runtime y retorno. `IG.pintarCatalogo()` filtra por acceso; no asigna Cielo a un plan por conveniencia visual. La portada permite entrar a fichas de ambos temas aunque el reparto siga pendiente. Es una separación de conceptos útil que debemos aprender a especificar antes de dibujar tarjetas.

El paquete todavía duplica una parte de los datos: `app.js` incrusta `IG.registro` para funcionar sin `fetch()` de JSON local. Esa adaptación al formato de entrega es concreta y comprensible, pero obliga a mantener correspondencia a mano. Para escalar, la transferencia correcta sería generar ese bloque desde una sola fuente durante el empaquetado y comprobar la equivalencia; copiar dos registros editables no es una arquitectura que debamos perpetuar sin más.

### El comportamiento del menú se modela como transición

En `app.js`, `IG.menu()` gestiona apertura, cierre, `aria-expanded`, bloqueo del scroll, `inert`, `aria-hidden`, entrada de foco, Escape, Tab/Mayús+Tab y retorno al botón. La mejora respecto a dibujar un menú abierto consiste en considerar también qué le ocurre al resto del documento cuando cambia el estado.

No es un patrón perfecto para copiar literalmente. `apagarFondo(false)` elimina atributos sin restaurar sus valores previos; en estas páginas sencillas puede ser suficiente, pero en una integración con otros overlays no conserva el estado anterior. `alCambiar()` llama a `cerrarMenu(false)` al pasar a escritorio: hay que estudiar el destino del foco si estaba en Cerrar, que CSS oculta. Son casos de transición que una captura móvil estable no representa. En este estudio son riesgos de lectura, no fallos de navegador reproducidos.

### Entrega e integración honestas, aunque incompletas

Los enlaces internos de Descubrimiento apuntan a páginas reales. Las secciones externas sin ruta se muestran como texto, sin fingir una navegación con `href="#"`. `experiencia.html` recibe el tema por query, ajusta el retorno y declara que la experiencia no está conectada. El flujo está construido hasta su frontera real.

Eso sigue siendo una web incompleta: explorar no abre todavía Cielo o Peces, hay reservas de imagen y acceso comercial pendiente. Aprender de esta separación no permite llamar completo al producto. Además, el encabezado de experiencia aún contiene «pendiente de conexión», una expresión técnica que conviene sustituir al integrar, no convertirla en modelo de copy definitivo.

## 2. Juegos de Claude: aprender el proceso de exportación sin confundirlo con un runtime

Los archivos de `portable/` son frames de dimensiones fijas. `Main.html` declara un contenedor de 1440 × 1160 y replica muchas reglas mediante estilos inline. Las versiones 320/390 son documentos distintos; tenerlas no demuestra reflow de una única página.

`tools/exportar_portable.py` transforma el formato del canvas (`x-dc`, `helmet`, blobs internos) a HTML normal. Reescribe las fuentes y las imágenes a rutas relativas e interrumpe la exportación si quedan blobs sin resolver. La fuente editable y la copia distribuible tienen una relación explícita. Este es un aprendizaje práctico importante: el contexto del editor no debe ser una dependencia invisible para María.

La conversión no reescribe enlaces `.dc.html`: por ejemplo `portable/Main.html` sigue enlazando `J02_1440.dc.html`, que no es el nombre de la copia portable. Es evidencia directa de que «portable» aquí significa visualmente renderizable, no web completamente navegable. No debemos promover ese paquete a runtime por contener etiquetas HTML.

`tools/render_png.py` abre los frames con Playwright, fija el viewport, captura y añade ICC sRGB y chunks de color. La medida de overflow vertical se calcula sobre la raíz y sus hijos inmediatos; es útil para ese formato pero no sustituye pruebas de documento fluido ni interacción. El script espera 450 ms para las fuentes; esperar su estado explícito sería una mejora de reproducibilidad sobre un timeout fijo.

`tools/verificar_entrega.py` permite localizar regressiones del paquete (hashes, procedencia, ausencia de blobs, estilos, inclusión del frame exacto). Varias aserciones son estructurales por texto/regex. Por ejemplo, «ningún frame desborda» se infiere de que un informe no contenga `| sí |`, no vuelve a renderizar el paquete. La existencia de `alt` tampoco evalúa su calidad. Estos controles aportan valor a la exportación; su nombre y el resumen de entrega deben conservar ese alcance.

## 3. Construcción Prisma: qué explica el desacople con la experiencia pedida

### El código contiene un juego de reglas, pero su representación no materializa el mundo previsto

`game.js` usa una cuadrícula 12 × 8, celda de 80 y canvas 960 × 640. `cellRect(x,y)` transforma sólo x/y; no usa z. `drawPiece()` ordena piezas por z, pero dibuja sus rectángulos en la misma celda sin proyectar altura. Las escaleras expresan subida mediante texto `z1→z2` y una flecha. Por eso tener z en el estado no produce por sí solo una terraza elevada visible ni la percepción de estar subiendo.

`drawPlayer()` dibuja cabeza circular, tronco y piernas rectangulares. La dirección cambia una flecha; el cuerpo no gira ni tiene una animación de marcha. `movePlayer()` avanza una celda por evento y actualiza inmediatamente; no hay interpolación de desplazamiento ni ciclo de locomoción. El selector NORMAL/REDUCED/NONE afecta principalmente al pulso de feedback CSS, no a una locomoción expresiva que aquí no existe.

`drawBoard()` mantiene cuadrícula, nombres R1/R2 y casillas prefijadas. `routeAt()` sólo admite dos filas en el canal. `stairChallengeSlot()` fija exactamente las dos posiciones de escalera. El código implementa variantes de solución dentro de un reto espacial estrecho, no libertad amplia de construcción. Nada de ello hace inválido un puzzle abstracto en general; es inadecuado para el mundo con personaje, materiales y construcción que María esperaba.

El modo libre se limita a `isParcelCell()` y a las reglas de apoyo del mismo tablero. No hay sistema general de terreno, ocupación espacial y construcción apilable que equivalga a un pequeño refugio editable. Incluso `freePlatformSupported()` examina soportes de la misma fila. Esto ayuda a entender por qué añadir imágenes bonitas no resolvería toda la brecha: también hace falta revisar la amplitud de decisiones permitidas.

### El ratón selecciona coordenadas, no manipula una pieza presentada en el mundo

El listener `canvas.click` enfoca la escena y, sólo en Construir, convierte píxeles a celda para mover el cursor. No coloca ni mueve al personaje. Colocar es otra acción en DOM o teclado. Esta separación puede ser deliberada y útil, pero no ofrece preview bajo el puntero, elección directa de superficie visible y respuesta continua. Los botones de flechas duplican la entrada de teclado/touch sin una cámara navegable diferenciada. La fricción no se resuelve llamando «interactivo» al canvas.

### El canon tampoco se materializó en este runtime

`game.css` declara `color-scheme:light`, fondo `#eaf5fa`, panel blanco y cuerpo `system-ui`. No contiene las fuentes locales Atkinson/Newsreader del canon. La web de Claude sí incorpora esos recursos y tokens. Es una diferencia verificable de implementación, no una evaluación estética abstracta. El README de Prisma avisa de «arte funcional/provisional»: el aprendizaje de coordinación es respetar esa limitación al decidir para qué sirve la entrega.

### Qué conocimientos sí están demostrados y deben conservarse

`validatePlacement()` comprueba alcance, ocupación, material, apoyo y desbloqueo. `removeAtCursor()` ensaya el mundo sin la pieza, verifica seguridad y dependencias antes de retirar y devolver material. `undo()` guarda snapshots y evita dejar al personaje sin suelo. `saveGame()` tolera fallos de localStorage; `readSave()` comprueba versión y estructura básica. El DOM ofrece controles reales y un canal `game-live` para explicar resultado y posición.

Estas son bases útiles. Lo que falta demostrar es conectarlas a una representación espacial legible y una interacción con sentido para el jugador. Una nueva solución debe reutilizar el conocimiento de invariantes y mejorar su diseño de mundo; no tiene obligación de conservar el mismo código monolítico o las casillas fijas.

## 4. Qué significan las pruebas y qué no significan

El banco `tools/pruebas.py` de Descubrimiento ejecuta navegación por clic, Escape, foco y 16 Tab reales. Son acciones de navegador mejor alineadas con esas promesas que una mera búsqueda de atributos. No lo he ejecutado en este estudio.

La prueba de texto 200 % modifica `html {font-size:32px}` y sólo comprueba scrollWidth. Su título incluye «sin pérdida de contenido», pero esa condición no observa solapamiento, recorte vertical o elementos tapados. No prueba tampoco el zoom real del navegador. El aprendizaje para Axioma y Nexo es distinguir el enunciado de la prueba del oráculo que realmente la hace pasar.

`QA_BROWSER.json` de Prisma registra Ruta A/B, inventario, z final, reflow, targets y guardado. Esa evidencia describe la viabilidad funcional de rutas y ciertos aspectos técnicos. No hay en el archivo una observación de primera partida que demuestre lectura del volumen, comprensión espontánea, calidad del personaje o ganas de construir. No se debe inferir que esas dimensiones se verificaron por el nombre «jugabilidad» ni convertir el resultado en una conclusión sobre diversión.

Un test con entradas reales puede seguir comprobando un objetivo equivocado. Una prueba de producto empieza por una pregunta observable: «¿Se entiende dónde puede apoyarse la escalera al verla?»; después se elige la evidencia adecuada. No al revés.

## 5. Comparación con conocimientos demostrados y formación a practicar

| Materia | Evidencia de conocimiento actual | Transferencia que falta demostrar |
|---|---|---|
| Estado e invariantes | Prisma: costes, apoyo, retirada y undo. Claude: estado de menú y registro de acceso. | Modelar junto al estado qué consecuencia visual y qué decisión nueva percibe la persona. |
| Estilo y composición | Claude aplica tokens, fuentes locales y componentes fluidos; Prisma estructura DOM accesible. | Llevar el canon y jerarquía a cada runtime real, no sólo a su portada o storyboard. |
| Representación espacial | Prisma almacena z y valida tránsito. | Proyección/oclusiones/escala/orientación y picking coherentes: que z tenga consecuencia visible y seleccionable. |
| Interacción | Hay teclado, controles y eventos. | Diferenciar intención de ratón, touch y teclado; preview directo, cámara y acción sin traducción mental innecesaria. |
| Entrega | Claude separa canvas/portable y preserva recursos. | Probar la experiencia desde la extracción final y explicitar cuándo es un frame, un motor o un flujo integrado. |
| Evidencia | Ambos entregan bancos/resultados técnicos. | Formular criterios de producto y no sobreinterpretar el alcance de una aserción o un PASS agregado. |

Son hipótesis de brechas de aplicación, no un diagnóstico personal sobre la formación de Prisma/Axioma. Su comparación con su propia formación debe citar qué lección conocían, qué decisión tomaron y qué cambiarían al ver estos archivos.

## 6. Ejercicios pequeños de transferencia, antes de otro encargo completo

1. **Prisma · representación e interacción:** crear un ejercicio aislado de dos niveles, una pieza y un personaje. Debe mostrar altura, orientar el cuerpo, apuntar a una superficie visible, previsualizar, colocar y recorrer. Teclado y touch deben conservar la misma intención. Comparar vídeo sin explicaciones con el tablero actual. No hace falta rehacer todo Construcción para aprender esto.
2. **Prisma · web real desde diseño:** convertir un frame de catálogo fijo en una sola página fluida con tokens y fuentes locales, rutas existentes y estados vacío/disponible. Documentar qué se mantiene del frame y qué necesita ser comportamiento. Validar extracción sin dependencia del editor.
3. **Axioma · oráculos de prueba:** tomar cuatro pruebas existentes y escribir lo que observan exactamente, lo que no observan y un caso adverso que pasaría con un defecto visible. Ejemplos: scrollWidth sin clipping; alt presente pero inútil; z final correcto sin altura reconocible; link de una ficha que llega sólo a un placeholder.
4. **Nexo · encargo a consecuencia:** para tres acciones del producto, completar «intención → entrada → cambio de estado → consecuencia visible → información comprensible → nueva decisión». Rechazar en el análisis los saltos donde sólo haya una variable o un texto de estado. Hacerlo antes de asignar el siguiente bloque.
5. **Los tres por separado:** explicar una decisión de Claude que adoptarían y otra que no copiarían, señalando función/archivo y razón. Después comparar las respuestas y registrar una práctica común. El objetivo no es alabar a Claude: es que el aprendizaje pueda trasladarse al siguiente trabajo.

El criterio de aprendizaje es una mejora ejecutable y explicable, acompañada de evidencia ajustada a lo que realmente muestra. No se propone añadir burocracia ni exigir a María repetir el rechazo.

## Contraste con formación canónica de Nexo

Leídas Nexo R02 secciones 2–6 y Prisma 03/04 de octubre (refs en NEXO_COMPARACION_FORMACION.md). El canon, la fidelidad a la fuente y la diferencia entre imagen y runtime ya estaban documentados. Por ello la divergencia de estilo y la promoción de representación a producto son brechas de aplicación demostrables, no prueba de desconocimiento. La formación nueva que falta demostrar es proyección/picking, modelado de estados de interfaz y evaluación de consecuencias visibles. El diagnóstico personal de Prisma queda para su informe independiente.
