# R53 · CLAUDE · RINCÓN · REBUILD DE SALAS COMO INSTALACIONES REALES + CIERRE DE MEDIA QA

Fecha: 28/09/2026
Responsable: **Claude**
Revisión: **Astra**
Integración: **A2**
Aceptación: **HUMAN QA María**

## PRECEDENCIA

Esta orden nace del ASTRA REVIEW de #307.

Estado de entrada:
`R46_CLAUDE_RINCON_ASTRA_REVIEW_FAIL_REBUILD_REQUIRED`.

NO rehacer todo el Rincón.

## KEEP

Conservar:
- arquitectura de tres modos;
- `rincon-r46-breath.js` como base;
- `rincon-r46-landscapes.js` como loader;
- Pantalla limpia;
- fixes #303;
- layout wide;
- audio Iris Green existente;
- R42/R02;
- ES/EN.

## REBUILD

Rehacer:
- Salas inmersivas;
- reduced motion real;
- fallbacks de Salas;
- audio opcional de Salas;
- QA/evidencia;
- provenance/ad gate de Paisajes.

---

# 1. FALLO RAÍZ A CORREGIR

La entrega anterior convirtió cinco salas en cinco presets de un único shader.

Eso queda prohibido.

No se acepta:
- un solo `FRAG` con `uRoom` cambiando material/paleta;
- una misma nube de objetos con formas distintas;
- “instalación” = fondo procedural a pantalla completa;
- cinco variantes del mismo campo.

## Nueva regla

**Cada sala debe tener una gramática espacial propia.**

Puede compartir:
- renderer;
- lifecycle;
- cámara;
- controles;
- performance manager.

Pero cada sala debe aportar:
- geometría/composición propia;
- lógica de movimiento propia;
- iluminación propia;
- interacción propia;
- firma visual distinguible incluso en captura.

---

# 2. REFERENCIA DE PRODUCTO

No copiar obras.

Extraer principios de:
- Balloon Museum / Pop Air / Euphoria;
- Spirit of Japan;
- referencias indicadas por María.

Principios:
- escala monumental;
- objetos fuera de escala;
- espacio transformado;
- interacción/descubrimiento;
- piezas que se entran, rodean o atraviesan;
- público dentro de la obra, no mirando un fondo.

“No caja oscura” NO significa “sin arquitectura”.

Se permiten:
- superficies;
- plataformas;
- membranas;
- marcos;
- volúmenes;
- pasajes;
- estructuras abiertas.

Lo prohibido es que parezca:
- habitación negra cerrada;
- paisaje natural;
- cielo/horizonte;
- fondo animado.

---

# 3. LAS CINCO INSTALACIONES

## 3.1 Mundo de globos de luz

Debe leerse como instalación inflable, no como bolas 3D dispersas.

Obligatorio:
- formas blandas de escalas muy diferentes;
- varios tipos de volumen, no solo esfera perfecta;
- piezas monumentales que salen del encuadre;
- oclusión y capas;
- sensación de atravesar/estar entre cuerpos;
- paleta luminosa/pastel;
- contacto visual suave entre piezas;
- pointer/touch aparta o desplaza lentamente.

Evitar:
- “screensaver de bolas”;
- cadena de esferas pequeñas flotantes.

## 3.2 Jardín de luz

No haces verticales ni láseres.

Debe usar:
- fibras/curvas/splines;
- ramas luminosas;
- grupos orgánicos;
- puntos/semillas de luz;
- profundidad;
- crecimiento/lentitud;
- curvas que se cruzan alrededor de la vista.

Debe poder parecer una instalación de fibras de luz física.

## 3.3 Papel y viento

No superelipses gruesas.

Debe usar hojas/superficies:
- finas;
- dos caras;
- translúcidas;
- pliegue/curvatura;
- bordes visibles;
- solapes;
- sombras suaves entre hojas;
- movimiento de viento lento;
- luz cálida.

Debe leerse como papel suspendido real, no como bloques redondeados.

## 3.4 Dentro de una nube

Regla expresa de María:

**una nube de museo son volúmenes blandos, no vapor/cielo.**

Prohibido:
- fondo azul cielo;
- horizonte;
- “nubes flotando en el cielo”;
- fog como recurso principal.

Construir:
- masas escultóricas blandas;
- lóbulos/volúmenes conectados;
- tamaños monumentales;
- formas que rodean y recortan el encuadre;
- fondo neutro/luminoso de instalación, no cielo;
- luz atravesando material;
- sensación de algodón/inflable/espuma escultórica.

## 3.5 Respiración del espacio

NO usar el mismo campo de globos.

El espacio mismo debe respirar mediante:
- membranas;
- paneles/líneas arquitectónicas;
- anillos/portales;
- superficies luminosas;
- estructuras abiertas que se expanden/contraen.

Debe distinguirse inmediatamente de Globos en una captura fija.

---

# 4. ARQUITECTURA TÉCNICA

## Prohibido como arquitectura final
Fragment shader por píxel con loop de 20–56 cuerpos para todas las salas.

## Preferencia
Scene graph / geometría instanciada / meshes / sprites volumétricos / curvas.

Three.js/WebGL2 está autorizado si reduce complejidad.
WebGPU puede ser enhancement si existe una implementación real y medible.

No introducir framework de aplicación.

## Per-room modules

Ejemplo:
- `rincon-r53-room-balloons.js`
- `rincon-r53-room-garden.js`
- `rincon-r53-room-paper.js`
- `rincon-r53-room-cloud.js`
- `rincon-r53-room-breathing-space.js`

Puede mejorar nombres.

Shared:
- renderer/lifecycle;
- camera/parallax;
- quality manager;
- audio adapter;
- motion preferences.

---

# 5. FALLBACKS DE SALAS · OBLIGATORIOS

R46 original exige progressive enhancement.

Cada sala debe tener:
- A: WebGPU si se implementa realmente;
- B: WebGL2 funcional;
- C: Canvas2D animado simplificado;
- D: estático finalizado.

Si A no existe, no declarar WebGPU en Salas.

No mostrar:
“Este dispositivo no puede dibujar las salas”
cuando Canvas2D/static pueda dar una experiencia válida.

---

# 6. REDUCED MOTION

## Respirar

Corregir:
- con reduced motion no mantener pulsación continua por defecto;
- ofrecer guía discreta o estática;
- activar `staticOnReduced` o equivalente real;
- escuchar cambios de preferencia, no solo leer una vez.

## Salas

Estados:
- NORMAL;
- REDUCIDO;
- SIN_MOVIMIENTO.

Debe responder a:
- `prefers-reduced-motion`;
- `IGPreferences`;
- cambio de ajuste después de montar.

SIN_MOVIMIENTO:
- 0 RAF continuo;
- imagen estática finalizada.

REDUCIDO:
- movimiento claramente menor, no simplemente 32 % de la misma experiencia si sigue provocando desplazamiento continuo.

---

# 7. AUDIO EN SALAS

La entrega anterior lo documentó pero no lo implementó.

Añadir control opcional:
**Sonido de Iris Green / Iris Green sound**

Default:
OFF.

Solo audios ya existentes/aprobados.

No buscar audio externo.

Si una sala no tiene audio adecuado:
- silencio es válido;
- no inventar emparejamiento.

Controles:
- on/off;
- volumen;
- fade;
- parar al salir/cambiar modo.

---

# 8. PAISAJES · KEEP LOADER, CERRAR CONTENIDO

Mantener:
- youtube-nocookie;
- iframe solo tras clic;
- mute obligatorio;
- poster local;
- audio Iris separado.

Corregir:
- manifest de provenance;
- canal/autor;
- título real;
- source URL;
- fecha de consulta;
- duración verificada;
- estado de embed;
- age restriction;
- resultado ad gate;
- escritorio/móvil.

No declarar “autorizado/aprobado” mientras `estado=candidato`.

Usar o eliminar `alt[]`; no dejar fallback muerto.

---

# 9. CSP · NO CREAR UN BLOQUEO FALSO

El base A2 declarado en la entrega anterior:
`bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`

ya tiene en `_headers`:
`frame-src https://www.youtube-nocookie.com ...`

Por tanto:
- NO añadir un fix CSP duplicado;
- NO declarar CSP como bloqueante;
- solo comprobar que el HEAD vivo no haya regresado.

---

# 10. QA NUEVA · NO “112 PASS” POR REPETIR CLEAN MODE

## Por sala

Probar las cinco individualmente:
- selección;
- render;
- interacción;
- keyboard equivalent;
- stop/release;
- Normal/Reducido/Sin movimiento;
- fallback;
- desktop/móvil.

## Evidencia temporal

Cada sala:
- recording 15–30 s desktop;
- recording 15–30 s móvil;
- captura 1440;
- captura 390.

La aceptación visual no se decide por una captura genérica de “Salas”.

## Paisajes

Antes de READY_FOR_ASTRA:
- 20–30 min reales al menos en Playa/Río/Lluvia;
- ad gate real;
- buffering;
- cámara/cortes;
- anuncios/promos;
- embed availability.

## Performance

Medir en hardware real o browser GPU razonable:
- FPS/frame time;
- long tasks;
- memoria aproximada;
- downgrade de quality;
- 1440;
- 390.

Si no puede medirse:
estado = PENDING_HARDWARE_QA,
no “READY” final.

---

# 11. QA REPORT

Debe diferenciar:

### AUTOMATIC_PASS
Hechos verificables.

### PRODUCT_VISUAL_PENDING
Percepción.

### MEDIA_PENDING
Ad/video.

### HARDWARE_PENDING
GPU/performance.

No sumar esas categorías como un único “112/112”.

---

# 12. EVIDENCIA LIMPIA

El paquete final no debe mezclar screenshots obsoletos:
- océano;
- río;
- aurora;
- cristal;
- farolillos;
- color;
- pétalos;

con la evidencia candidata actual.

Mover histórico a:
`docs/r46/history/`

Final:
`docs/r53/final/`

---

# 13. COPY

Evitar copy defensivo:
`No miras un paisaje: estás dentro.`

Usar descripción concreta de acción/experiencia.

Ejemplo:
`Explora un espacio visual que responde lentamente al movimiento.`

ES/EN equivalentes.

---

# 14. ESTADO / MARCADOR

No volver a emitir:
`R46_CLAUDE_RINCON_REBUILD_READY_FOR_ASTRA`
mientras falten media/hardware gates requeridos.

Entrega de código:
`R53_CLAUDE_RINCON_INSTALLATIONS_CODE_READY_MEDIA_QA_PENDING`

Entrega realmente completa:
`R53_CLAUDE_RINCON_INSTALLATIONS_READY_FOR_ASTRA`

Solo el segundo pasa a Astra/A2 como candidato final.

No main.
No producción.
No deploy propio.
