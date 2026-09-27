# R48 · Claude · Intereses definitivos · auditoría + emisión · 27/09/2026

Issue operativo: #309
Estado: `R48_CLAUDE_INTERESES_ORDERED`

## Diagnóstico Astra

Fuente auditada:
`agent4/r42-interests-visual-20260926`.

Hallazgos:
- 72 temáticas válidas como catálogo;
- 20 objetivos formulados como “todo/todos/todas”;
- 72 temas reducidos a 11 firmas de modos repetidas;
- canvas procedural genérico por familia usado como experiencia profunda;
- Design R02 no integrado;
- child-safe no integrado;
- fuente/dataset confundido con alcance del producto.

## Decisión

Se conservan:
- 72 temáticas;
- 11 grupos;
- rutas ES/EN;
- procedencia;
- READY/HOLD;
- experiencias profundas válidas;
- conexiones con Taller;
- Cuaderno como base.

A4 R42 pasa a:
`DONOR_NOT_FINAL`.

## Regla maestra

`SOURCE_DATA != EXPERIENCE_SCOPE`

Cada interés debe tener:
- pregunta central;
- acción principal;
- renderer;
- subset/query;
- profundidad bajo demanda;
- must_not_load;
- map_role;
- child-safe;
- etapa;
- criterio HUMAN QA.

## Mapas

Mapa solo cuando la localización responde a la pregunta.

`PRIMARY | SECONDARY | NONE`.

Mapas y geografía es el lugar natural del globo general.
No duplicar globo/mapa mundial en temáticas sin necesidad.

## NASA

NASA se divide por propósito:
- cielo: HYG/IAU;
- sistema solar: cuerpos principales + campos JPL necesarios;
- exoplanetas: 12–24 representativos + TAP bajo demanda;
- eclipses: España 2026–2028 + ubicación manual;
- meteoros: lluvias principales;
- exploración: 12–20 hitos;
- ISS: ISS + ubicación manual.

No cargar “todo NASA”.

## Otras fuentes

- GBIF: filtros concretos, no occurrence store completo;
- Wikidata: queries focalizadas;
- Met: recorrido curado, no 492k obras;
- Natural Earth: escala/capas necesarias;
- PubChem: no todos los compuestos.

## Child-safe

Contrato #293/#302:
`SAFE_BY_DEFAULT`, audience/sensitivity/discovery/safe_variant.

Filtrar antes de búsqueda/autocomplete/destacados/related/fuentes.

## Design

R02 100 % Intereses + Cuaderno.

## Cuaderno

Workspace de observación.
Mapa/lugar opcional, nunca mapa mundial + formulario por defecto.
Sin geolocalización al entrar.

## Gate

Claude publica:
`R48_CLAUDE_INTERESES_BASE_READ`

Entrega:
`R48_CLAUDE_INTERESES_REBUILD_READY_FOR_ASTRA`.

Secuencia:
Claude → Astra → A2 → Deploy Preview → HUMAN QA María.

Orden completa:
`ORDENES/R48_CLAUDE_INTERESES_DEFINITIVOS/01_CLAUDE.md`.
