# ADDENDUM R63 · Rincón · Sakura · 29/09/2026

Estado: `R63_CLAUDE_RINCON_SAKURA_CANDIDATE_ORDERED`

## Decisión vigente

La reselección de salas sensoriales ordenada por María el 29/09/2026 sustituye la dirección anterior de Globos en todo lo que contradiga este addendum.

- Mundo de globos de luz queda retirado del catálogo/generador.
- Sakura pasa a ser el único piloto de Salas autorizado para cierre en R63.
- Jardín de luz, Papel y viento, Dentro de una nube y Respiración del espacio quedan congeladas.
- Faroles flotantes, Lluvia de luz, Agua y reflejos y Bosque bioluminiscente NO se construyen hasta HUMAN QA de Sakura.
- R61 Pecera #325 sigue como carril independiente.

## Naturaleza de R63

Sakura ya existe como prototipo. R63 NO autoriza reconstruirla desde capturas.

R63 exige:
1. localizar/materializar el código exacto del prototipo;
2. portarlo sobre un baseline A2 vivo y registrado;
3. convertirlo en handoff reproducible;
4. cerrar accesibilidad, movimiento, fallbacks, QA y evidencia;
5. pasar Astra;
6. pasar A2/Deploy Preview;
7. pasar HUMAN QA María.

Si la fuente exacta no está accesible:
`R63_SAKURA_SOURCE_ARTIFACT_MISSING_BLOCKED`
y STOP.

## Precedencias globales obligatorias

R63 hereda:
- `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`;
- `IRIS_GREEN_AGE_TAXONOMY_2026`;
- `IRIS_GREEN_LOW_STIMULATION_SURFACES_2026`;
- `IRIS_GREEN_GLOBAL_UI_TOKENS_2026`;
- R42/R02;
- ES/EN;
- A2 como única puerta web.

La interfaz consume la hoja canónica A2 `assets/ig-global-ui-tokens-2026.css`.
No se crea una segunda fuente final de tokens.

Arte y chrome se separan: LIGHT/DARK NAVY gobiernan UI; el stage puede conservar una dirección artística propia y no se repinta solo para demostrar el tema.

## Fixes heredados

PR #303 no fue integrado. R63 debe portar semánticamente:
- clean mode idempotente;
- `[hidden]` realmente oculto frente a reglas `display:flex!important`.

No cherry-pick ciego: adaptar al HEAD vivo.

## Gate

Marcador de entrega Claude:
`R63_CLAUDE_SAKURA_REPRODUCIBLE_READY_FOR_ASTRA`

Marcador que únicamente puede emitir María tras preview:
`R63_SAKURA_HUMAN_APPROVED_UNLOCK_NEXT_ROOM`

No main. No producción. No deploy propio. No siguiente sala antes del gate humano.

Orden completa con bloque normativo embebido:
`ORDENES/R63_CLAUDE_RINCON_SAKURA/01_CLAUDE.md`.
