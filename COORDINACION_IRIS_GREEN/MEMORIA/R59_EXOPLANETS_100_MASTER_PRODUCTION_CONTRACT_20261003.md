# R59 · EXOPLANETAS · CONTRATO DE PRODUCCIÓN 100 MASTERS

Fecha: 03/10/2026
Autoridad: María
Owner de producción actual: Senda

Estado:
`EXOPLANETS_100_MASTER_PIPELINE_LOCKED`

## Alcance

100 exoplanetas = 10 tandas × 10.

Orden:
primeros 100 registros del snapshot local canónico:
`es/intereses/exoplanetas/exoplanetas.json`.

## Regla visual

Cada output de producción:
- 1 exoplaneta por master;
- sin texto;
- sin números;
- sin etiquetas;
- sin UI;
- sin contact sheet generado por modelo;
- fondo transparente;
- sRGB;
- familia visual coherente;
- clase `REPRESENTATION`;
- no escala;
- no observación.

El productor puede usar lenguaje visual coherente con masa/radio/temperatura/clase cuando exista soporte suficiente, pero NO inventa:
- continentes;
- océanos;
- vegetación;
- meteorología;
- superficie observada;
- habitabilidad;
- color real no medido.

## Datos

Los datos científicos NO se escriben dentro de la imagen generada.

Pipeline:
`MASTER LIMPIO → JSON CANÓNICO → PLANTILLA CONTACT SHEET → REVIEW FINAL`

La plantilla, no el generador visual, introduce:
- nombre;
- estrella;
- tipo;
- masa;
- radio;
- periodo;
- distancia;
- método;
- año.

Campo ausente = `—`.
No desplazar datos entre mundos.
No convertir estimación en medición sin etiqueta.

## Revisión

María ha fijado:
`REVIEW_AFTER_BATCH_10`

No HUMAN QA intermedia obligatoria entre las tandas 01–10.
Si durante producción aparece corrupción técnica evidente, se corrige sin abrir revisión estética global.

## Tandas

B01 001–010
B02 011–020
B03 021–030
B04 031–040
B05 041–050
B06 051–060
B07 061–070
B08 071–080
B09 081–090
B10 091–100

## Dirección visual

`KEEP_DIRECTION`

Los contact sheets experimentales anteriores:
`FAIL_DATA_AND_COMPOSITING`

No se adoptan como arte final ni como fuente factual.

Gate final:
`EXOPLANETS_100_MASTERS_READY_FOR_FINAL_REVIEW`
