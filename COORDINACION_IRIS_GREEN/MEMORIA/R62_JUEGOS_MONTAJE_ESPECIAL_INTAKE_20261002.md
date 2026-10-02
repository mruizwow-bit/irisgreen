# R62 · JUEGOS · MONTAJE ESPECIAL · INTAKE PARCIAL · 02/10/2026

## Estado
`R62_SPECIAL_ASSEMBLY_INTAKE_PARTIAL_MORE_EXPECTED`

María confirma que quedan más paquetes por entregar.

Este documento NO cierra el inventario de Juegos.
Solo fija la naturaleza especial de:
- P01 · Habitación imposible;
- P02 · Terrario vivo;
- P03 · Rutas de luz;
- P04 · Ritmo de colores / bloque Golpe y plan.

## Regla
Estas entregas NO son un conjunto de imágenes estáticas.
No se pueden integrar copiando PNG/SVG/WebP aislados.

Se deben preservar:
- commits/bundles;
- motores compartidos;
- generadores;
- overlays;
- tests/gates;
- arte/renders;
- relaciones de prerequisite;
- estados aprobados;
- evidencia HUMAN QA.

## Cadena canónica recuperada

### Carrier principal P01 + P02 + P03 + mecanismo inicial P04
`r62-p03-cadena_2.bundle`

- bytes: 11,096,689
- SHA-256: `2f61695b23258409673f072f18104fbf7a48e83e7a526c2d864188e89c175f6e`
- prerequisite: `318a5745789922b82e96bfaebd1536cac240a43e`
- HEAD: `2e559991762aca18b7c62f65f4df83ecfbee519b`

Este carrier contiene la secuencia R62 P01/P02/P03 y deja preparado el mecanismo P04.
No sustituirlo por imágenes.

### P04 · sala
`r62-p04-sala_1.bundle`

- bytes: 1,068,383
- SHA-256: `ddbe75ce59cecadd1750a289b157bd2bbc53f04e3df0f0e7f84512d78e3b6bd5`
- prerequisite: `2e559991762aca18b7c62f65f4df83ecfbee519b`
- HEAD: `8bc07acd962cd4a88b29890997efda8642df293d`

### P04 · golpe + plan
`r62-p04-golpe-y-plan_1.bundle`

- bytes: 1,072,875
- SHA-256: `d0b7466c6914e913e45f7711688ba3ad67e5f9528fc2b5788dfaff5e6998bb12`
- prerequisite: `8bc07acd962cd4a88b29890997efda8642df293d`
- HEAD: `041bfc3129569f06e621b1bc9a65ff87be84dd86`

Cadena:
`318a5745 → r62-p03-cadena → 2e559991 → p04-sala → 8bc07acd → p04-golpe-y-plan → 041bfc31`

NO aplicar P04 fuera de ese orden.

## Material histórico/supporting recibido

### iris-claude_7.bundle
SHA-256:
`f5ef74e632c433a09ba88d3f50573a1c1467fe99630c9c0d5995bb7029d1c3cd`

Incluye heads históricos:
- R42 recursos;
- R57 clasificación;
- P01 `6aee2c7a...`;
- P02 concepto `7920d92f...`.

### iris-claude_6.bundle
SHA-256:
`b528b507e5dcd3302ffab4385d58aa3bf49abf18b22959a6efcf4093f95e6c40`

Incluye:
- P01 `57f42348...`;
- P02 E4 `0e8e3652...`.

### iris-claude_5.bundle
SHA-256:
`a376d9272a7af31395a44f8f1ab0854a4f8b2ccca6a79d43a9b5a1e9067948c6`

Añade:
- P03 inicial `bcfb013c...`.

Estos tres son material de historia/transporte.
No deben prevalecer sobre la cadena fina canónica posterior si los mismos deltas ya están contenidos en ella.

## Parches recibidos

`r62-p02-terrario-e4_3.patch`
SHA-256:
`a2f989372216d396267b174b04877e75513dc04b16a45622045f3615546b960d`

Contiene la evolución de P02:
- concepto;
- rebuild E4;
- medición;
- refinamiento;
- causalidad;
- shared `scripts/ig_render_e4.py`;
- `r62_p02_render.py`;
- `r62_p02_overlay.py`;
- tests.

`r62-p03-rutas-luz_1.patch`
SHA-256:
`63200884be8acf10fe1aa415ed2905bc675d643e826a3f5427c61ba75a260991`

Es una entrega inicial de P03 y NO sustituye la cadena posterior P03 HUMAN-approved.

## Contrato de montaje por producto

### P01 · Habitación imposible
- producto/render E4;
- desktop + mobile;
- LIGHT + NAVY;
- stage oscuro es contenido y se mantiene en ambos temas;
- chrome cambia por tema;
- motor/render first-party;
- tokens/global contract asociado.

Estado conocido:
`R62_P01_HABITACION_E4_HUMAN_APPROVED`

### P02 · Terrario vivo
- comparte motor E4 con P01;
- cámara/material/luz propios;
- heightfield + causalidad roca → sombra → humedad → musgo;
- overlay puede rehacerse sin rerender completo;
- mobile tiene composición propia;
- mantener gate técnico + juicio humano separados.

### P03 · Rutas de luz
- gameplay calculado, no lámina decorativa;
- motor/generador + test;
- causalidad antes/después;
- P03 HUMAN-approved en la cadena posterior;
- no reabrir visualmente por usar un patch inicial antiguo.

### P04 · Ritmo de colores
No es un archivo autónomo.
Su cadena de montaje es:
mecanismo en carrier P03 → sala → golpe/plan.

No integrar `golpe-y-plan` sin su prerequisite `p04-sala`.

## Library · destino esperado por Nexo
`/Iris Green/Handoffs/ENTRADAS_CANONICAS/JUEGOS_R62_MONTAJE_ESPECIAL/`

Propuesta de clasificación:
- `CANON_CHAIN/`
- `EVIDENCIA_VISUAL/`
- `GATES_Y_DOCUMENTOS/`
- `HISTORICO_SUPERSEDED/`

Nexo decide nombres finales coherentes con su inventario canónico, sin crear una segunda taxonomía incompatible.

## Integración
Preservar != integrar.

Antes de main:
1. inventario completo de todos los paquetes que María aún va a aportar;
2. precedencia exacta;
3. identificar carrier canónico por producto;
4. recuperar motor/generadores, no solo renders;
5. reconciliar contra main vivo;
6. runtime/product QA;
7. HUMAN QA cuando corresponda;
8. solo entonces merge.

No reconstruir P01/P02/P03 desde cero.
No copiar renders como sustituto del runtime.
No aplicar bundles históricos completos a main.
