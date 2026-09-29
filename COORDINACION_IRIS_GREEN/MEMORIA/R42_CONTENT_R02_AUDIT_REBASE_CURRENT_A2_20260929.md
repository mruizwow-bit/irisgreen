# R42 · Contenido R02 · auditoría y rebase final sobre A2 vivo · 29/09/2026

Estado:

`R42_CONTENT_R02_AUDITED_CURRENT_A2_REBASE_REQUIRED`

## Paquete

`iris-green-contenido-R42-20260929.zip`  
SHA-256 `aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`.

La reorientación de producto es correcta: primero integración/categorización/child-safe, después ampliación editorial nueva.

## Qué pasa la auditoría de dirección

KEEP:
- contenido R01 conservado y rebasado, no reinvestigado;
- 204 páginas nuevas regeneradas;
- inventario 226/223/62/60/132/262;
- Investigación 132 real;
- clasificación AGE de A2 consumida, no duplicada;
- 965 registros canónicos, 0 sin clasificar, 0 age legacy;
- `global-395` TEPT complejo = AGE_13_17 + AGE_18_PLUS / S2 / SAFE_VARIANT_REQUIRED;
- guardarraíl exacto de inventario;
- correcciones jurídicas verificadas por spot-check oficial;
- 0 fallos nuevos declarados sobre la base usada.

## Por qué todavía no es integrable

El ZIP se construyó sobre `9c721a79`.

Al revisar, PR #244/A2 ya está en:
`2fcb193feaecaa6934e96c14e0eda06d016d0250`,
5 commits por delante.

A2 modificó `scripts/build_site.py` para incorporar R67 Taller shell y tests. El ZIP contiene una versión anterior del mismo archivo. Overlay directo = regresión.

Por tanto el marcador propuesto `R42_CONTENT_R01_REBASED_CHILD_SAFE_READY_FOR_ASTRA` queda aplazado hasta un rebase final.

## Fuentes

NHS England OSA:
- publicación 16/11/2023;
- última actualización 16/09/2024.

WHO Gaming disorder FAQ:
- la página actual no expone fecha de publicación;
- mantener “sin fecha visible” + fecha de consulta;
- la noticia WHO del 14/09/2018 es una fuente separada, no la fecha de la FAQ.

R01 tenía 66 URL distintas y R02 aporta 60 en `FUENTES.csv`; falta explicar el delta.

La memoria del ZIP cita un `fuentes.json` que no está empaquetado. Corregir documentación o incluir la fuente reproducible.

## Rutas de clasificación

La deuda declarada como “405 URL” no coincide con la inspección del archivo canónico A2.

Conteo observado por campos:
- 71 rutas relativas en Datos;
- 132 rutas EN Investigación inexistentes;
- 262 rutas EN directorio inexistentes;
- total: 465 campos anómalos;
- 204 strings raw únicos.

No se bloquea el contenido por este punto si runtime sigue normalizando y QA pasa, pero el conteo y la propiedad de la reparación deben quedar exactos.

## Siguiente paso

Claude rehace únicamente el rebase/empaquetado sobre HEAD A2 vivo y repite QA. No ampliar catálogo todavía.

Orden:
`ORDENES/R42_CONTENT_R02_REBASE_CURRENT_A2/01_CLAUDE.md`.

No normativa transversal nueva.
