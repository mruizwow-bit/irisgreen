# AXIOMA · CONSTRUCCIÓN PLAYABLE R01 · QA RUNTIME REAL

Fecha: 05/10/2026

Estado:
`AXIOMA_CONSTRUCTION_PLAYABLE_R01_REWORK_REQUIRED`

## Artifact auditado

Rama:
`prisma/construction-r01-storyboard-r02-20261005`

Commit runtime:
`29a8770f235e75cd99a8758a07f06923acb99b7d`

Run:
`37326606367 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_PLAYABLE_R01`

Artifact ID:
`11351693774`

Digest GitHub artifact:
`sha256:a8357d92e169158cff533aeb9398b8f66c60dc49ce2ea395a7d0785dd7b88a57`

ZIP interno:
`PRISMA_CONSTRUCTION_PLAYABLE_R01.zip`

SHA-256 verificado:
`ef30977cc5327c0b17fb42b2d03a54827e5f130ae12bf5cf349ec08b47d38f87`

Integridad:
- sha256sum PASS;
- ZIP integrity PASS;
- 6 archivos: juegos.html, game.css, game.js, README, QA_PRISMA.json, manifest;
- manifest hashes coherentes.

## Método Axioma

Se ejecutaron los bytes exactos HTML/CSS/JS del artifact en Chromium real del harness Axioma.

Nota de entorno:
el navegador de este harness bloquea navegación `file://`/localhost por política administrativa, por lo que para el runtime interactivo se cargaron los mismos bytes de HTML/CSS/JS inline en Chromium. Esto reproduce DOM, CSS, canvas, teclado, touch y lógica del juego; no reproduce el origen `file://` para almacenamiento local.

El guardado/recarga file-origin queda respaldado por evidencia Prisma y revisión de código, pero no se eleva a verificación independiente Axioma en este retest.

## 1 · Gameplay real

### Ruta A
**PASS**

Ejecutada con controles reales de teclado.

Resultado:
- 24 madera + 12 piedra recogidos;
- P1–P5 R1;
- bloque C3 z0;
- coste de puente: 5 madera + 1 piedra;
- retirada del bloque C3 con dependencias: bloqueada correctamente;
- retirada válida de P5: devuelve 1 madera;
- Ctrl+Z: restaura P5 e inventario;
- cruce completado;
- caja abierta;
- escaleras desbloqueadas;
- escalera inferior z1→z2;
- escalera superior z2→z3;
- terraza alcanzada;
- parcela libre abierta.

Estado final observado:
- player = (10,1,z3);
- freeMode = true;
- inventory = 15 madera / 11 piedra antes de infinito visual;
- piezas = 8.

### Ruta B
**PASS**

Ejecutada con controles reales.

Resultado:
- bloques C2/C4;
- plataformas C1–C5;
- puente = 5 madera + 2 piedra;
- caja;
- dos escaleras;
- terraza;
- parcela libre.

Estado final:
- player = (10,1,z3);
- freeMode = true;
- inventory = 15 madera / 10 piedra;
- piezas = 9.

### Touch
**PASS funcional**

A 320:
- D-pad táctil mueve;
- Acción recoge materiales;
- Construir cambia de modo;
- selección de Plataforma;
- D-pad mueve cursor;
- Colocar modifica mundo e inventario;
- foco permanece en botón Colocar tras la acción.

## 2 · Responsive / targets por defecto

**PASS**

Chromium:
- 320: scrollWidth = 320;
- 390: scrollWidth = 390;
- 1440: scrollWidth = 1440.

Targets visibles:
- 320: mínimo 44×44;
- 390: mínimo 44×44;
- 1440: 44 px o mayor.

No se detectaron page errors / console errors durante las ejecuciones Axioma.

## 3 · Teclado / foco / dialogs

**PASS con un blocker semántico descrito en A11Y-02**

Orden de foco base comprobado:
`skip → Ayuda → Pausa → canvas → Recorrer → Construir → D-pad/Acción → Movimiento → Nueva partida`.

Ayuda:
- dialog nativo;
- foco entra en Cerrar;
- al cerrar vuelve a Ayuda.

Pausa:
- dialog nativo;
- foco entra en Continuar;
- al cerrar vuelve a Pausa.

Recorrer/Construir:
- `aria-pressed` correcto.

Piezas:
- `aria-pressed` correcto;
- Escalera disabled antes de caja.

## 4 · Motion

**PASS**

- `prefers-reduced-motion: reduce` inicia en `reduced`;
- NORMAL: feedback pulse 0.35 s;
- REDUCED: 0.08 s;
- NONE: animation-name = none;
- gameplay espacial es discreto/inmediato, no depende de animación.

## 5 · Forced colors

**PASS de controles/estado**

Con `forced-colors: active`:
- controles siguen visibles;
- selected conserva borde del sistema;
- foco conserva outline;
- feedback mantiene texto/borde;
- datos esenciales siguen en DOM.

Canvas no se usa como única fuente de estado; ver blocker A11Y-02 sobre anuncio dinámico.

---

# FINDINGS

## A11Y-01 · Texto 200% rompe reflow en 320/390
**FAIL · BLOCKER**

Con texto al 200%:

### 320
- viewport = 320;
- document scrollWidth = **483**.

### 390
- viewport = 390;
- document scrollWidth = **483**.

### 1440
- scrollWidth = 1440 → PASS.

En 320/390:
- controles se salen horizontalmente;
- `Recorrer/Construir` excede viewport;
- selector de Movimiento fuerza ancho mínimo;
- panel de piezas se expande;
- D-pad/build-actions heredan el ancho desbordado;
- texto de `Colocar` en el botón central queda visualmente comprimido/cortado.

Causa principal observada:
min-content width del bloque de controles, especialmente `.settings-row label + select`, fuerza el contenedor a ~451 px.

Corrección:
- `min-width:0` en hijos flex/grid relevantes;
- settings-row debe envolver verticalmente al crecer texto;
- select debe poder ocupar 100% sin imponer min-content horizontal;
- mode-controls debe wrapear dentro del viewport;
- piece/build controls deben mantener ancho <=100%;
- repetir 320/390 con texto 200%.

Gate:
`document.documentElement.scrollWidth <= innerWidth`
y 0 texto/controles cortados.

## A11Y-02 · Canvas focusable sin nombre + movimiento/cursor no anunciado
**FAIL · BLOCKER**

El canvas es:
- `tabindex=0`;
- `role=img`;
- sin `aria-label` / `aria-labelledby`.

ARIA snapshot real:
`- img`

Es decir: **nombre accesible vacío**.

Además:
- `player-desc` no tiene `role=status` ni `aria-live`;
- `cell-desc` no tiene `role=status` ni `aria-live`;
- `movePlayer()` actualiza posición sin anunciarla salvo eventos especiales;
- `moveCursor()` actualiza casilla/validez sin llamada a `announce()`.

Consecuencia:
una persona que mantiene foco en la escena para usar flechas/WASD puede mover jugador/cursor pero no recibe de forma fiable por AT:
- nueva posición;
- ruta/columna;
- altura;
- casilla ocupada/vacía;
- validez/motivo.

`aria-describedby` con texto dinámico no es sustituto fiable de una live region para cambios sucesivos.

Corrección:
1. dar nombre accesible al foco de juego:
   - p.ej. `Escena/tablero de construcción`;
2. asociar instrucciones de teclado;
3. crear un live region único y conciso para:
   - movimiento del jugador;
   - movimiento del cursor;
   - cambio de altura/orientación;
   - validez de casilla;
4. evitar duplicidad/verborrea: no hacen falta dos live regions simultáneas.

No usar `role=application` salvo necesidad demostrada.

## A11Y-03 · Microtexto informativo del canvas no alcanza contraste
**FAIL · BLOCKER**

Colores declarados en el runtime:

### C1–C5
Texto:
`rgba(255,255,255,.82)`

Fondo de agua:
`#1a9bc8`

Contraste efectivo aproximado:
**2.63:1**

Fuente:
`700 12px system-ui`

### Etiqueta de bloque `B z0`
Texto:
`#263637`

Fondo de ruta/agua:
`#1a9bc8`

Contraste:
**~3.94:1**

Fuente:
`700 11px system-ui`

Ambos están por debajo de 4.5:1 para texto normal.

Además, por escalado del canvas 960 px → móvil:
- 12 px intrínsecos ≈ 3.8 px CSS a 320 / 4.7 px a 390;
- 11 px ≈ 3.5 px CSS a 320 / 4.3 px a 390.

Por tanto no deben tratarse como texto legible principal en móvil.

Corrección posible:
- badge oscuro/contrastante como R1/R2;
- texto oscuro con fondo claro sólido;
- o eliminar microtexto del canvas móvil y exponer esa información mediante DOM legible.

Si C1–C5/B z son solo decorativos, deben dejar de ser necesarios para comprender/operar; si son informativos, deben cumplir contraste/legibilidad.

---

## EVIDENCE-01 · El workflow SUCCESS no ejecuta browser QA
**EVIDENCE GAP · no confundir con fallo de gameplay**

El workflow `.github/workflows/prisma-construction-playable-r01.yml` ejecuta:
- `node --check`;
- packaging;
- sha256;
- unzip;
- upload.

No ejecuta un navegador ni genera `QA_PRISMA.json` durante CI.

Por tanto:
`37326606367 · SUCCESS`
demuestra packaging/sintaxis, no por sí mismo las afirmaciones de runtime de `QA_PRISMA.json`.

Axioma ha comprobado de forma independiente rutas A/B, touch, responsive default, focus, motion y forced-colors, pero para el siguiente artifact conviene meter en CI browser tests de:
- rutas A/B;
- 320/390/1440;
- texto 200%;
- accessible name/live status;
- contraste de microtexto o política DOM alternativa;
- save/reload.

---

# Resultado

PASS:
- lógica/jugabilidad A;
- lógica/jugabilidad B;
- dependencias/retirar;
- undo;
- caja/escaleras/terraza/libre;
- teclado;
- touch;
- default responsive;
- >=44 px;
- focus order;
- dialog focus return;
- NORMAL/REDUCED/NONE;
- forced-colors smoke;
- 0 runtime errors observados.

REWORK:
- A11Y-01 reflow texto 200%;
- A11Y-02 nombre/anuncio accesible dinámico;
- A11Y-03 contraste/legibilidad microtexto canvas.

Estado:
`AXIOMA_CONSTRUCTION_PLAYABLE_R01_REWORK_REQUIRED`

Siguiente:
`PATCH RUNTIME A11Y-01..03 + BROWSER CI → AXIOMA RETEST ACOTADO → HUMAN QA MARÍA JUGANDO`

No tocar:
- lógica A/B;
- costes;
- soporte/alcance;
- arte más allá de microtexto/DOM necesario;
- main.

`NO MAIN · NO PRODUCCIÓN`.
