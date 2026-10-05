# AXIOMA · CONSTRUCCIÓN PLAYABLE R01 · RETEST ACOTADO A11Y-01..03

Fecha: 05/10/2026

Gate:
`AXIOMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_HUMAN_QA`

## Artifact exacto auditado

Rama:
`prisma/construction-r01-storyboard-r02-20261005`

Build HEAD:
`139622ffab3153d73f807bfec51c5710d474e875`

Run original:
`37334312861 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_PLAYABLE_R01`

Artifact ID:
`11355916345`

ZIP interno:
`PRISMA_CONSTRUCTION_PLAYABLE_R01.zip`

SHA-256 verificado:
`e2370c5e6e71177412f66623077e8f66fc47b03b98985a40b6e89fb59b958b2a`

Digest contenedor:
`sha256:6f2e8e20a087c417f14379f47e8de4d533d980ad8bce43a347019c1b0c586577`

Manifest:
- 6/6 archivos declarados;
- 6/6 hashes verificados contra bytes del ZIP;
- QA_BROWSER.json empaquetado y coherente con log CI.

## Browser CI real

El workflow ejecuta antes de empaquetar:
- Playwright 1.63.0;
- Chromium real Linux;
- rutas A/B;
- A11Y 320/390/1440;
- 200% text;
- accessible name/live;
- A11Y-03;
- save/reload.

No es un JSON preexistente: `QA_BROWSER.json` se genera durante el job tras las pruebas de navegador.

Axioma relanzó además el mismo job exacto sobre el mismo SHA.

Rerun:
- job `111881839819`;
- conclusión: `SUCCESS`;
- `BROWSER_QA_PASS` repetido;
- SHA ZIP repetido exactamente:
  `e2370c5e6e71177412f66623077e8f66fc47b03b98985a40b6e89fb59b958b2a`.

## A11Y-01 · texto 200% / reflow

**PASS**

Browser QA original + rerun:

320:
- roam scrollWidth = 320;
- build scrollWidth = 320;
- clipped = [];
- offenders = [];
- min target build = 44 px.

390:
- roam scrollWidth = 390;
- build scrollWidth = 390;
- clipped = [];
- offenders = [];
- min target build = 44 px.

1440:
- roam/build scrollWidth = 1440;
- clipped = [];
- offenders = [];
- min target build = 44 px.

El blocker previo `scrollWidth=483` queda cerrado.

Marcador:
`CONSTRUCTION_A11Y_01_REFLOW_200_PASS`

## A11Y-02 · canvas / AT

**PASS**

Canvas final:
- `role=img`;
- `tabindex=0`;
- nombre accesible:
  `Tablero de construcción de El taller de las islas`;
- instrucciones mediante `aria-describedby`;
- `aria-keyshortcuts`;
- sin `role=application`.

Live:
- exactamente 1 `role=status aria-live=polite`;
- feedback visual no duplica live region.

Browser evidence:
- jugador:
  `Posición: Taller/orilla inicial · (1,4) · z1.`
- cursor:
  `(2,4) · z1. Vacía. No válida: No tienes materiales suficientes.`

Código final llama a live announcement al:
- mover jugador;
- mover cursor;
- cambiar pieza;
- orientación;
- altura/modo y feedback relevante.

Marcador:
`CONSTRUCTION_A11Y_02_CANVAS_LIVE_PASS`

## A11Y-03 · microtexto canvas

**PASS**

Código final no dibuja:
- `C1–C5`;
- `B z0`.

Browser test verifica explícitamente la ausencia de esas llamadas de render.

La información operativa vive en:
- `#cell-desc`;
- `#game-live`.

Se elimina la dependencia del microtexto escalado/contrastado del canvas.

Marcador:
`CONSTRUCTION_A11Y_03_CANVAS_MICROTEXT_PASS`

## Smoke de regresión

PASS en Browser CI original + rerun:
- Ruta A;
- Ruta B por touch/buttons;
- retirada dependiente;
- undo;
- caja/escaleras/terraza/libre;
- save/reload;
- 0 runtime/resource errors en casos ejecutados;
- package/hash/unzip.

No se detecta regresión de gameplay vinculada al patch.

## Resultado

A11Y-01 = PASS
A11Y-02 = PASS
A11Y-03 = PASS
Browser CI = PASS reproducido

Estado:
`AXIOMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_HUMAN_QA`

## Alcance

Este gate significa:
**prototipo jugable R01 listo para que María lo pruebe jugando**.

No significa:
- aprobación final de producto;
- conformidad WCAG global;
- autorización de merge a main;
- producción/deploy.

Siguiente:
`HUMAN QA MARÍA JUGANDO`

Permanece:
`NO MAIN · NO PRODUCCIÓN`.
