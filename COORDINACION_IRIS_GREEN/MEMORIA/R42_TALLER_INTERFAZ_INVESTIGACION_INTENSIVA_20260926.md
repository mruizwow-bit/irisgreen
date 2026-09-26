# R42 Taller · investigación intensiva de interfaz · 26/09/2026

## Estado

`R42_TALLER_INTERFACE_RESEARCH_COMPLETE_IMPLEMENTATION_HOLD`

Esta memoria no ordena reescribir todavía el Taller. Congela nuevas decisiones de interfaz hasta que María revise la arquitectura propuesta. Se conserva PR #299 y su trabajo útil; no se declara final ni se amplía la fase 6 por inercia.

## Bases inspeccionadas

### Base A2 previa
- rama: `agent2/sabik-iris-r08-20260924`
- HEAD: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`

### Rebuild A5 actual
- PR: #299
- branch: `agent5/r42-a5-advanced-workshop-on-a2-20260926`
- HEAD remoto inspeccionado: `8c1a9cc132ae9ebcacf1acbec3f99767db295634`
- base A2 de PR: `ab952077464b1348d3da88ee974f9375b3458bc9`

## Qué confirma el código real

### 1. Etapas
En `e8cad400...`, `assets/ig-taller-r42.js` lee y escribe `sessionStorage["ig42-stage"]` y vuelve a leerlo para la sugerencia del reto.

PR #299 ya corrige este defecto: la etapa empieza en `all`, solo vive en memoria y cambia el contexto visible. No debe reintroducirse persistencia de etapa.

### 2. WebGPU
En `assets/ig-taller-r42-platform.js`, WebGPU es solo detección:

`webgpu: !!(navigator && navigator.gpu)`

No existe renderer WebGPU del Taller en la base inspeccionada.

### 3. Librerías
El árbol recursivo de `e8cad400...` no contiene Three.js, PixiJS, Rapier, Planck, Blockly, CodeMirror ni Tone.js.

La arquitectura visual vigente es código propio Canvas/WebGL/DOM. En PR #299 el “3D” de Arquitectura sigue siendo proyección isométrica hecha en Canvas2D, no un renderer 3D real.

### 4. AudioWorklet
La plataforma R42 crea el procesador como Blob y llama:

`audioWorklet.addModule(blobURL)`

La CSP pública no permite `blob:` en `script-src`. El código captura el error y cae silenciosamente a Web Audio clásico, pero `capabilityText()` muestra “AudioWorklet” basándose en que la API existe, no en que el módulo haya arrancado.

Esto debe corregirse:
- procesador como archivo JS same-origin;
- etiqueta/capacidad solo después de `await addModule()` con éxito;
- fallback Web Audio visible solo como funcionamiento, no como falso capability badge.

### 5. CSP / WASM
El fuente `_headers` contiene históricamente `unsafe-eval`, pero el build público ejecuta `finalize_dc_runtime_csp.py` y lo retira. `check_csp_eval_scope.py` falla si reaparece.

Decisión separada ya registrada:
`R42_A5_PHYSICS_CSP_DUAL_ENGINE_REQUIRED`

Planck es el backend 2D garantizado bajo la CSP actual; Rapier es opcional si una política futura permite WebAssembly.

### 6. Almacenamiento: contradicción canónica detectada

El documento recibido afirma que el Taller tiene regla “sin almacenamiento del navegador”.

Sin embargo, la memoria canónica A5 vigente `R42_A5_TALLER_PRODUCT_REBUILD_20260926.md` registra explícitamente:
- IndexedDB existente preservado;
- colección/proyectos/progreso locales;
- OPFS disponible para uso justificado;
- File System Access opcional.

Y el código de `ig-taller-local-data.js` usa IndexedDB como backend persistente cuando existe.

Por tanto **no existe hoy una base canónica coherente para afirmar “sin almacenamiento del navegador”**.

Se abre observación:
`OBS-R42-TALLER-STORAGE-01`

Hasta decisión de María:
- no añadir nueva persistencia oculta;
- etapa de vida siempre efímera;
- no convertir OPFS en backup automático;
- export/import manual permanece válido;
- la política de proyectos locales debe reconciliarse antes de reconstruir “Mi colección”.

## Investigación de interfaz

### Figma
Figma revirtió paneles flotantes de UI3 y volvió a paneles laterales fijos y redimensionables tras feedback: los flotantes comprimían el canvas, distraían y ralentizaban trabajo intensivo.

Fuente:
https://www.figma.com/blog/our-approach-to-designing-ui3/

En 2026 Figma documenta una arquitectura de accesibilidad de canvas basada en:
- scene graph;
- árbol de accesibilidad;
- Mirror DOM;
- sincronización bidireccional selección canvas ↔ foco DOM;
- live announcements.

Fuente:
https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/

### Godot
El patrón Scene Tree + viewport + Inspector contextual sigue siendo una referencia fuerte para herramientas complejas: seleccionar objeto cambia propiedades, sin cubrir el lienzo con paneles flotantes.

Fuente:
https://docs.godotengine.org/en/latest/tutorials/editor/inspector_dock.html

### VS Code
La Command Palette permite llegar a funciones de forma transversal por teclado, pero el acceso estándar es Ctrl/Cmd+Shift+P, no Ctrl/Cmd+K. Para Iris la paleta debe ser canal adicional, con botón visible “Acciones”; nunca atajo exclusivo.

Fuente:
https://code.visualstudio.com/docs/editing/getting-started/userinterface

### PhET
PhET prueba cada simulación mediante 4–6 entrevistas individuales think-aloud. Su investigación sobre scaffolding implícito respalda affordances, constraints, control del usuario y exploración productiva frente a largas instrucciones.

Fuentes:
https://phet.colorado.edu/es/research
https://arxiv.org/abs/1306.6544

No se ha verificado en fuente primaria la cifra “18 de 23 funciones en 10 minutos”. No usarla como evidencia.

### Scratch
La cifra “33 % → 60 %” encontrada corresponde a un análisis de adopción de estructuras de datos asociado a uso previo de cloud variables, no a una prueba de “mostrar herramientas avanzadas junto a ejemplos”. No se usa como fundamento de arquitectura.

### WCAG / COGA
WCAG 2.2 SC 2.5.7 exige una alternativa **de puntero único sin arrastrar** para cada función que requiere drag. Una alternativa de teclado por sí sola no satisface ese criterio; el teclado sigue siendo además obligatorio por sus propios criterios.

Fuentes:
https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
https://www.w3.org/TR/coga-usable/

COGA respalda jerarquía familiar, diseño consistente, acciones importantes visibles y reducción de carga cognitiva. Esto favorece un shell común estable, no 25 interfaces arbitrariamente distintas.

### Canvas y 3D accesibles
PixiJS ofrece overlay DOM accesible para objetos opt-in. Figma demuestra un Mirror DOM completo.

Fuente:
https://pixijs.com/8.x/guides/components/accessibility

Para interacción espacial/3D, W3C XAUR aporta requisitos útiles:
- navegación y objetos descritos de forma entendible por AT;
- teclado y modalidades alternativas;
- controles redimensionables;
- no exigir gestos/acciones simultáneas;
- targets grandes;
- interacción motion-agnostic.

Fuente:
https://www.w3.org/TR/xaur/

No hace falta dejar el 3D como área “sin fuentes de accesibilidad”: ya existe guía W3C útil, aunque no sea específica de Three.js/Babylon.

### Blockly
La duda queda cerrada: Blockly v13 ya soporta navegación por teclado y lector de pantalla por defecto.

Fuente:
https://blockly.com/accessibility

### CodeMirror
CodeMirror 6 evita capturar Tab por defecto precisamente para no crear keyboard traps. Si Iris decide usar Tab para indentación, debe ofrecer y documentar el escape/focus mode.

Fuentes:
https://codemirror.net/examples/tab/
https://codemirror.net/docs/ref/

### Audio
Tone.Transport usa eventos programados en tiempo de audio y es adecuado para secuenciador/composición. El código actual R43 usa `setTimeout`, por lo que todavía no cumple una arquitectura musical temporal robusta.

Fuente:
https://tonejs.github.io/docs/14.7.77/Transport

### WebGPU / 3D
Three.js `WebGPURenderer` cae automáticamente a WebGL2, pero la propia documentación lo considera todavía experimental y mantiene `WebGLRenderer` como recomendación para apps WebGL2 puras.

Fuente:
https://threejs.org/manual/pages/webgpurenderer

Chrome 146 introduce compatibility mode opt-in; comenzó en Android/OpenGL ES 3.1. Es mejora adicional, no baseline.

Fuente:
https://developer.chrome.com/blog/new-in-webgpu-146

### PixiJS y CSP
PixiJS puede trabajar con CSP estricta importando `pixi.js/unsafe-eval`: pese al nombre, el módulo reemplaza codegen dinámico por polyfills estáticos. No es una razón para restaurar `unsafe-eval`.

Sin embargo, en 2026 existe un bug abierto de UBO custom bajo strict-CSP + WebGPU. Para Iris:
- Pixi WebGL como baseline;
- WebGPU no como requisito;
- test real con CSP final.

Fuente:
https://github.com/pixijs/pixijs/blob/dev/skills/pixijs-environments/SKILL.md

### Etapas y privacidad
AEPD afirma expresamente que proteger a menores no exige que el proveedor conozca su identidad ni su edad.

Fuente:
https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/1-sistemas-de-verificacion-edad/FAQ-1019-que-supone-la-verificacion-de-edad

ICO permite aplicar protecciones a todos si no se realiza age assurance y advierte que eso no obliga a infantilizar adultos.

Fuente:
https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/

## Fundación Telefónica: corrección del documento previo

Las páginas actuales 2026–27 sí explicitan resultados propios:
- Videojuegos: prototipo propio y publicación.
- Videomapping: diseño/mapping propio.
- 3D: diseño/modelo propio preparado para impresión.
- Robótica: programación del robot para realizar tareas.

Fuentes:
https://espacio.fundaciontelefonica.com/evento/taller-iniciacion-a-la-programacion-de-videojuegos/
https://espacio.fundaciontelefonica.com/evento/taller-introduccion-al-videomapping/
https://espacio.fundaciontelefonica.com/evento/taller-de-impresion-y-modelado-3d-2/
https://espacio.fundaciontelefonica.com/evento/talleres-de-tecnologia-para-jovenes/

Esto respalda convertir “crear algo propio” en gate Iris Green.

## Diagnóstico de la interfaz actual

PR #299 ya corrige parte del problema:
- shell común workspace-first;
- rail lateral;
- canvas central;
- inspector derecho en escritorio;
- bottom rail + sheet en móvil;
- stage efímero;
- manipulación directa en 9 familias;
- presión de stylus en Dibujo.

Pero todavía no es el editor objetivo:
- el rail izquierdo es herramientas, no estructura/capas/objetos;
- no hay scene/layer tree común;
- el inspector R42 no está realmente ligado a la selección R43: para `.ig43-editor` muestra una nota y deja controles en la toolbar;
- no existe command palette/Actions transversal;
- no existe contrato universal de zoom/pan;
- Arquitectura “3D” es Canvas2D isométrico;
- Simulación R43 es grid/cellular, no motor físico;
- Ritmo/Composición usan `setTimeout`, no reloj de audio;
- accesibilidad del canvas es principalmente `role=application` + aria-label + live status, no un modelo semántico de objetos.

## Arquitectura propuesta

### Un shell común, no un motor común

No construir 25 páginas independientes ni 25 shells.

Tampoco forzar 25 estudios dentro de tres mecanismos demasiado amplios.

Usar un shell común con **cinco perfiles de banco de trabajo**:

1. **Lienzo / composición visual**
   Dibujo, Diseño gráfico, Patrones, Color, Cómic, Fotografía, Moda, Ideas; Pixel Art comparte parte de este perfil.

2. **Construir ↔ probar / espacial**
   Estructuras, Arquitectura, Máquinas, Circuitos, Papiroflexia/3D, Simulaciones y componentes espaciales de Mundos/Juegos de mesa.

3. **Línea de tiempo**
   Ritmo, Composición, Síntesis, animación de Pixel Art y futuro Videomapping.

4. **Bloques ↔ código ↔ ejecutar**
   Programación, Robótica y parte de Videojuegos.

5. **Documento / sistema de conocimiento**
   Escritura con restricciones, Lenguas inventadas y partes de Mundos. No obligarlos a convertirse en canvas porque el editor textual/estructural es su herramienta natural.

## Shell desktop

- topbar compacta: volver, título, undo/redo, estado probar/editar cuando exista, exportar/archivo;
- izquierda: dock **Estructura**, fijo/plegable/redimensionable; su nombre contextual puede ser Capas, Objetos, Escena, Pistas, Archivos o Secciones;
- centro: workspace principal;
- derecha: Inspector contextual fijo/redimensionable, unido a la selección real;
- abajo: zona contextual, no toolbar universal rígida:
  - herramientas frecuentes en visual/espacial;
  - timeline/pistas en música/animación;
  - consola/salida en código;
  - métricas/restricciones en texto;
- botón visible **Acciones** + command palette para power users.

No mostrar docks vacíos.

## Shell tablet/móvil

- workspace dominante;
- toolbar inferior;
- Estructura e Inspector como sheets mutuamente excluyentes;
- nada esencial basado en hover;
- no exigir gesto simultáneo lápiz+dedo;
- acciones equivalentes por toque/teclado;
- probar Apple Pencil en dispositivo real.

## Modelo semántico común

La pieza clave no es una librería gráfica: es un **modelo de escena/proyecto Iris** independiente del renderer.

Cada renderer (DOM, Canvas, Pixi, Three) consume el mismo estado.

Del mismo estado derivan:
- Scene/Layers tree;
- Inspector;
- exportadores;
- undo/redo;
- guardado/import;
- Mirror DOM accesible;
- anuncios;
- pruebas.

Selección canvas ↔ foco DOM bidireccional.

Cada acción de drag tendrá:
- drag como canal principal cuando convenga;
- alternativa de puntero sin drag (seleccionar + mover con controles, campos o destino);
- teclado;
- texto equivalente/semántica.

## Etapas de vida

No cambiar por investigación la decisión canónica:
`Infancia · Adolescencia · Adultez · Cualquier edad`.

Separar dos conceptos:
- **Etapa de vida** = lente de ejemplos/contexto/vocabulario, efímera, nunca limita herramientas.
- **Nivel de ayuda** = si María lo adopta después, puede ser algo como Explorar / Con guía / Libre, independiente de edad.

No equiparar edad con competencia.

## Motores sugeridos

- PixiJS/WebGL para edición 2D de alto rendimiento; strict-CSP polyfill, sin relajar CSP.
- Three.js `WebGLRenderer` como baseline inicial 3D; WebGPURenderer opcional posterior.
- Planck como física 2D de producción bajo CSP actual; Rapier opcional futuro.
- Blockly v13 para bloques accesibles.
- CodeMirror 6 para texto/código.
- Tone.js para reloj musical/timeline.
- AudioWorklet servido same-origin.
- módulos self-hosted y lazy-loaded por estudio.

No mostrar badges de capacidad hasta que la capacidad haya inicializado de verdad.

## Física y verdad técnica

Planck/Rapier son motores rigid-body; no sustituyen un cálculo estructural.

En Estructuras:
- motor físico = comportamiento visible;
- cálculo propio existente = cifras de carga/tensión/margen;
- umbrales de rotura/deformación visual pueden derivarse del cálculo;
- no presentar resultados como certificación de ingeniería.

## Exportación

Mantener salida específica por estudio, no un botón genérico que exporta JSON sin utilidad.

Ejemplos objetivo:
- juego: paquete jugable autocontenido;
- 3D: GLB y STL;
- música: proyecto + WAV + MIDI;
- videomapping: proyecto + modo proyector/fullscreen + ajuste de esquinas;
- robótica: gemelo digital; Web Serial/Bluetooth solo como progressive enhancement futuro;
- imagen/diseño: PNG/SVG/PDF según estudio.

## Gate “artifact-first”

Un estudio no termina porque sus funciones existan.

Debe demostrarse que:
- una persona crea algo propio significativo en pocos minutos;
- el camino básico se descubre sin leer instrucciones largas;
- la manipulación principal se siente propia de ese estudio;
- las alternativas accesibles funcionan;
- el resultado exportado es útil/abrible;
- ES/EN está completo;
- funciona en hardware modesto definido;
- no requiere red externa inesperada;
- cumple la decisión final de almacenamiento;
- pasa HUMAN QA de María.

## Siguiente decisión antes de construir

1. María revisa esta arquitectura.
2. Resolver `OBS-R42-TALLER-STORAGE-01`.
3. A5 conserva PR #299; no ampliar fase 6 todavía.
4. Tras aprobación, convertir esta memoria en orden de implementación por capas y estudios bandera.

Estado:
`R42_TALLER_INTERFACE_RESEARCH_COMPLETE_IMPLEMENTATION_HOLD`.
