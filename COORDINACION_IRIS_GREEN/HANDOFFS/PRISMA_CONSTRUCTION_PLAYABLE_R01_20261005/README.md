# PRISMA · CONSTRUCCIÓN · PROTOTIPO JUGABLE R01

Fecha: 2026-10-05  
Issue: #369  
Orden: comentario `5996165622`  
Rama: `prisma/construction-r01-storyboard-r02-20261005`

Estado:
`PRISMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_AXIOMA`

## Qué se ha montado

Página autónoma:
`prototypes/construction-playable-r01/juegos.html`

No es storyboard: es una partida controlable con:
- personaje;
- recogida de materiales;
- Recorrer / Construir;
- cursor, altura y orientación;
- preview válida/inválida con causa;
- colocar, retirar y deshacer;
- rutas R1/R2 C1–C5;
- soluciones A/B R02;
- caja, escaleras y terraza;
- parcela libre/materiales ilimitados;
- guardado local + continuar/nueva partida;
- teclado y botones touch;
- NORMAL/REDUCED/NONE;
- forced-colors y DOM textual de estado.

## QA Prisma ejecutado en runtime real

Chrome headless local sobre el mismo HTML:

### Solución A
PASS:
- 24 madera + 12 piedra;
- P1, P2, bloque C3, P3, P4, P5;
- retirada del bloque C3 con dependientes = bloqueada;
- P4 → deshacer → inventario/geometría restaurados → P4 recolocada;
- cruce R1;
- coste puente = 5 madera + 1 piedra;
- caja abre;
- dos escaleras z1→z2→z3;
- terraza alcanzada;
- parcela libre abierta.

Estado final antes de ∞:
- madera 15;
- piedra 11;
- personaje (10,1,z3).

### Solución B
PASS:
- bloques C2/C4;
- plataformas C1–C5;
- cruce R2;
- coste puente = 5 madera + 2 piedra;
- caja;
- dos escaleras;
- terraza;
- parcela libre.

Estado final antes de ∞:
- madera 15;
- piedra 10;
- personaje (10,1,z3).

### Matriz
PASS:
- 320 / 390 / 1440 sin overflow horizontal;
- targets visibles mínimos = 44 px;
- NORMAL / REDUCED / NONE seleccionables;
- forced-colors smoke;
- guardado + recarga + Continuar;
- 0 page/console errors en las rutas Prisma.

### ZIP extraído
PASS:
- ZIP local extraído;
- `juegos.html` abierto por `file://`;
- CSS/JS locales cargados;
- ruta A completa hasta parcela libre;
- 0 recursos de red / 0 recursos faltantes.

## Límites R01

- arte funcional/provisional;
- un escenario;
- sin backend, sonido ni multijugador;
- Deshacer no persiste tras recarga; la partida sí;
- modo libre limitado a la misma cuadrícula/reglas del prototipo.

## Artifact GitHub Actions

Commit:
`29a8770f235e75cd99a8758a07f06923acb99b7d`

Run:
`37326606367 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_PLAYABLE_R01`

Artifact ID:
`11351693774`

ZIP jugable interno:
`PRISMA_CONSTRUCTION_PLAYABLE_R01.zip`

SHA-256 del ZIP jugable:
`ef30977cc5327c0b17fb42b2d03a54827e5f130ae12bf5cf349ec08b47d38f87`

Digest del contenedor GitHub:
`sha256:a8357d92e169158cff533aeb9398b8f66c60dc49ce2ea395a7d0785dd7b88a57`

Entrada tras extraer:
`juegos.html`

No necesita servidor ni instalación.

## Siguiente

`AXIOMA QA RUNTIME → HUMAN QA MARÍA JUGANDO`

No se declara:
- `AXIOMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_HUMAN_QA`;
- HUMAN QA;
- integración en main.

`NO MAIN · NO PRODUCCIÓN`
